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

  const { userId, plan } = event.data.metadata ?? {};

  if (event.type === 'subscription.active') {
    await supabase.from('profiles').update({ plan }).eq('id', userId);
  }

  if (event.type === 'subscription.revoked') {
    await supabase.from('profiles').update({ plan: 'free' }).eq('id', userId);
  }

  if (event.type === 'subscription.updated' && event.data.status === 'active') {
    await supabase.from('profiles').update({ plan }).eq('id', userId);
  }

  return NextResponse.json({ received: true });
}