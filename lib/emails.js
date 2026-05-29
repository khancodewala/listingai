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