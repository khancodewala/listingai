import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    // Get the user session from Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the user's polar_subscription_id from profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('plan, polar_subscription_id')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    if (profile.plan === 'free') {
      return NextResponse.json({ error: 'No active subscription to cancel' }, { status: 400 });
    }

    if (!profile.polar_subscription_id) {
      return NextResponse.json({ error: 'No subscription ID found' }, { status: 400 });
    }

    // Call Polar API to cancel the subscription
    const polarRes = await fetch(
      `https://api.polar.sh/v1/subscriptions/${profile.polar_subscription_id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${process.env.POLAR_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!polarRes.ok) {
      const errorData = await polarRes.json();

      // Polar says this subscription is already cancelled (or scheduled to cancel
      // at period end). That's not actually a failure from the user's perspective —
      // their cancellation request has already been honored. Treat it as success
      // instead of surfacing a scary error, and let the existing webhook handler
      // drive the actual plan downgrade in Supabase when the period ends.
      if (errorData?.error === 'AlreadyCanceledSubscription') {
        console.log(`Subscription ${profile.polar_subscription_id} already cancelled on Polar for user ${user.id} — treating as success`);
        return NextResponse.json({
          success: true,
          alreadyCancelled: true,
        });
      }

      console.error('Polar cancel error:', errorData);
      return NextResponse.json({ error: 'Failed to cancel with Polar' }, { status: 500 });
    }

    console.log(`Cancelled subscription ${profile.polar_subscription_id} for user ${user.id}`);

    // Polar webhook will fire subscription.revoked and update Supabase automatically
    // But we return success immediately so the UI updates
    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('Cancel subscription error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}