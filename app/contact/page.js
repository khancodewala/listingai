import Footer from "@/components/Footer";

export const metadata = {
  title: "Contact | ListingAI",
  description: "Get in touch with the ListingAI team for support, billing, or general questions.",
};

export default function ContactPage() {
  return (
    <div style={{ background: "#FAF8F2", minHeight: "100vh" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .contact-title {
          font-family: var(--font-playfair);
          color: #10202E;
          font-size: 34px;
          font-weight: 700;
          margin: 0 0 12px;
          line-height: 1.2;
        }
        .contact-subtitle {
          font-family: var(--font-dm-sans);
          color: #55606A;
          font-size: 16px;
          line-height: 1.7;
          margin: 0 0 40px;
        }
        .contact-card {
          background: #f7f6f3;
          border: 1px solid #ECE8DD;
          border-radius: 12px;
          padding: 28px;
          margin-bottom: 20px;
        }
        .contact-card-label {
          font-family: var(--font-dm-sans);
          color: #185F85;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .contact-card-value {
          font-family: var(--font-dm-sans);
          color: #10202E;
          font-size: 17px;
          font-weight: 600;
        }
        .contact-card-value a {
          color: #185F85;
          text-decoration: none;
        }
        .contact-card-value a:hover {
          text-decoration: underline;
        }
        .contact-note {
          font-family: var(--font-dm-sans);
          color: #55606A;
          font-size: 14px;
          line-height: 1.7;
        }
      ` }} />

    <main style={{ maxWidth: "680px", margin: "0 auto", padding: "24px 24px 40px" }}>
        <div style={{
          background: "#ffffff",
          border: "1px solid #ECE8DD",
          borderRadius: "16px",
          padding: "36px",
          boxShadow: "0 4px 24px rgba(16,32,46,0.05)",
        }}>
          <h1 className="contact-title">Contact Us</h1>
          <p className="contact-subtitle">
            Have a question about your account, billing, or how ListingAI works? Reach out and we&apos;ll get back to you as soon as possible &mdash; usually within 1&ndash;2 business days.
          </p>

          <div className="contact-card">
            <div className="contact-card-label">General &amp; Billing Support</div>
            <div className="contact-card-value">
              <a href="mailto:ahmedtauqeer761@gmail.com">ahmedtauqeer761@gmail.com</a>
            </div>
          </div>

          <p className="contact-note">
            For billing or subscription issues, it helps to include the email address associated with your ListingAI account so we can look into it faster.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}