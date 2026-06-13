import Link from "next/link";

// ─── Unsplash photo IDs (free commercial use, no attribution required) ───────
// Hero bg:    Roberto Nickson – luxury living room   photo-1600210492493-0946911123ea
// Mid-section: LYCS Architecture – modern interior   photo-1600607687939-ce8a6c25118c
// CTA section: Nathan Fertig – twilight exterior     photo-1512917774080-9991f1c4c750
// ─────────────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const HERO_IMG    = "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1600&q=80&fit=crop";
  const SECTION_IMG = "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80&fit=crop";
  const CTA_IMG     = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80&fit=crop";

  return (
    <main style={{ fontFamily: "'DM Sans', sans-serif", background: "#0B1628", color: "#E8DFC8", overflowX: "hidden" }}>

      {/* ── HERO with full-bleed property photo ── */}
      <section style={{
        position: "relative",
        minHeight: "680px",
        display: "flex",
        alignItems: "center",
        padding: "6rem 2rem 5rem",
        overflow: "hidden",
      }}>
        {/* Background photo */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url('${HERO_IMG}')`,
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
          backgroundRepeat: "no-repeat",
        }} />
        {/* Dark gradient overlay — left heavy so text reads clearly */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(105deg, rgba(7,14,28,0.93) 0%, rgba(7,14,28,0.78) 45%, rgba(7,14,28,0.30) 100%)",
        }} />
        {/* Gold shimmer accent */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 50% 60% at 15% 80%, rgba(196,163,92,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", maxWidth: "960px", margin: "0 auto", width: "100%" }}>
          {/* Badge */}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "7px",
            background: "rgba(196,163,92,0.15)", border: "1px solid rgba(196,163,92,0.40)",
            color: "#C4A35C", fontSize: "11px", fontWeight: 700,
            letterSpacing: "0.09em", textTransform: "uppercase",
            padding: "6px 16px", borderRadius: "100px", marginBottom: "1.5rem",
          }}>
            ✦ AI for Real Estate Professionals
          </span>

          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
            fontWeight: 700, lineHeight: 1.15,
            color: "#FFFFFF",
            maxWidth: "680px",
            marginBottom: "1.5rem",
            textShadow: "0 2px 20px rgba(0,0,0,0.5)",
          }}>
            Write Perfect Listings<br />
            in <em style={{ fontStyle: "italic", color: "#C4A35C" }}>Seconds</em>, Not Hours.
          </h1>

          <p style={{
            fontSize: "1.05rem", color: "rgba(255,255,255,0.72)",
            maxWidth: "520px", marginBottom: "2.25rem", lineHeight: 1.8,
            textShadow: "0 1px 8px rgba(0,0,0,0.6)",
          }}>
            ListingAI generates professional MLS descriptions, social media captions,
            buyer emails, and contract summaries — instantly. Works for any property, worldwide.
          </p>

          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center", marginBottom: "1.75rem" }}>
            <Link href="/generate" style={{
              background: "#C4A35C", color: "#0B1628",
              fontSize: "15px", fontWeight: 700,
              padding: "14px 30px", borderRadius: "50px",
              textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px",
              boxShadow: "0 4px 24px rgba(196,163,92,0.35)",
            }}>
              Try Free — 5 Generations →
            </Link>
            <Link href="/pricing" style={{
              background: "rgba(255,255,255,0.10)", color: "#FFFFFF",
              fontSize: "15px", fontWeight: 500,
              padding: "14px 28px", border: "1px solid rgba(255,255,255,0.30)",
              borderRadius: "50px", textDecoration: "none",
              backdropFilter: "blur(8px)",
            }}>
              See Pricing
            </Link>
          </div>

          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.40)", letterSpacing: "0.03em" }}>
            No credit card required &nbsp;·&nbsp; Works for any country &nbsp;·&nbsp; Cancel anytime
          </p>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div style={{
        background: "rgba(196,163,92,0.08)",
        borderTop: "1px solid rgba(196,163,92,0.20)",
        borderBottom: "1px solid rgba(196,163,92,0.20)",
        padding: "2rem 2rem",
      }}>
        <div style={{
          maxWidth: "960px", margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", textAlign: "center",
        }}>
          {[
            { num: "8,000+", label: "Listings Generated" },
            { num: "1,200+", label: "Agents Worldwide" },
            { num: "30 min", label: "Saved Per Listing" },
            { num: "40+",    label: "Countries Served" },
          ].map(s => (
            <div key={s.label}>
              <span style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "1.9rem", fontWeight: 700, color: "#C4A35C", display: "block",
              }}>{s.num}</span>
              <span style={{ fontSize: "11px", color: "#5A6E85", marginTop: "3px", textTransform: "uppercase", letterSpacing: "0.07em", display: "block" }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section id="features" style={{ position: "relative", padding: "6rem 2rem", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url('${SECTION_IMG}')`,
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.07,
        }} />
        <div style={{ position: "absolute", inset: 0, background: "#0B1628", opacity: 0.80 }} />

        <div style={{ position: "relative", maxWidth: "960px", margin: "0 auto" }}>
          <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#C4A35C", fontWeight: 700, marginBottom: "0.75rem" }}>✦ Core Features</div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "2.1rem", color: "#F5EDD8", marginBottom: "0.75rem" }}>Everything a Realtor Needs</h2>
          <p style={{ fontSize: "15px", color: "#7A90A8", maxWidth: "500px", marginBottom: "2.75rem", lineHeight: 1.75 }}>
            Nine AI tools built for real estate professionals — saving hours every single week.
          </p>

          {/* ── 9 tools grid (existing 4 + new 5) ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "1.25rem" }}>
            {[
              // existing
              { icon: "🏠", title: "Property Listing Writer",  desc: "Enter property details and get a professional MLS-ready description instantly. Any property type, any country.",      tag: "Save 30 min per listing" },
              { icon: "📱", title: "Social Media Captions",    desc: "Scroll-stopping Instagram and Facebook posts for your listings. Drive more leads from social media effortlessly.",     tag: "More reach, less effort" },
              { icon: "📧", title: "Buyer Email Templates",    desc: "Polished, persuasive follow-up emails to potential buyers — built to close deals faster.",                             tag: "Higher reply rates" },
              { icon: "📄", title: "Contract Summarizer",      desc: "Paste any contract and get a plain-English summary in seconds. No legal headache.",                                    tag: "Clarity in seconds" },
              // new
              { icon: "🎪", title: "Open House Announcement",  desc: "Generate ready-to-send open house copy for WhatsApp, SMS, and social media — with date, time, and contact info.",     tag: "Fill every open house" },
              { icon: "📍", title: "Neighborhood Description", desc: "Write compelling area descriptions highlighting schools, amenities, and lifestyle for any city or country worldwide.", tag: "Sell the location" },
              { icon: "💰", title: "Price Reduction Alert",    desc: "Announce price drops tactfully and persuasively — framing the new price as an unmissable opportunity.",               tag: "Re-ignite buyer interest" },
              { icon: "🎥", title: "Property Video Script",    desc: "Get a polished walkthrough script for Reels, YouTube, or TikTok — hook, room-by-room narration, and CTA included.",  tag: "Go viral on social" },
              { icon: "👤", title: "Realtor Bio Generator",    desc: "Create a polished, professional bio for your website, business card, or social profiles — tailored to your experience and tone.", tag: "Stand out instantly" },
            ].map(f => (
              <div key={f.title} style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(196,163,92,0.15)",
                borderRadius: "14px", padding: "1.75rem",
                transition: "border-color 0.2s",
              }}>
                <div style={{
                  width: "44px", height: "44px",
                  background: "rgba(196,163,92,0.12)", borderRadius: "10px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "22px", marginBottom: "1rem",
                }}>{f.icon}</div>
                <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#E8DFC8", marginBottom: "0.5rem" }}>{f.title}</h3>
                <p style={{ fontSize: "13px", color: "#6B80A0", lineHeight: 1.7 }}>{f.desc}</p>
                <span style={{ display: "inline-block", marginTop: "0.75rem", fontSize: "12px", color: "#C4A35C", fontWeight: 500 }}>→ {f.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <div style={{ background: "#0D1D35", padding: "5rem 2rem" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#C4A35C", fontWeight: 700, marginBottom: "0.75rem" }}>✦ How It Works</div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "2.1rem", color: "#F5EDD8", marginBottom: "0.5rem" }}>Three Steps to Perfect Copy</h2>
          <p style={{ fontSize: "15px", color: "#7A90A8" }}>No prompting expertise needed. Fill in the details, let AI do the writing.</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem", marginTop: "3rem" }}>
            {[
              { n: "1", title: "Enter Property Details", desc: "Fill in bedrooms, features, location, and any special notes about the property." },
              { n: "2", title: "Choose Your Tool",        desc: "Select from listing writer, social captions, buyer email, or contract summarizer." },
              { n: "3", title: "Copy & Publish",          desc: "Copy your AI-generated content with one click — ready for MLS, email, or Instagram." },
            ].map(s => (
              <div key={s.n} style={{ textAlign: "center", padding: "1.5rem 1rem" }}>
                <div style={{
                  width: "52px", height: "52px", borderRadius: "50%",
                  border: "1.5px solid rgba(196,163,92,0.45)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 1.25rem",
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "1.3rem", color: "#C4A35C",
                }}>{s.n}</div>
                <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#E8DFC8", marginBottom: "0.5rem" }}>{s.title}</h3>
                <p style={{ fontSize: "13px", color: "#5A6E85", lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: "5rem 2rem", background: "#0B1628" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#C4A35C", fontWeight: 700, marginBottom: "0.75rem" }}>✦ Trusted by Agents Worldwide</div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "2.1rem", color: "#F5EDD8", marginBottom: "2.5rem" }}>What Realtors Are Saying</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.25rem" }}>
            {[
              { text: '"I used to spend 45 minutes writing each listing. Now it\'s under 2 minutes. ListingAI pays for itself on the first property."', name: "Sarah M.", role: "RE/MAX Agent, Dubai" },
              { text: '"The social captions are incredible — my engagement doubled within the first week. I wish I found this tool sooner."',            name: "James T.", role: "Independent Realtor, London" },
              { text: '"The contract summarizer alone has saved our agency hours every week in legal back-and-forth. Worth every penny."',             name: "Priya K.", role: "Agency Director, Singapore" },
            ].map(t => (
              <div key={t.name} style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(196,163,92,0.12)",
                borderRadius: "14px", padding: "1.5rem",
              }}>
                <div style={{ color: "#C4A35C", fontSize: "14px", letterSpacing: "3px", marginBottom: "0.75rem" }}>★★★★★</div>
                <p style={{ fontSize: "13px", color: "#8A9BB5", lineHeight: 1.8, marginBottom: "1.25rem", fontStyle: "italic" }}>{t.text}</p>
                <div style={{ fontSize: "13px", color: "#E8DFC8", fontWeight: 600 }}>{t.name}</div>
                <div style={{ fontSize: "11px", color: "#4A5E78", marginTop: "3px" }}>{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <div id="pricing" style={{ background: "#0D1D35", padding: "5rem 2rem" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#C4A35C", fontWeight: 700, marginBottom: "0.75rem" }}>✦ Pricing</div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "2.1rem", color: "#F5EDD8", marginBottom: "0.5rem" }}>Simple, Transparent Pricing</h2>
          <p style={{ fontSize: "15px", color: "#7A90A8", marginBottom: "0" }}>Start free. Upgrade when you're ready.</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.25rem", marginTop: "2.5rem" }}>
            {[
              { name: "Free",   price: "0",  period: "Forever free",  featured: false, features: ["5 generations / month", "All 8 AI tools", "Works worldwide", "No credit card needed"],        cta: "Get Started Free",  href: "/signup" },
              { name: "Pro",    price: "29", period: "per month",      featured: true,  features: ["100 generations / month", "Everything in Free", "Priority support", "Works for any country"], cta: "Start Pro Plan",    href: "/pricing" },
              { name: "Agency", price: "79", period: "per month",      featured: false, features: ["Unlimited generations", "Everything in Pro", "Team access", "Dedicated support"],             cta: "Start Agency Plan", href: "/pricing" },
            ].map(p => (
              <div key={p.name} style={{
                border: p.featured ? "1.5px solid rgba(196,163,92,0.60)" : "1px solid rgba(196,163,92,0.15)",
                borderRadius: "16px", padding: "1.75rem 1.5rem",
                background: p.featured ? "rgba(196,163,92,0.07)" : "rgba(255,255,255,0.02)",
                position: "relative",
              }}>
                {p.featured && (
                  <div style={{
                    position: "absolute", top: "-13px", left: "50%", transform: "translateX(-50%)",
                    background: "#C4A35C", color: "#0B1628",
                    fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em",
                    padding: "4px 16px", borderRadius: "100px", whiteSpace: "nowrap",
                  }}>Most Popular</div>
                )}
                <div style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#5A6E85", marginBottom: "0.5rem" }}>{p.name}</div>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "2.5rem", color: "#F5EDD8", fontWeight: 700, lineHeight: 1 }}>
                  <sup style={{ fontSize: "1.1rem", verticalAlign: "top", marginTop: "8px" }}>$</sup>{p.price}
                </div>
                <div style={{ fontSize: "12px", color: "#4A5E78", marginBottom: "1.25rem", marginTop: "4px" }}>{p.period}</div>
                <hr style={{ border: "none", borderTop: "1px solid rgba(196,163,92,0.10)", margin: "1.25rem 0" }} />
                {p.features.map(f => (
                  <div key={f} style={{ fontSize: "13px", color: "#7A90A8", padding: "5px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: "#C4A35C", fontWeight: 700 }}>✓</span>{f}
                  </div>
                ))}
                <Link href={p.href} style={{
                  display: "block", textAlign: "center", marginTop: "1.5rem",
                  padding: "12px", borderRadius: "50px",
                  fontSize: "13px", fontWeight: 700, textDecoration: "none",
                  border: p.featured ? "none" : "1px solid rgba(196,163,92,0.40)",
                  background: p.featured ? "#C4A35C" : "transparent",
                  color: p.featured ? "#0B1628" : "#C4A35C",
                }}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM CTA with property photo background ── */}
      <section style={{ position: "relative", padding: "7rem 2rem", textAlign: "center", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url('${CTA_IMG}')`,
          backgroundSize: "cover", backgroundPosition: "center",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(7,14,28,0.88) 0%, rgba(7,14,28,0.80) 100%)",
        }} />

        <div style={{ position: "relative", maxWidth: "640px", margin: "0 auto" }}>
          <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#C4A35C", fontWeight: 700, marginBottom: "0.75rem" }}>✦ Get Started Today</div>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
            color: "#FFFFFF", marginBottom: "1rem", lineHeight: 1.25,
            textShadow: "0 2px 20px rgba(0,0,0,0.5)",
          }}>
            Your Next Listing is{" "}
            <em style={{ fontStyle: "italic", color: "#C4A35C" }}>One Click Away</em>
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.55)", marginBottom: "2.25rem", lineHeight: 1.75 }}>
            Join 1,200+ real estate professionals who save hours every week.
            Start with 5 free generations — no card required.
          </p>
          <Link href="/generate" style={{
            background: "#C4A35C", color: "#0B1628",
            fontSize: "16px", fontWeight: 700,
            padding: "16px 42px", borderRadius: "50px",
            textDecoration: "none", display: "inline-block",
            boxShadow: "0 4px 30px rgba(196,163,92,0.40)",
          }}>
            Start Writing for Free →
          </Link>
        </div>
      </section>

    </main>
  );
}