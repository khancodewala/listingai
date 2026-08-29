import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy | ListingAI",
  description: "How ListingAI collects, uses, and protects your information.",

};

export default function PrivacyPolicyPage() {
  return (
    <div style={{ background: "#FAF8F2", minHeight: "100vh" }}>
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
            <h1 className="legal-title">Privacy Policy</h1>
            <p className="legal-updated">Last updated: August 25, 2026</p>

            <p>
              This Privacy Policy explains how ListingAI ("ListingAI," "we," "us," or "our"), operated by Tauqeer Ahmed,
              collects, uses, and protects your information when you use our website and AI-powered real estate content
              generation service (the "Service"). By using the Service, you agree to the collection and use of
              information as described in this policy.
            </p>

            <h2>1. Information We Collect</h2>

            <h3>1.1 Account Information</h3>
            <p>
              When you create an account, we collect the information you provide directly, or that is provided by a
              third-party sign-in provider you choose to use:
            </p>
            <ul>
              <li>Name and email address</li>
              <li>Password (stored in encrypted/hashed form; we never see or store it in plain text)</li>
              <li>If you sign in with Google, your basic Google profile information (name, email, profile photo) as authorized by you during sign-in</li>
            </ul>

            <h3>1.2 Usage &amp; Generation Data</h3>
            <p>To operate and improve the Service, we collect information about how you use it, including:</p>
            <ul>
              <li>Content generation history (the AI tool used, inputs provided, and outputs generated)</li>
              <li>Usage counts against your plan's monthly generation limit</li>
              <li>General interaction data such as pages visited and features used</li>
            </ul>

            <h3>1.3 Billing Information</h3>
            <p>
              Payments are processed by our third-party payment processor, Polar (via Stripe Connect). We do not
              collect or store your full payment card details on our own servers. We receive and store limited
              billing metadata necessary to manage your subscription, such as your plan, subscription status, and
              renewal dates.
            </p>

            <h3>1.4 Communications</h3>
            <p>
              We use Resend, a third-party email delivery service, to send transactional emails such as password
              resets, billing notifications, and renewal reminders. These emails contain only the information
              necessary to complete their purpose.
            </p>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, operate, and maintain the Service</li>
              <li>Process your subscription and manage billing</li>
              <li>Generate AI-powered content in response to your requests</li>
              <li>Enforce plan usage limits</li>
              <li>Send you account-related and billing-related communications</li>
              <li>Monitor, troubleshoot, and improve the Service</li>
              <li>Detect and prevent fraud, abuse, or violations of our Terms of Service</li>
            </ul>

            <h2>3. AI Processing of Your Content</h2>
            <p>
              When you use an AI generation tool, the inputs you provide (such as property details or listing
              information) are sent to our AI processing provider (Anthropic) to generate the requested content. We
              do not knowingly submit sensitive personal information about third parties through this process, and
              you should avoid entering personal or sensitive information about others beyond what is reasonably
              necessary for the listing or content you are creating.
            </p>

            <h2>4. Third-Party Service Providers</h2>
            <p>
              We rely on the following third-party providers to operate the Service. Each processes data under its
              own privacy policy and security practices:
            </p>
            <ul>
              <li><strong>Supabase</strong> — authentication and database hosting for your account and usage data</li>
              <li><strong>Vercel</strong> — application hosting and delivery</li>
              <li><strong>Polar / Stripe Connect</strong> — subscription billing and payment processing</li>
              <li><strong>Resend</strong> — transactional email delivery</li>
              <li><strong>Anthropic</strong> — AI content generation processing</li>
              <li><strong>Google</strong> — optional sign-in authentication, if you choose to use Google Sign-In</li>
            </ul>

            <h2>5. Cookies &amp; Similar Technologies</h2>
            <p>
              We use essential cookies and similar technologies required to keep you signed in and to maintain your
              session. We do not currently use third-party advertising or tracking cookies.
            </p>

            <h2>6. Data Retention</h2>
            <p>
              We retain your account and usage data for as long as your account remains active, and for a reasonable
              period afterward to comply with legal obligations, resolve disputes, and enforce our agreements. You
              may request deletion of your account and associated data at any time by contacting us.
            </p>

            <h2>7. Data Security</h2>
            <p>
              We take reasonable technical and organizational measures to protect your information, including
              encrypted data transmission (HTTPS), encrypted password storage, and access controls on our
              infrastructure. However, no method of transmission or storage is 100% secure, and we cannot guarantee
              absolute security.
            </p>

            <h2>8. Your Rights</h2>
            <p>
              Depending on your location, you may have rights regarding your personal data, including the right to
              access, correct, export, or delete your information, and to object to or restrict certain processing.
              To exercise any of these rights, contact us using the details below. Nothing in this Policy limits any
              statutory data protection or consumer rights you may have under the laws of your own country or
              region.
            </p>

            <h2>9. Children's Privacy</h2>
            <p>
              The Service is intended for use by licensed real estate professionals and businesses. It is not
              directed at, and we do not knowingly collect information from, individuals under the age of 18.
            </p>

            <h2>10. International Data Transfers</h2>
            <p>
              ListingAI is operated from Pakistan, and the third-party providers listed above may process and store
              data in other countries, including the United States. By using the Service, you consent to the
              transfer and processing of your information in these locations.
            </p>

            <h2>11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Material changes will be reflected by an updated
              "Last updated" date at the top of this page. Continued use of the Service after changes take effect
              constitutes acceptance of the revised policy.
            </p>

            <h2>12. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or wish to exercise any of your rights, contact
              Tauqeer Ahmed at:
            </p>
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