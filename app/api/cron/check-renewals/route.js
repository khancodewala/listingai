import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { resend } from '@/lib/resend';
import { getPreRenewalReminderEmailHtml, getFinalWarningEmailHtml } from '@/lib/emails';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  // Day -3 window: renewal is between 2 and 4 days from now
  // (catches anyone whose renewal falls in the 3-day heads-up window)
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  const fourDaysFromNow = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000);

  // Day 5-6 window: payment_issue_since was 5 to 6 days ago
  const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  let remindersSent = 0;
  let warningsSent = 0;
  const errors = [];

  try {
    // ─────────────────────────────────────────────────────────
    // JOB 1: Day -3 pre-renewal reminder
    // Find non-free users whose plan_expires_at (= next renewal date)
    // is 3 days away, and who haven't been reminded yet this cycle.
    // ─────────────────────────────────────────────────────────
    const { data: upcomingRenewals, error: renewalError } = await supabase
      .from('profiles')
      .select('id, plan, plan_expires_at')
      .neq('plan', 'free')
      .gte('plan_expires_at', threeDaysFromNow.toISOString())
      .lte('plan_expires_at', fourDaysFromNow.toISOString())
      .is('renewal_reminder_sent_at', null)
      .eq('payment_issue', false); // don't send renewal reminder if already past_due

    if (renewalError) throw renewalError;

    for (const profile of upcomingRenewals || []) {
      try {
        const { data: userData } = await supabase.auth.admin.getUserById(profile.id);
        if (!userData?.user?.email) continue;

        await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: userData.user.email,
          subject: `Your ListingAI ${profile.plan === 'pro' ? 'Pro' : 'Agency'} plan renews soon`,
          html: getPreRenewalReminderEmailHtml({
            plan: profile.plan,
            renewalDate: profile.plan_expires_at,
          }),
        });

        await supabase
          .from('profiles')
          .update({ renewal_reminder_sent_at: now.toISOString() })
          .eq('id', profile.id);

        remindersSent++;
      } catch (err) {
        console.error(`Pre-renewal reminder failed for user ${profile.id}:`, err);
        errors.push(`reminder:${profile.id}`);
      }
    }

    // ─────────────────────────────────────────────────────────
    // JOB 2: Day 5-6 final warning
    // Find users who entered past_due 5-6 days ago and still haven't
    // recovered — grace period ends in roughly 1-2 days.
    // ─────────────────────────────────────────────────────────
    const { data: gracePeriodUsers, error: graceError } = await supabase
      .from('profiles')
      .select('id, plan, payment_issue_since')
      .eq('payment_issue', true)
      .neq('plan', 'free')
      .gte('payment_issue_since', sevenDaysAgo.toISOString())
      .lte('payment_issue_since', fiveDaysAgo.toISOString());

    if (graceError) throw graceError;

    for (const profile of gracePeriodUsers || []) {
      try {
        const { data: userData } = await supabase.auth.admin.getUserById(profile.id);
        if (!userData?.user?.email) continue;

        const graceEndsAt = new Date(
          new Date(profile.payment_issue_since).getTime() + 7 * 24 * 60 * 60 * 1000
        );
        const daysRemaining = Math.ceil(
          (graceEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );

        await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: userData.user.email,
          subject: `Final notice: your ListingAI access ends in ${daysRemaining === 1 ? '1 day' : `${daysRemaining} days`}`,
          html: getFinalWarningEmailHtml({
            plan: profile.plan,
            daysRemaining,
            graceEndsAt: graceEndsAt.toISOString(),
          }),
        });

        warningsSent++;
      } catch (err) {
        console.error(`Final warning failed for user ${profile.id}:`, err);
        errors.push(`warning:${profile.id}`);
      }
    }

    return NextResponse.json({
      success: true,
      remindersSent,
      warningsSent,
      errors: errors.length ? errors : undefined,
    });

  } catch (err) {
    console.error('check-renewals cron error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}