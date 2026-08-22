import Link from "next/link";

// ─── Unsplash photo IDs (free commercial use, no attribution required) ───────
// Hero bg:    Roberto Nickson – luxury living room   photo-1600210492493-0946911123ea
// Mid-section: LYCS Architecture – modern interior   photo-1600607687939-ce8a6c25118c
// CTA section: Nathan Fertig – twilight exterior     photo-1512917774080-9991f1c4c750
// ─────────────────────────────────────────────────────────────────────────────

export default function HomePage() {
  // Unsplash's own on-the-fly resizing + format negotiation: auto=format serves
  // WebP/AVIF automatically based on the browser's Accept header — no next/image
  // needed for plain CSS backgrounds like these.
  const unsplash = (id, w, q = 70) =>
    `https://images.unsplash.com/${id}?w=${w}&q=${q}&auto=format&fit=crop`;

  const HERO_ID    = "photo-1600210492493-0946911123ea";
  const SECTION_ID = "photo-1600607687939-ce8a6c25118c";
  const CTA_ID     = "photo-1512917774080-9991f1c4c750";

  // Hero & CTA are full-bleed backgrounds — serve a smaller crop on mobile via
  // the CSS media query below instead of always loading the 1600px desktop version
  const HERO_IMG_MOBILE  = unsplash(HERO_ID, 800, 65);
  const HERO_IMG_DESKTOP = unsplash(HERO_ID, 1600, 75);
  const CTA_IMG_MOBILE   = unsplash(CTA_ID, 800, 60);
  const CTA_IMG_DESKTOP  = unsplash(CTA_ID, 1600, 70);

  // This one sits at 4% opacity purely for background texture — a small,
  // heavily compressed version looks identical but costs a fraction of the size
  const SECTION_IMG = unsplash(SECTION_ID, 900, 35);

  return (
    <main style={{ fontFamily: "var(--font-dm-sans)", background: "#FAF8F2", color: "#3A4048", overflowX: "hidden", maxWidth: "100vw" }}>

      {/* ── Responsive grid styles ── */}
      <style>{`
        html, body { overflow-x: hidden; max-width: 100vw; box-sizing: border-box; }
        *, *::before, *::after { box-sizing: border-box; }

        .lai-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          text-align: center;
        }
        .lai-features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
        }
        .lai-steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-top: 3rem;
        }
        .lai-social-proof-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }
        .lai-pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          margin-top: 2.5rem;
        }
        .lai-hero-buttons {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          align-items: center;
          margin-bottom: 1.75rem;
        }
        .lai-hero-btn-primary {
          background: #185F85;
          color: #FFFFFF;
          font-size: 15px;
          font-weight: 700;
          padding: 14px 30px;
          border-radius: 50px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 24px rgba(24,95,133,0.35);
          white-space: nowrap;
        }
        .lai-hero-btn-secondary {
          background: rgba(255,255,255,0.14);
          color: #FFFFFF;
          font-size: 15px;
          font-weight: 500;
          padding: 14px 28px;
          border: 1px solid rgba(255,255,255,0.45);
          border-radius: 50px;
          text-decoration: none;
          backdrop-filter: blur(8px);
          white-space: nowrap;
        }
        .lai-hero-section {
          position: relative;
          min-height: 680px;
          display: flex;
          align-items: center;
          padding: 6rem 1.25rem 5rem;
          overflow: hidden;
        }
        .lai-section-lg {
          padding: 6rem 1.25rem;
        }
        .lai-section-md {
          padding: 5rem 1.25rem;
        }
        .lai-cta-section {
          position: relative;
          padding: 7rem 1.25rem;
          text-align: center;
          overflow: hidden;
        }
        .lai-cta-btn {
          background: #185F85;
          color: #FFFFFF;
          font-size: 16px;
          font-weight: 700;
          padding: 16px 42px;
          border-radius: 50px;
          text-decoration: none;
          display: inline-block;
          box-shadow: 0 4px 30px rgba(24,95,133,0.40);
        }
        .lai-pricing-badge {
          position: absolute;
          top: -13px;
          left: 50%;
          transform: translateX(-50%);
          background: #5E9B7C;
          color: #FFFFFF;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 4px 16px;
          border-radius: 100px;
          white-space: nowrap;
        }
        .lai-feature-card {
          display: block;
          text-decoration: none;
          background: #FFFFFF;
          border: 1px solid rgba(58,64,72,0.10);
          border-radius: 14px;
          padding: 1.75rem;
          transition: box-shadow 0.2s ease, transform 0.2s ease;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(58,64,72,0.05);
        }
        .lai-feature-card:hover {
          box-shadow: 0 10px 28px rgba(58,64,72,0.12);
          transform: translateY(-3px);
        }

        .lai-hero-bg {
          position: absolute;
          inset: 0;
          background-image: url('${HERO_IMG_MOBILE}');
          background-size: cover;
          background-position: center 40%;
          background-repeat: no-repeat;
        }
        .lai-cta-bg {
          position: absolute;
          inset: 0;
          background-image: url('${CTA_IMG_MOBILE}');
          background-size: cover;
          background-position: center;
        }
        @media (min-width: 641px) {
          .lai-hero-bg { background-image: url('${HERO_IMG_DESKTOP}'); }
          .lai-cta-bg { background-image: url('${CTA_IMG_DESKTOP}'); }
        }

        @media (max-width: 640px) {
          .lai-stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
          }
          .lai-features-grid {
            grid-template-columns: 1fr;
          }
          .lai-steps-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .lai-social-proof-grid {
            grid-template-columns: 1fr;
          }
          .lai-pricing-grid {
            grid-template-columns: 1fr;
          }
          .lai-hero-buttons {
            flex-direction: column;
            align-items: stretch;
          }
          .lai-hero-btn-primary,
          .lai-hero-btn-secondary {
            text-align: center;
            justify-content: center;
            width: 100%;
          }
          .lai-hero-section {
            min-height: auto;
            padding: 4rem 1.25rem 3rem;
          }
          .lai-section-lg {
            padding: 3.5rem 1.25rem;
          }
          .lai-section-md {
            padding: 3rem 1.25rem;
          }
          .lai-cta-section {
            padding: 4rem 1.25rem;
          }
          .lai-cta-btn {
            display: block;
            width: 100%;
            text-align: center;
            padding: 16px 24px;
          }
          .lai-pricing-badge {
            font-size: 9px;
            padding: 4px 12px;
          }
        }

        @media (min-width: 641px) and (max-width: 900px) {
          .lai-steps-grid {
            grid-template-columns: 1fr;
          }
          .lai-social-proof-grid {
            grid-template-columns: 1fr;
          }
          .lai-pricing-grid {
            grid-template-columns: 1fr;
          }
          .lai-hero-section {
            padding: 5rem 1.25rem 4rem;
          }
          .lai-section-lg {
            padding: 4.5rem 1.25rem;
          }
          .lai-section-md {
            padding: 4rem 1.25rem;
          }
        }
      `}</style>

      {/* ── HERO with full-bleed property photo (dark overlay kept for legibility) ── */}
      <section className="lai-hero-section">
        <div className="lai-hero-bg" />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(105deg, rgba(18,34,48,0.88) 0%, rgba(18,34,48,0.70) 45%, rgba(18,34,48,0.25) 100%)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 50% 60% at 15% 80%, rgba(94,155,124,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", maxWidth: "960px", margin: "0 auto", width: "100%" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "7px",
            background: "rgba(94,155,124,0.20)", border: "1px solid rgba(94,155,124,0.55)",
            color: "#8FC7A8", fontSize: "11px", fontWeight: 700,
            letterSpacing: "0.09em", textTransform: "uppercase",
            padding: "6px 16px", borderRadius: "100px", marginBottom: "1.5rem",
          }}>
            ✦ AI for Real Estate Professionals
          </span>

          <h1 style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(1.9rem, 5vw, 3.4rem)",
            fontWeight: 700, lineHeight: 1.15,
            color: "#FFFFFF",
            maxWidth: "680px",
            marginBottom: "1.5rem",
            textShadow: "0 2px 20px rgba(0,0,0,0.35)",
          }}>
            Write Perfect Listings<br />
            in <em style={{ fontStyle: "italic", color: "#8FC7A8" }}>Seconds</em>, Not Hours.
          </h1>

          <p style={{
            fontSize: "1.05rem", color: "rgba(255,255,255,0.82)",
            maxWidth: "520px", marginBottom: "2.25rem", lineHeight: 1.8,
            textShadow: "0 1px 8px rgba(0,0,0,0.45)",
          }}>
            ListingAI generates professional MLS descriptions, social media captions,
            buyer emails, and contract summaries — instantly. Works for any property, worldwide.
          </p>

          <div className="lai-hero-buttons">
            <Link href="/generate" className="lai-hero-btn-primary">
              Try Free — 5 Generations →
            </Link>
            <Link href="/pricing" className="lai-hero-btn-secondary">
              See Pricing
            </Link>
          </div>

          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", letterSpacing: "0.03em" }}>
            No credit card required &nbsp;·&nbsp; Works for any country &nbsp;·&nbsp; Cancel anytime
          </p>
        </div>
      </section>

      {/* ── STATS BAR — capability facts only ── */}
      <div style={{
        background: "#FFFFFF",
        borderTop: "1px solid rgba(94,155,124,0.20)",
        borderBottom: "1px solid rgba(94,155,124,0.20)",
        padding: "2rem 1.25rem",
      }}>
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <div className="lai-stats-grid">
            {[
              { num: "10",      label: "AI Writing Tools"        },
              { num: "~2 min",  label: "Avg. Generation Time"    },
              { num: "4",       label: "Languages Supported"     },
              { num: "Global",  label: "Works Any Country"       },
            ].map(s => (
              <div key={s.label}>
                <span style={{
                  fontFamily: "var(--font-playfair)",
                  fontSize: "1.9rem", fontWeight: 700, color: "#185F85", display: "block",
                }}>{s.num}</span>
                <span style={{ fontSize: "11px", color: "#7A8790", marginTop: "3px", textTransform: "uppercase", letterSpacing: "0.07em", display: "block" }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section className="lai-section-lg" style={{ position: "relative", overflow: "hidden", background: "#FAF8F2" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url('${SECTION_IMG}')`,
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.04,
        }} />
        <div style={{ position: "absolute", inset: 0, background: "#FAF8F2", opacity: 0.85 }} />

        <div style={{ position: "relative", maxWidth: "960px", margin: "0 auto" }}>
          <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#185F85", fontWeight: 700, marginBottom: "0.75rem" }}>✦ Core Features</div>
          <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "2.1rem", color: "#242B32", marginBottom: "0.75rem" }}>Everything a Realtor Needs</h2>
          <p style={{ fontSize: "15px", color: "#525C66", maxWidth: "500px", marginBottom: "2.75rem", lineHeight: 1.75 }}>
            Ten AI tools built for real estate professionals — saving hours every single week.
          </p>

          <div className="lai-features-grid">
            {[
              { icon: "🏠", title: "Property Listing Writer",    desc: "Enter property details and get a professional MLS-ready description instantly. Any property type, any country.",                                    tag: "Save 30 min per listing"  },
              { icon: "📱", title: "Social Media Captions",      desc: "Scroll-stopping Instagram and Facebook posts for your listings. Drive more leads from social media effortlessly.",                                  tag: "More reach, less effort"  },
              { icon: "📧", title: "Buyer Email Templates",      desc: "Polished, persuasive follow-up emails to potential buyers — built to close deals faster.",                                                          tag: "Higher reply rates"       },
              { icon: "📄", title: "Contract Summarizer",        desc: "Paste any contract and get a plain-English summary in seconds. No legal headache.",                                                                 tag: "Clarity in seconds"       },
              { icon: "🎪", title: "Open House Announcement",    desc: "Generate ready-to-send open house copy for WhatsApp, SMS, and social media — with date, time, and contact info.",                                  tag: "Fill every open house"    },
              { icon: "📍", title: "Neighborhood Description",   desc: "Write compelling area descriptions highlighting schools, amenities, and lifestyle for any city or country worldwide.",                               tag: "Sell the location"        },
              { icon: "💰", title: "Price Reduction Alert",      desc: "Announce price drops tactfully and persuasively — framing the new price as an unmissable opportunity.",                                            tag: "Re-ignite buyer interest" },
              { icon: "🎥", title: "Property Video Script",      desc: "Get a polished walkthrough script for Reels, YouTube, or TikTok — hook, room-by-room narration, and CTA included.",                               tag: "Go viral on social"       },
              { icon: "👤", title: "Realtor Bio Generator",      desc: "Create a polished, professional bio for your website, business card, or social profiles — tailored to your experience and tone.",                  tag: "Stand out instantly"      },
              { icon: "🧲", title: "Lead Magnet / Blog Writer",  desc: "Generate blog posts, buyer's guides, checklists, and FAQ articles that attract leads and position you as the local market expert.",               tag: "Turn readers into clients" },
            ].map((f, i) => {
              const palette = ["#185F85", "#5E9B7C", "#B8834A", "#7A5FA0"];
              const accent = palette[i % palette.length];
              return (
                <Link key={f.title} href="/generate" className="lai-feature-card" style={{ borderTop: `3px solid ${accent}` }}>
                  <div style={{
                    width: "44px", height: "44px",
                    background: `${accent}1F`, borderRadius: "10px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "22px", marginBottom: "1rem",
                  }}>{f.icon}</div>
                  <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#1C232B", marginBottom: "0.5rem" }}>{f.title}</h3>
                  <p style={{ fontSize: "13px", color: "#4E5964", lineHeight: 1.7 }}>{f.desc}</p>
                  <span style={{ display: "inline-block", marginTop: "0.75rem", fontSize: "12px", color: accent, fontWeight: 700 }}>→ {f.tag}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <div style={{ background: "#FFFFFF" }} className="lai-section-md">
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#185F85", fontWeight: 700, marginBottom: "0.75rem" }}>✦ How It Works</div>
          <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "2.1rem", color: "#242B32", marginBottom: "0.5rem" }}>Three Steps to Perfect Copy</h2>
          <p style={{ fontSize: "15px", color: "#525C66" }}>No prompting expertise needed. Fill in the details, let AI do the writing.</p>

          <div className="lai-steps-grid">
            {[
              { n: "1", title: "Enter Property Details", desc: "Fill in bedrooms, features, location, and any special notes about the property.", accent: "#185F85" },
              { n: "2", title: "Choose Your Tool",        desc: "Select from listing writer, social captions, buyer email, contract summarizer, and 6 more.", accent: "#5E9B7C" },
              { n: "3", title: "Copy & Publish",          desc: "Copy your AI-generated content with one click — ready for MLS, email, or Instagram.", accent: "#B8834A" },
            ].map(s => (
              <div key={s.n} style={{ textAlign: "center", padding: "1.5rem 1rem" }}>
                <div style={{
                  width: "56px", height: "56px", borderRadius: "50%",
                  border: `1.5px solid ${s.accent}`,
                  background: `${s.accent}14`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 1.25rem",
                  fontFamily: "var(--font-playfair)",
                  fontSize: "1.3rem", fontWeight: 700, color: s.accent,
                }}>{s.n}</div>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#1C232B", marginBottom: "0.5rem" }}>{s.title}</h3>
                <p style={{ fontSize: "13px", color: "#525C66", lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SOCIAL PROOF — 3 conversion cards ── */}
      <section className="lai-section-md" style={{ background: "#FAF8F2" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#185F85", fontWeight: 700, marginBottom: "0.75rem" }}>✦ Why Agents Choose ListingAI</div>
          <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "2.1rem", color: "#242B32", marginBottom: "2.5rem" }}>Built for Real Estate. Trusted from Day One.</h2>

          <div className="lai-social-proof-grid">

            {/* Card 1 — Founder's Note */}
            <div style={{
              background: "#FFFFFF",
              border: "1px solid rgba(94,155,124,0.20)",
              borderRadius: "14px", padding: "1.75rem",
              display: "flex", flexDirection: "column", justifyContent: "space-between",
              boxShadow: "0 1px 3px rgba(58,64,72,0.04)",
            }}>
              <div>
                <div style={{ fontSize: "22px", marginBottom: "1rem" }}>✍️</div>
                <p style={{ fontSize: "13px", color: "#5C6672", lineHeight: 1.85, fontStyle: "italic", marginBottom: "1.25rem" }}>
                  "I built ListingAI because writing listing descriptions, social captions, buyer emails,
                  and contract summaries was taking agents hours every week. With ListingAI, the same
                  work takes under 2 minutes. I built it, I use it, and I stand behind every tool in it."
                </p>
              </div>
              <div>
                <div style={{ fontSize: "13px", color: "#242B32", fontWeight: 600 }}>Tauqeer Ahmed</div>
                <div style={{ fontSize: "11px", color: "#8A9199", marginTop: "3px" }}>Founder, ListingAI</div>
              </div>
            </div>

            {/* Card 2 — Founding Member Offer */}
            <div style={{
              background: "rgba(94,155,124,0.06)",
              border: "1.5px solid rgba(94,155,124,0.45)",
              borderRadius: "14px", padding: "1.75rem",
              display: "flex", flexDirection: "column", justifyContent: "space-between",
            }}>
              <div>
                <div style={{ fontSize: "22px", marginBottom: "1rem" }}>🔒</div>
                <div style={{
                  display: "inline-block", fontSize: "10px", fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.08em",
                  color: "#FFFFFF", background: "#5E9B7C",
                  padding: "3px 12px", borderRadius: "100px", marginBottom: "0.85rem",
                }}>Founding Member Offer</div>
                <p style={{ fontSize: "13px", color: "#5C6672", lineHeight: 1.85, marginBottom: "1.25rem" }}>
                  We're onboarding our <strong style={{ color: "#185F85" }}>first 50 agents</strong> at a special rate.
                  Sign up now and lock in Pro at <strong style={{ color: "#185F85" }}>$29/month for 12 months</strong> —
                  guaranteed, even if pricing increases.
                </p>
              </div>
              <Link href="/signup" style={{
                display: "block", textAlign: "center",
                padding: "11px", borderRadius: "50px",
                fontSize: "13px", fontWeight: 700, textDecoration: "none",
                background: "#185F85", color: "#FFFFFF",
              }}>
                Claim Your Spot →
              </Link>
            </div>

            {/* Card 3 — Zero Risk */}
            <div style={{
              background: "#FFFFFF",
              border: "1px solid rgba(94,155,124,0.20)",
              borderRadius: "14px", padding: "1.75rem",
              display: "flex", flexDirection: "column", justifyContent: "space-between",
              boxShadow: "0 1px 3px rgba(58,64,72,0.04)",
            }}>
              <div>
                <div style={{ fontSize: "22px", marginBottom: "1rem" }}>✦</div>
                <div style={{
                  display: "inline-block", fontSize: "10px", fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.08em",
                  color: "#185F85", border: "1px solid rgba(24,95,133,0.35)",
                  padding: "3px 12px", borderRadius: "100px", marginBottom: "0.85rem",
                }}>Zero Risk Guarantee</div>
                <p style={{ fontSize: "13px", color: "#5C6672", lineHeight: 1.85, marginBottom: "1.25rem" }}>
                  Start with <strong style={{ color: "#242B32" }}>5 free generations</strong> — no credit card,
                  no commitment. Try all 10 AI tools and see the quality yourself
                  before spending a single dollar.
                </p>
              </div>
              <Link href="/generate" style={{
                display: "block", textAlign: "center",
                padding: "11px", borderRadius: "50px",
                fontSize: "13px", fontWeight: 700, textDecoration: "none",
                border: "1px solid rgba(24,95,133,0.35)",
                color: "#185F85", background: "transparent",
              }}>
                Try Free Now →
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <div id="pricing" style={{ background: "#FFFFFF" }} className="lai-section-md">
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#185F85", fontWeight: 700, marginBottom: "0.75rem" }}>✦ Pricing</div>
          <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "2.1rem", color: "#242B32", marginBottom: "0.5rem" }}>Simple, Transparent Pricing</h2>
          <p style={{ fontSize: "15px", color: "#525C66", marginBottom: "0" }}>Start free. Upgrade when you're ready.</p>

          <div className="lai-pricing-grid">
            {[
              { name: "Free",   price: "0",  period: "Forever free",  featured: false, accent: "#7A8790", features: ["5 generations / month", "All 10 AI tools", "Works worldwide", "No credit card needed"],        cta: "Get Started Free",  href: "/signup" },
              { name: "Pro",    price: "29", period: "per month",      featured: true,  accent: "#185F85", features: ["100 generations / month", "Everything in Free", "Priority support", "Works for any country"], cta: "Start Pro Plan",    href: "/pricing" },
              { name: "Agency", price: "79", period: "per month",      featured: false, accent: "#5E9B7C", features: ["Unlimited generations", "Everything in Pro", "Team access", "Dedicated support"],             cta: "Start Agency Plan", href: "/pricing" },
            ].map(p => (
              <div key={p.name} style={{
                border: p.featured ? `2px solid ${p.accent}` : `1.5px solid ${p.accent}45`,
                borderRadius: "16px", padding: "1.75rem 1.5rem",
                background: p.name === "Free" ? "#FFFFFF" : `${p.accent}0D`,
                position: "relative",
                boxShadow: p.featured ? "0 10px 30px rgba(24,95,133,0.15)" : "0 1px 3px rgba(58,64,72,0.05)",
              }}>
                {p.featured && (
                  <div className="lai-pricing-badge">Most Popular</div>
                )}
                <div style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: p.accent, marginBottom: "0.75rem" }}>{p.name}</div>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: "2.5rem", color: "#1C232B", fontWeight: 700, lineHeight: 1, display: "flex", alignItems: "flex-start", gap: "2px" }}>
                  <sup style={{ fontSize: "1rem", lineHeight: 1, marginTop: "6px" }}>$</sup>{p.price}
                </div>
                <div style={{ fontSize: "12px", color: "#8A9199", marginBottom: "1.25rem", marginTop: "4px" }}>{p.period}</div>
                <hr style={{ border: "none", borderTop: `1px solid ${p.accent}30`, margin: "1.25rem 0" }} />
                {p.features.map(f => (
                  <div key={f} style={{ fontSize: "13px", color: "#3F4952", padding: "5px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: p.accent, fontWeight: 700 }}>✓</span>{f}
                  </div>
                ))}
                <Link href={p.href} style={{
                  display: "block", textAlign: "center", marginTop: "1.5rem",
                  padding: "12px", borderRadius: "50px",
                  fontSize: "13px", fontWeight: 700, textDecoration: "none",
                  border: p.featured ? "none" : `1.5px solid ${p.accent}`,
                  background: p.featured ? p.accent : "transparent",
                  color: p.featured ? "#FFFFFF" : p.accent,
                }}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM CTA with property photo background ── */}
      <section className="lai-cta-section" style={{ overflow: "hidden" }}>
        <div className="lai-cta-bg" />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(18,34,48,0.82) 0%, rgba(18,34,48,0.72) 100%)",
        }} />

        <div style={{ position: "relative", maxWidth: "640px", margin: "0 auto" }}>
          <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#8FC7A8", fontWeight: 700, marginBottom: "0.75rem" }}>✦ Get Started Today</div>
          <h2 style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
            color: "#FFFFFF", marginBottom: "1rem", lineHeight: 1.25,
            textShadow: "0 2px 20px rgba(0,0,0,0.35)",
          }}>
            Your Next Listing is{" "}
            <em style={{ fontStyle: "italic", color: "#8FC7A8" }}>One Click Away</em>
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.70)", marginBottom: "2.25rem", lineHeight: 1.75 }}>
            Join the first agents using ListingAI to save hours every week.
            Start with 5 free generations — no card required.
          </p>
          <Link href="/generate" className="lai-cta-btn">
            Start Writing for Free →
          </Link>
        </div>
      </section>

    </main>
  );
}