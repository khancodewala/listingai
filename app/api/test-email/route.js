import { resend } from '@/lib/resend';
import { getUpgradeEmailHtml } from '@/lib/emails';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await resend.emails.send({
      from: 'ListingAI <onboarding@resend.dev>',
      to: 'ahmedtauqeer761@gmail.com',
      subject: '🎉 Welcome to ListingAI Pro — You\'re all set!',
      html: getUpgradeEmailHtml({ plan: 'pro', generationsAllowed: '100' }),
    });
    return NextResponse.json({ success: true, message: 'Email sent!' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}