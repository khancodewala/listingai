import { validateEvent, WebhookVerificationError } from '@polar-sh/sdk/webhooks';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

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

  // ✅ Get the subscription ID from the event
  const subscriptionId = event.data?.id || event.data?.subscription?.id;

  console.log('EXTRACTED:', { userId, plan, subscriptionId, eventType: event.type });

  if (!userId || !plan) {
    console.error('Missing userId or plan in metadata:', metadata);
    return NextResponse.json({ received: true, warning: 'Missing metadata' });
  }

  if (
    event.type === 'subscription.active' ||
    (event.type === 'subscription.updated' && event.data.status === 'active')
  ) {
    const { error } = await supabase
      .from('profiles')
      .update({
        plan,
        // ✅ Save the subscription ID so we can cancel later
        polar_subscription_id: subscriptionId || null,
      })
      .eq('id', userId);

    if (error) console.error('Supabase update error:', error);
    else console.log(`Updated user ${userId} to plan ${plan}, subscription ${subscriptionId}`);
  }

  // ⚠️ Only subscription.revoked should downgrade the user to free.
  // subscription.canceled fires immediately when a customer cancels, but per
  // Polar's docs the subscription stays active with cancel_at_period_end: true
  // until the billing period actually ends — access should continue until then,
  // matching the grace-period promise shown in the app's cancel modal.
  // subscription.revoked fires only when access should actually be removed
  // (period end reached, or an immediate/forced cancellation).
  if (event.type === 'subscription.revoked') {
    const { error } = await supabase
      .from('profiles')
      .update({ plan: 'free', polar_subscription_id: null })
      .eq('id', userId);

    if (error) console.error('Supabase revoke error:', error);
    else console.log(`Revoked subscription for user ${userId}, downgraded to free`);
  }

  // subscription.canceled is logged for visibility but no longer changes plan —
  // the user correctly keeps their current plan until subscription.revoked fires.
  if (event.type === 'subscription.canceled') {
    console.log(`Subscription canceled (grace period active) for user ${userId} — plan unchanged until revoked`);
  }

  return NextResponse.json({ received: true });
}