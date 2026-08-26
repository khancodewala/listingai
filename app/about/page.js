import Footer from "@/components/Footer";

export const metadata = {
  title: "About | ListingAI",
  description: "Learn about ListingAI and why we built an AI-powered content generation platform for real estate professionals.",
};

export default function AboutPage() {
  return (
    <div style={{ background: "#FAF8F2", minHeight: "100vh" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .about-title {
          font-family: var(--font-playfair);
          color: #10202E;
          font-size: 34px;
          font-weight: 700;
          margin: 0 0 6px;
          line-height: 1.2;
        }
        .about-subtitle {
          color: #55606A;
          font-size: 14px;
          font-style: italic;
          margin-bottom: 28px;
        }
        .about-content h2 {
          font-family: var(--font-playfair);
          color: #185F85;
          font-size: 22px;
          font-weight: 700;
          margin: 32px 0 12px;
        }
        .about-content h2:first-of-type { margin-top: 0; }
        .about-content p {
          font-family: var(--font-dm-sans);
          color: #33393F;
          font-size: 15.5px;
          line-height: 1.75;
          margin: 0 0 14px;
        }
        .about-content ul {
          margin: 0 0 16px;
          padding-left: 22px;
        }
        .about-content li {
          font-family: var(--font-dm-sans);
          color: #33393F;
          font-size: 15.5px;
          line-height: 1.75;
          margin-bottom: 8px;
        }
      ` }} />

      <main style={{ maxWidth: "820px", margin: "0 auto", padding: "24px 24px 40px" }}>
        <div style={{
          background: "#ffffff",
          border: "1px solid #ECE8DD",
          borderRadius: "16px",
          padding: "36px",
          boxShadow: "0 4px 24px rgba(16,32,46,0.05)",
        }}>
          <div className="about-content">
            <h1 className="about-title">About ListingAI</h1>
            <p className="about-subtitle">Built for real estate agents, by a solo developer who wanted content creation to be effortless.</p>

            <h2>Why We Built ListingAI</h2>
            <p>
              Writing listing descriptions, social captions, buyer emails, and all the other copy that goes into
              selling a property takes real time &mdash; time real estate agents would rather spend with clients or
              closing deals. ListingAI was built to take that burden off your plate: describe the property or
              situation, and get professional, ready-to-use content in seconds.
            </p>

            <h2>What We Offer</h2>
            <p>
              ListingAI provides ten purpose-built AI tools covering the full range of a real estate agent&apos;s
              content needs &mdash; listing descriptions, social media captions, buyer emails, contract summaries,
              open house announcements, neighborhood descriptions, price reduction alerts, video scripts, realtor
              bios, and blog content. Everything is generated with a flat, predictable pricing structure and a
              complete history of everything you&apos;ve created.
            </p>

            <h2>Who&apos;s Behind It</h2>
            <p>
              ListingAI is built and maintained by Tauqeer Ahmed. The product is under active development, with new
              features and improvements shipped regularly based on direct feedback from the agents who use it.
            </p>

            <h2>Get in Touch</h2>
            <p>
              Have a question, feature request, or just want to say hello? Visit our <a href="/contact" style={{ color: "#185F85" }}>Contact page</a> &mdash; we&apos;d love to hear from you.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}