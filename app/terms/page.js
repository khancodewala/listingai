import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms of Service | ListingAI",
  description: "The terms governing your access to and use of ListingAI.",
  robots: { index: false, follow: true },
};

export default function TermsOfServicePage() {
  return (
    <div style={{ background: "#FAF8F2", minHeight: "100vh" }}>
      <Navbar />

      <style dangerouslySetInnerHTML={{ __html: `
        .legal-content h1.legal-title {
          font-family: var(--font-playfair);
          color: #10202E;
          font-size: 34px;
          font-weight: 700;
          margin: 0 0 6px;
          line-height: 1.2;
        }
        .legal-content .legal-updated {
          color: #55606A;
          font-size: 14px;
          font-style: italic;
          margin-bottom: 32px;
        }
        .legal-content h2 {
          font-family: var(--font-playfair);
          color: #185F85;
          font-size: 22px;
          font-weight: 700;
          margin: 36px 0 12px;
        }
        .legal-content h2:first-of-type { margin-top: 0; }
        .legal-content h3 {
          font-family: var(--font-dm-sans);
          color: #10202E;
          font-size: 16px;
          font-weight: 700;
          margin: 20px 0 10px;
        }
        .legal-content p {
          font-family: var(--font-dm-sans);
          color: #33393F;
          font-size: 15.5px;
          line-height: 1.75;
          margin: 0 0 14px;
        }
        .legal-content ul {
          margin: 0 0 16px;
          padding-left: 22px;
        }
        .legal-content li {
          font-family: var(--font-dm-sans);
          color: #33393F;
          font-size: 15.5px;
          line-height: 1.75;
          margin-bottom: 8px;
        }
        .legal-content strong { color: #10202E; }
        .legal-content a {
          color: #185F85;
          text-decoration: underline;
        }
      ` }} />

      <main style={{ maxWidth: "820px", margin: "0 auto", padding: "56px 24px 80px" }}>
        <div style={{
          background: "#ffffff",
          border: "1px solid #ECE8DD",
          borderRadius: "16px",
          padding: "48px",
          boxShadow: "0 4px 24px rgba(16,32,46,0.05)",
        }}>
          <div className="legal-content">
            <h1 className="legal-title">Terms of Service</h1>
            <p className="legal-updated">Last updated: August 25, 2026</p>

            <p>
              These Terms of Service ("Terms") govern your access to and use of ListingAI (the "Service"), operated
              by Tauqeer Ahmed ("we," "us," or "our"). By creating an account or using the Service, you agree to be
              bound by these Terms. If you do not agree, do not use the Service.
            </p>

            <h2>1. The Service</h2>
            <p>
              ListingAI is an AI-powered content generation platform for real estate professionals, providing tools
              including but not limited to listing descriptions, social media captions, buyer emails, contract
              summaries, open house announcements, neighborhood descriptions, price reduction alerts, video scripts,
              realtor bios, and blog content.
            </p>

            <h2>2. Eligibility &amp; Account Registration</h2>
            <p>
              You must be at least 18 years old and capable of forming a binding contract to use the Service. You are
              responsible for maintaining the confidentiality of your account credentials and for all activity that
              occurs under your account. You agree to provide accurate and complete information when registering.
            </p>

            <h2>3. Subscription Plans &amp; Billing</h2>

            <h3>3.1 Plans</h3>
            <p>ListingAI currently offers the following plans:</p>
            <ul>
              <li>Free — $0/month, limited monthly generations</li>
              <li>Pro — $29/month, up to 100 generations per month</li>
              <li>Agency — $79/month, unlimited generations</li>
            </ul>
            <p>Plan features and pricing may change; we will provide reasonable notice of material changes to paid plans.</p>

            <h3>3.2 Payment &amp; Renewal</h3>
            <p>
              Paid subscriptions are billed on a recurring monthly basis through our payment processor, Polar (via
              Stripe Connect), and automatically renew each billing cycle unless cancelled before the renewal date.
              You authorize us to charge your chosen payment method for all applicable fees.
            </p>

            <h3>3.3 Cancellation &amp; Refunds</h3>
            <p>
              You may cancel your subscription at any time from your account dashboard; cancellation takes effect at
              the end of your current billing period, and you will retain access until then. Except where required
              by law, fees already paid are non-refundable.
            </p>

            <h3>3.4 Failed Payments</h3>
            <p>
              If a payment fails, we will attempt to notify you and may apply a grace period before restricting
              access to paid features or downgrading your account.
            </p>

            <h2>4. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the Service for any unlawful purpose or in violation of any applicable real estate advertising law or regulation, including fair housing laws</li>
              <li>Generate content that is discriminatory, false, misleading, or fraudulent</li>
              <li>Attempt to circumvent usage limits, security measures, or access controls</li>
              <li>Reverse-engineer, resell, or use the Service to build a competing product</li>
              <li>Use automated means to scrape or excessively query the Service outside normal use</li>
            </ul>

            <h2>5. AI-Generated Content Disclaimer</h2>
            <p>
              Content generated by the Service is produced using artificial intelligence and is provided as a
              drafting aid only. AI-generated output may contain inaccuracies, and we make no guarantee as to its
              factual correctness, legal compliance, or fitness for any particular purpose. You are solely
              responsible for reviewing, editing, fact-checking, and ensuring that any content you publish or send
              complies with applicable laws, including fair housing and real estate advertising regulations, before
              using it.
            </p>

            <h2>6. Ownership of Content</h2>
            <p>
              As between you and us, you own the content you generate through the Service, subject to your
              compliance with these Terms and applicable law. You grant us a limited license to process your inputs
              and outputs solely to provide and improve the Service.
            </p>

            <h2>7. Third-Party Services</h2>
            <p>
              The Service relies on third-party providers, including Supabase, Vercel, Polar/Stripe, Resend,
              Anthropic, and optionally Google Sign-In. We are not responsible for outages, errors, or issues arising
              from these third-party services.
            </p>

            <h2>8. Intellectual Property</h2>
            <p>
              The Service, including its software, design, branding, and underlying technology, is owned by Tauqeer
              Ahmed and protected by applicable intellectual property laws. Nothing in these Terms grants you any
              right to use our trademarks or branding without prior written permission.
            </p>

            <h2>9. Termination</h2>
            <p>
              We may suspend or terminate your access to the Service at our discretion, with or without notice, if
              we believe you have violated these Terms, engaged in fraudulent or abusive behavior, or for
              non-payment. You may stop using the Service and cancel your account at any time.
            </p>

            <h2>10. Disclaimer of Warranties</h2>
            <p>
              The Service is provided "as is" and "as available," without warranties of any kind, whether express or
              implied, including implied warranties of merchantability, fitness for a particular purpose, and
              non-infringement. We do not warrant that the Service will be uninterrupted, error-free, or completely
              secure.
            </p>

            <h2>11. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Tauqeer Ahmed and ListingAI shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages, or any loss of profits, revenue,
              data, or goodwill, arising from your use of or inability to use the Service, even if advised of the
              possibility of such damages. Our total liability for any claim arising from these Terms or the Service
              shall not exceed the amount you paid us in the three (3) months preceding the claim.
            </p>

            <h2>12. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Tauqeer Ahmed and ListingAI from any claims, damages, losses,
              or expenses arising from your use of the Service, your violation of these Terms, or content you
              generate, publish, or distribute using the Service.
            </p>

            <h2>13. Governing Law &amp; Dispute Resolution</h2>
            <p>
              These Terms are governed by the laws of Pakistan, without regard to its conflict-of-law principles, as
              Tauqeer Ahmed operates the Service from Pakistan. Nothing in this section limits any statutory
              consumer-protection rights you may have under the mandatory laws of your own country or region, where
              applicable. Any dispute arising from these Terms or the Service will first be attempted to be resolved
              informally by contacting us directly.
            </p>

            <h2>14. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. Material changes will be reflected by an updated "Last
              updated" date at the top of this page, and where appropriate, we will provide additional notice.
              Continued use of the Service after changes take effect constitutes acceptance of the revised Terms.
            </p>

            <h2>15. Contact Us</h2>
            <p>If you have questions about these Terms, contact Tauqeer Ahmed at:</p>
            <p>
              <strong><a href="mailto:ahmedtauqeer761@gmail.com">ahmedtauqeer761@gmail.com</a></strong>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}