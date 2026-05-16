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

  // Log full event to see exact structure
  console.log('POLAR WEBHOOK EVENT:', JSON.stringify(event, null, 2));

  // Metadata can be on the subscription or the checkout
  const metadata =
    event.data?.metadata ||
    event.data?.subscription?.metadata ||
    event.data?.checkout?.metadata ||
    {};

  const userId = metadata?.userId;
  const plan = metadata?.plan;

  console.log('EXTRACTED:', { userId, plan, eventType: event.type });

  if (!userId || !plan) {
    console.error('Missing userId or plan in metadata:', metadata);
    return NextResponse.json({ received: true, warning: 'Missing metadata' });
  }

  if (
    event.type === 'subscription.active' ||
    (event.type === 'subscription.updated' && event.data.status === 'active')
  ) {
    const { error } = await supabase.from('profiles').update({ plan }).eq('id', userId);
    if (error) console.error('Supabase update error:', error);
    else console.log(`Updated user ${userId} to plan ${plan}`);
  }

  if (event.type === 'subscription.revoked') {
    const { error } = await supabase.from('profiles').update({ plan: 'free' }).eq('id', userId);
    if (error) console.error('Supabase revoke error:', error);
  }

  return NextResponse.json({ received: true });
}