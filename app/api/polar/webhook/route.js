import { validateEvent, WebhookVerificationError } from '@polar-sh/sdk/webhooks';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { resend } from '@/lib/resend';
import { getPaymentFailedEmailHtml } from '@/lib/emails';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  const body = await req.text();
  const headers = {
    'webhook-id': req.headers.get('webhook-id'),
    'webhook-timestamp': req.headers.get('webhook-timestamp'),
    'webhook-signature': req.headers.get('webhook-signature'),
  };

  let event;
  try {
    event = validateEvent(body, headers, process.env.POLAR_WEBHOOK_SECRET);
  } catch (err) {
    if (err instanceof WebhookVerificationError) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }
    throw err;
  }

  console.log('POLAR WEBHOOK EVENT:', JSON.stringify(event, null, 2));

  const metadata =
    event.data?.metadata ||
    event.data?.subscription?.metadata ||
    event.data?.checkout?.metadata ||
    {};

  const userId = metadata?.userId;
  const plan = metadata?.plan;
  const subscriptionId = event.data?.id || event.data?.subscription?.id;

  console.log('EXTRACTED:', { userId, plan, subscriptionId, eventType: event.type });

  if (!userId || !plan) {
    console.error('Missing userId or plan in metadata:', metadata);
    return NextResponse.json({ received: true, warning: 'Missing metadata' });
  }

  // ─────────────────────────────────────────────────────────
  // active: subscription paid and in good standing.
  // Saves current_period_end as plan_expires_at so the cron can
  // send the Day -3 pre-renewal reminder.
  // Saves customer_id so the portal route works.
  // Resets renewal_reminder_sent_at so the reminder fires again
  // next cycle (not just the first month).
  // Clears payment_issue / payment_issue_since on recovery.
  // ─────────────────────────────────────────────────────────
  if (
    event.type === 'subscription.active' ||
    (event.type === 'subscription.updated' && event.data.status === 'active')
  ) {
    const { error } = await supabase
      .from('profiles')
      .update({
        plan,
        polar_subscription_id: subscriptionId || null,
        polar_customer_id: event.data.customer_id || null,
        plan_expires_at: event.data.current_period_end || null,
        renewal_reminder_sent_at: null,
        payment_issue: false,
        payment_issue_since: null,
      })
      .eq('id', userId);

    if (error) console.error('Supabase update error:', error);
    else console.log(`Updated user ${userId} to plan ${plan}, next renewal ${event.data.current_period_end}`);
  }

  // ─────────────────────────────────────────────────────────
  // past_due: payment failed. 7-day grace period keeps access active
  // while Polar retries. Flag it, record when it started (so the cron
  // knows when to send the Day 5-6 final warning), and email the user.
  // ─────────────────────────────────────────────────────────
  if (event.type === 'subscription.past_due') {
    const now = new Date();
    const graceEndsAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const { error } = await supabase
      .from('profiles')
      .update({
        payment_issue: true,
        payment_issue_since: now.toISOString(),
      })
      .eq('id', userId);

    if (error) {
      console.error('Supabase past_due update error:', error);
    } else {
      console.log(`Marked payment_issue for user ${userId}, plan ${plan} — grace period ends ${graceEndsAt.toISOString()}`);

      try {
        const { data: userData } = await supabase.auth.admin.getUserById(userId);
        if (userData?.user?.email) {
          await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: userData.user.email,
            subject: `Action needed: your ListingAI ${plan === 'pro' ? 'Pro' : 'Agency'} payment failed`,
            html: getPaymentFailedEmailHtml({
              plan,
              graceEndsAt: graceEndsAt.toISOString(),
            }),
          });
          console.log(`Payment-failed email sent to user ${userId}`);
        }
      } catch (emailErr) {
        console.error(`Failed to send payment-failed email to user ${userId}:`, emailErr);
      }
    }
  }

  // ─────────────────────────────────────────────────────────
  // revoked: grace period exhausted (or normal cancel-at-period-end).
  // Access removed. Downgrade to free, then actively cancel on Polar
  // so it stops attempting further retries against a customer who is
  // already on the free plan.
  // ─────────────────────────────────────────────────────────
  if (event.type === 'subscription.revoked') {
    const { error } = await supabase
      .from('profiles')
      .update({
        plan: 'free',
        polar_subscription_id: null,
        plan_expires_at: null,
        payment_issue: false,
        payment_issue_since: null,
      })
      .eq('id', userId);

    if (error) console.error('Supabase revoke error:', error);
    else console.log(`Revoked subscription for user ${userId}, downgraded to free`);

    if (subscriptionId) {
      try {
        const cancelRes = await fetch(
          `https://api.polar.sh/v1/subscriptions/${subscriptionId}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${process.env.POLAR_ACCESS_TOKEN}`,
            },
          }
        );
        if (!cancelRes.ok) {
          const errData = await cancelRes.json().catch(() => ({}));
          console.log(`Polar cancel-on-revoke for ${subscriptionId}: ${errData?.error || cancelRes.status} — likely already ended`);
        } else {
          console.log(`Actively cancelled subscription ${subscriptionId} on Polar to stop further retry attempts`);
        }
      } catch (cancelErr) {
        console.error(`Failed to actively cancel subscription ${subscriptionId} on Polar:`, cancelErr);
      }
    }
  }

  // ─────────────────────────────────────────────────────────
  // canceled: customer-initiated cancellation, grace period active.
  // Logged only — plan stays as-is until revoked fires.
  // ─────────────────────────────────────────────────────────
  if (event.type === 'subscription.canceled') {
    console.log(`Subscription canceled (grace period active) for user ${userId} — plan unchanged until revoked`);
  }

  return NextResponse.json({ received: true });
}