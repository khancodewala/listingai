import { Polar } from '@polar-sh/sdk';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('polar_customer_id')
      .eq('id', userId)
      .single();

    if (profileError || !profile?.polar_customer_id) {
      return NextResponse.json({ redirectToPricing: true }, { status: 200 });
    }

    const session = await polar.customerSessions.create({
      customerId: profile.polar_customer_id,
    });

    return NextResponse.json({ url: session.customerPortalUrl });
  } catch (err) {
    console.error('Polar portal error:', err);
    return NextResponse.json({ error: 'Failed to create portal session' }, { status: 500 });
  }
}