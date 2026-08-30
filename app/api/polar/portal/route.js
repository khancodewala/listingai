import { Polar } from '@polar-sh/sdk';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
});

export async function POST(req) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('polar_customer_id')
      .eq('id', user.id)
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