import { validateEvent, WebhookVerificationError } from '@polar-sh/sdk/webhooks';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { resend } from '@/lib/resend';
import { getUpgradeEmailHtml } from '@/lib/emails';

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

  // ✅ Handle upgrade
  if (
    event.type === 'subscription.active' ||
    (event.type === 'subscription.updated' && event.data.status === 'active')
  ) {
    // 1. Update Supabase
    const { error } = await supabase
      .from('profiles')
      .update({
        plan,
        polar_subscription_id: subscriptionId || null,
      })
      .eq('id', userId);

    if (error) {
      console.error('Supabase update error:', error);
    } else {
      console.log(`Updated user ${userId} to plan ${plan}`);
    }

    // 2. Get user email from Supabase Auth
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);

    if (userError || !userData?.user?.email) {
      console.error('Could not fetch user email:', userError);
    } else {
      const userEmail = userData.user.email;
      const planLabel = plan === 'pro' ? 'Pro' : 'Agency';
      const generationsAllowed = plan === 'pro' ? '100' : 'Unlimited';

      try {
        await resend.emails.send({
          from: 'ListingAI <onboarding@resend.dev>',
          to: userEmail,
          subject: `🎉 Welcome to ListingAI ${planLabel} — You're all set!`,
          html: getUpgradeEmailHtml({ plan, generationsAllowed }),
        });
        console.log(`Upgrade email sent to ${userEmail}`);
      } catch (emailErr) {
        console.error('Resend email error:', emailErr);
      }
    }
  }

  // ✅ Handle cancellation / revoke
  if (event.type === 'subscription.revoked' || event.type === 'subscription.canceled') {
    const { error } = await supabase
      .from('profiles')
      .update({ plan: 'free', polar_subscription_id: null })
      .eq('id', userId);

    if (error) console.error('Supabase revoke error:', error);
    else console.log(`Revoked subscription for user ${userId}, downgraded to free`);
  }

  return NextResponse.json({ received: true });
}