export function getUpgradeEmailHtml({ plan, generationsAllowed }) {
  const isPro = plan === 'pro';
  const accentColor = isPro ? '#7C3AED' : '#059669';
  const planLabel = isPro ? 'Pro' : 'Agency';
  const generationsText = isPro ? '100 generations/month' : 'Unlimited generations';
  const features = isPro
    ? ['100 AI generations per month', 'Property Listing Writer', 'Social Media Captions', 'Buyer Email Templates', 'Contract Summarizer', 'Generation history']
    : ['Unlimited AI generations', 'Property Listing Writer', 'Social Media Captions', 'Buyer Email Templates', 'Contract Summarizer', 'Generation history', 'Priority support'];

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to ListingAI ${planLabel}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:${accentColor};padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">🏠 ListingAI</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">AI-Powered Real Estate Content</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 8px;color:#111827;font-size:22px;">You're now on the ${planLabel} plan! 🎉</h2>
              <p style="margin:0 0 24px;color:#6b7280;font-size:15px;line-height:1.6;">
                Thank you for upgrading. Your account has been activated with full ${planLabel} access. Here's what you now have:
              </p>

              <!-- Plan badge -->
              <div style="background:${accentColor}15;border:1px solid ${accentColor}30;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
                <p style="margin:0;color:${accentColor};font-weight:700;font-size:16px;">${planLabel} Plan — ${generationsText}</p>
              </div>

              <!-- Features -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                ${features.map(f => `
                <tr>
                  <td style="padding:6px 0;color:#374151;font-size:14px;">
                    <span style="color:${accentColor};margin-right:10px;font-size:16px;">✓</span>${f}
                  </td>
                </tr>`).join('')}
              </table>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="background:${accentColor};border-radius:8px;">
                    <a href="https://listingai-rose.vercel.app/generate" style="display:inline-block;padding:14px 32px;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;">
                      Start Generating →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;color:#6b7280;font-size:14px;line-height:1.6;">
                If you have any questions, just reply to this email — we're happy to help.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;text-align:center;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">
                © 2025 ListingAI · You received this because you upgraded your plan
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

const PLAN_PRICES = { pro: 29, agency: 79 };

export function getPreRenewalReminderEmailHtml({ plan, renewalDate }) {
  const isPro = plan === 'pro';
  const accentColor = isPro ? '#7C3AED' : '#059669';
  const planLabel = isPro ? 'Pro' : 'Agency';
  const amount = PLAN_PRICES[plan] || 0;

  const formattedDate = new Date(renewalDate).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your ListingAI ${planLabel} plan renews soon</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:${accentColor};padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">🏠 ListingAI</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">AI-Powered Real Estate Content</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 8px;color:#111827;font-size:22px;">Your ${planLabel} plan renews soon</h2>
              <p style="margin:0 0 24px;color:#6b7280;font-size:15px;line-height:1.6;">
                Just a heads-up — your ListingAI ${planLabel} subscription will renew automatically on <strong>${formattedDate}</strong>.
              </p>

              <!-- Plan badge -->
              <div style="background:${accentColor}15;border:1px solid ${accentColor}30;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
                <p style="margin:0;color:${accentColor};font-weight:700;font-size:16px;">${planLabel} Plan — $${amount} on ${formattedDate}</p>
              </div>

              <p style="margin:0 0 24px;color:#6b7280;font-size:14px;line-height:1.6;">
                No action needed if everything looks right — your card on file will be charged automatically. If you'd like to update your payment method or turn off auto-renew, you can do that anytime from your dashboard.
              </p>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                <tr>
                  <td style="background:${accentColor};border-radius:8px;">
                    <a href="https://listingai-rose.vercel.app/dashboard" style="display:inline-block;padding:14px 32px;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;">
                      Manage Billing →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;color:#6b7280;font-size:14px;line-height:1.6;">
                If you have any questions, just reply to this email — we're happy to help.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;text-align:center;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">
                © 2025 ListingAI · You received this because you have an active subscription
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export function getPaymentFailedEmailHtml({ plan, graceEndsAt }) {
  const isPro = plan === 'pro';
  const accentColor = isPro ? '#7C3AED' : '#059669';
  const planLabel = isPro ? 'Pro' : 'Agency';
  const warningColor = '#DC2626';

  const formattedDate = new Date(graceEndsAt).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Action needed: ListingAI payment failed</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:${warningColor};padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">🏠 ListingAI</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">AI-Powered Real Estate Content</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 8px;color:#111827;font-size:22px;">We couldn't process your payment ⚠️</h2>
              <p style="margin:0 0 24px;color:#6b7280;font-size:15px;line-height:1.6;">
                Your most recent charge for the ListingAI ${planLabel} plan didn't go through — usually this means the card on file has expired or didn't have enough available balance.
              </p>

              <!-- Plan badge -->
              <div style="background:${warningColor}15;border:1px solid ${warningColor}30;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
                <p style="margin:0;color:${warningColor};font-weight:700;font-size:16px;">Your access continues until ${formattedDate}</p>
              </div>

              <p style="margin:0 0 24px;color:#6b7280;font-size:14px;line-height:1.6;">
                We'll automatically retry the charge over the next few days. To avoid any interruption, you can update your payment method now — it only takes a minute.
              </p>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                <tr>
                  <td style="background:${accentColor};border-radius:8px;">
                    <a href="https://listingai-rose.vercel.app/dashboard" style="display:inline-block;padding:14px 32px;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;">
                      Update Payment Method →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;color:#6b7280;font-size:14px;line-height:1.6;">
                If you'd rather not continue, no action is needed — your account will simply move to the Free plan if payment isn't resolved by ${formattedDate}.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;text-align:center;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">
                © 2025 ListingAI · You received this because of an issue with your subscription payment
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export function getFinalWarningEmailHtml({ plan, daysRemaining, graceEndsAt }) {
  const isPro = plan === 'pro';
  const planLabel = isPro ? 'Pro' : 'Agency';
  const warningColor = '#DC2626';

  const formattedDate = new Date(graceEndsAt).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  const dayText = daysRemaining === 1 ? '1 day' : `${daysRemaining} days`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Final notice: ListingAI ${planLabel} access ending soon</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:${warningColor};padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">🏠 ListingAI</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">AI-Powered Real Estate Content</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 8px;color:#111827;font-size:22px;">Your access ends in ${dayText} ⏰</h2>
              <p style="margin:0 0 24px;color:#6b7280;font-size:15px;line-height:1.6;">
                We still haven't been able to process your payment for the ListingAI ${planLabel} plan. If this isn't resolved by <strong>${formattedDate}</strong>, your account will automatically move to the Free plan (5 generations/month).
              </p>

              <!-- Plan badge -->
              <div style="background:${warningColor}15;border:1px solid ${warningColor}30;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
                <p style="margin:0;color:${warningColor};font-weight:700;font-size:16px;">Downgrades on ${formattedDate} unless resolved</p>
              </div>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                <tr>
                  <td style="background:${warningColor};border-radius:8px;">
                    <a href="https://listingai-rose.vercel.app/dashboard" style="display:inline-block;padding:14px 32px;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;">
                      Update Payment Method →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;color:#6b7280;font-size:14px;line-height:1.6;">
                No action needed if you're okay moving to the Free plan — nothing further will be charged.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;text-align:center;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">
                © 2025 ListingAI · You received this because of an issue with your subscription payment
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}