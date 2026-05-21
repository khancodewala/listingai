import { Polar } from '@polar-sh/sdk';
import { NextResponse } from 'next/server';

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
});

const PRICE_MAP = {
  pro: process.env.POLAR_PRO_PRICE_ID,
  agency: process.env.POLAR_AGENCY_PRICE_ID,
};

export async function POST(req) {
  try {
    const { plan, userId, userEmail } = await req.json();

    const priceId = PRICE_MAP[plan];

    if (!priceId) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const checkout = await polar.checkouts.create({
      products: [priceId],
      customerEmail: userEmail,
      metadata: { userId, plan },
      successUrl: `${process.env.NEXT_PUBLIC_URL}/success`,
    });

    return NextResponse.json({ url: checkout.url });
  } catch (err) {
    console.error('Polar checkout error:', err);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}