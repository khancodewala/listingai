import { Polar } from '@polar-sh/sdk';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
});

const PRICE_MAP = {
  pro: process.env.POLAR_PRO_PRICE_ID,
  agency: process.env.POLAR_AGENCY_PRICE_ID,
};

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

    const { plan } = await req.json();
    const priceId = PRICE_MAP[plan];

    if (!priceId) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const checkout = await polar.checkouts.create({
      products: [priceId],
      customerEmail: user.email,
      metadata: { userId: user.id, plan },
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
    });

    return NextResponse.json({ url: checkout.url });
  } catch (err) {
    console.error('Polar checkout error:', err);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}