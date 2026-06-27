"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function PricingPage() {
  const [loading, setLoading] = useState("");

  const handleUpgrade = async (plan) => {
    setLoading(plan);

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      window.location.href = "/signup";
      return;
    }

    try {
      const res = await fetch("/api/polar/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          userId: session.user.id,
          userEmail: session.user.email,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setLoading("");
    }
  };

  const plans = [
    {
      name: "Free",
      price: "0",
      period: "Forever free",
      description: "Perfect for trying out ListingAI",
      features: [
        "5 AI generations per month",
        "All 10 AI writing tools",
        "Works for any country",
        "Copy to clipboard",
        "No credit card needed",
      ],
      notIncluded: ["Priority support", "Unlimited generations", "Team access"],
      buttonText: "Get Started Free",
      planKey: "free",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "29",
      period: "per month",
      description: "For active real estate agents",
      features: [
        "100 AI generations per month",
        "All 10 AI writing tools",
        "Works for any country",
        "Copy to clipboard",
        "Priority support",
        "Early access to new features",
      ],
      notIncluded: ["Team access"],
      buttonText: "Start Pro Plan",
      planKey: "pro",
      highlighted: true,
    },
    {
      name: "Agency",
      price: "79",
      period: "per month",
      description: "For real estate teams and agencies",
      features: [
        "Unlimited AI generations",
        "All 10 AI writing tools",
        "Works for any country",
        "Copy to clipboard",
        "Priority support",
        "Early access to new features",
        "Team access up to 10 users",
        "Dedicated account manager",
      ],
      notIncluded: [],
      buttonText: "Start Agency Plan",
      planKey: "agency",
      highlighted: false,
    },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0B1628",
      color: "#E8DFC8",
      fontFamily: "'DM Sans', sans-serif",
    }}>

      <style>{`
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-top: 3rem;
        }
        .pricing-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(196,163,92,0.15);
          border-radius: 20px;
          padding: 2rem 1.75rem;
          position: relative;
          display: flex;
          flex-direction: column;
        }
        .pricing-card.highlighted {
          background: rgba(196,163,92,0.06);
          border: 1.5px solid rgba(196,163,92,0.55);
        }
        .pricing-badge {
          position: absolute;
          top: -14px;
          left: 50%;
          transform: translateX(-50%);
          background: #C4A35C;
          color: #0B1628;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 4px 18px;
          border-radius: 100px;
          white-space: nowrap;
        }
        .pricing-btn-primary {
          display: block;
          width: 100%;
          text-align: center;
          background: #C4A35C;
          color: #0B1628;
          font-size: 14px;
          font-weight: 700;
          padding: 13px;
          border-radius: 50px;
          border: none;
          cursor: pointer;
          text-decoration: none;
          margin-bottom: 1.75rem;
          transition: opacity 0.2s ease;
        }
        .pricing-btn-primary:hover { opacity: 0.88; }
        .pricing-btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }
        .pricing-btn-secondary {
          display: block;
          width: 100%;
          text-align: center;
          background: transparent;
          color: #C4A35C;
          font-size: 14px;
          font-weight: 700;
          padding: 13px;
          border-radius: 50px;
          border: 1px solid rgba(196,163,92,0.45);
          cursor: pointer;
          text-decoration: none;
          margin-bottom: 1.75rem;
          transition: background 0.2s ease;
        }
        .pricing-btn-secondary:hover { background: rgba(196,163,92,0.08); }
        .pricing-btn-secondary:disabled { opacity: 0.55; cursor: not-allowed; }
        @media (max-width: 768px) {
          .pricing-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .pricing-card {
            padding: 1.75rem 1.5rem;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .pricing-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
            max-width: 480px;
            margin-left: auto;
            margin-right: auto;
          }
        }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{
        borderBottom: "1px solid rgba(196,163,92,0.12)",
        padding: "2rem 1.5rem",
        maxWidth: "960px",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1rem",
      }}>
        <Link href="/" style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "1.25rem", fontWeight: 700,
          color: "#C4A35C", textDecoration: "none",
        }}>
          ← Back to Home
        </Link>
        <Link href="/generate" style={{
          background: "#C4A35C", color: "#0B1628",
          fontSize: "13px", fontWeight: 700,
          padding: "9px 22px", borderRadius: "50px",
          textDecoration: "none",
        }}>
          Try Free First →
        </Link>
      </div>

      {/* ── HERO ── */}
      <div style={{ textAlign: "center", padding: "4rem 1.5rem 1rem", maxWidth: "680px", margin: "0 auto" }}>
        <div style={{
          display: "inline-block", fontSize: "11px", fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "0.12em",
          color: "#C4A35C", marginBottom: "1rem",
        }}>✦ Pricing</div>
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(2rem, 5vw, 3rem)",
          fontWeight: 700, color: "#F5EDD8",
          marginBottom: "1rem", lineHeight: 1.2,
        }}>
          Simple, Transparent Pricing
        </h1>
        <p style={{ fontSize: "16px", color: "#7A90A8", lineHeight: 1.75 }}>
          Start free with 5 generations. Upgrade when you're ready.
          Cancel anytime — no questions asked.
        </p>
      </div>

      {/* ── PRICING CARDS ── */}
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "0 1.5rem 5rem" }}>
        <div className="pricing-grid">
          {plans.map((plan) => (
            <div key={plan.name} className={`pricing-card ${plan.highlighted ? "highlighted" : ""}`}>

              {plan.highlighted && (
                <div className="pricing-badge">Most Popular</div>
              )}

              {/* Plan name + description */}
              <div style={{
                fontSize: "11px", fontWeight: 700, textTransform: "uppercase",
                letterSpacing: "0.09em", color: "#5A6E85", marginBottom: "0.4rem",
              }}>{plan.name}</div>
              <div style={{ fontSize: "13px", color: "#6B80A0", marginBottom: "1.25rem" }}>
                {plan.description}
              </div>

              {/* Price */}
              <div style={{
                display: "flex", alignItems: "flex-start", gap: "2px",
                marginBottom: "0.35rem",
              }}>
                <span style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "1rem", color: "#C4A35C",
                  marginTop: "8px", lineHeight: 1,
                }}>$</span>
                <span style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "3rem", fontWeight: 700,
                  color: "#F5EDD8", lineHeight: 1,
                }}>{plan.price}</span>
              </div>
              <div style={{ fontSize: "12px", color: "#4A5E78", marginBottom: "1.5rem" }}>
                {plan.period}
              </div>

              <hr style={{ border: "none", borderTop: "1px solid rgba(196,163,92,0.10)", marginBottom: "1.5rem" }} />

              {/* CTA Button */}
              {plan.planKey === "free" ? (
                <Link href="/signup" className="pricing-btn-secondary">
                  {plan.buttonText}
                </Link>
              ) : (
                <button
                  onClick={() => handleUpgrade(plan.planKey)}
                  disabled={loading === plan.planKey}
                  className={plan.highlighted ? "pricing-btn-primary" : "pricing-btn-secondary"}
                >
                  {loading === plan.planKey ? "Redirecting..." : plan.buttonText}
                </button>
              )}

              {/* Features */}
              <div style={{ flex: 1 }}>
                {plan.features.map((feature) => (
                  <div key={feature} style={{
                    display: "flex", alignItems: "center",
                    gap: "10px", marginBottom: "0.65rem",
                  }}>
                    <span style={{ color: "#C4A35C", fontWeight: 700, fontSize: "14px", flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: "13px", color: "#7A90A8" }}>{feature}</span>
                  </div>
                ))}
                {plan.notIncluded.map((feature) => (
                  <div key={feature} style={{
                    display: "flex", alignItems: "center",
                    gap: "10px", marginBottom: "0.65rem",
                  }}>
                    <span style={{ color: "#2A3A50", fontWeight: 700, fontSize: "14px", flexShrink: 0 }}>✕</span>
                    <span style={{ fontSize: "13px", color: "#3A4E65" }}>{feature}</span>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

        {/* ── FOUNDING MEMBER NOTICE ── */}
        <div style={{
          marginTop: "2.5rem",
          background: "rgba(196,163,92,0.06)",
          border: "1px solid rgba(196,163,92,0.25)",
          borderRadius: "14px",
          padding: "1.5rem 2rem",
          textAlign: "center",
        }}>
          <div style={{ fontSize: "13px", color: "#C4A35C", fontWeight: 700, marginBottom: "0.4rem" }}>
            🔒 Founding Member Offer
          </div>
          <div style={{ fontSize: "13px", color: "#7A90A8", lineHeight: 1.75 }}>
            {"First 50 agents who sign up for Pro get the rate locked at "}
            <strong style={{ color: "#E8DFC8" }}>$29/month for 12 months</strong>
            {" — guaranteed, even if pricing increases. "}
            <Link href="/signup" style={{ color: "#C4A35C", textDecoration: "underline" }}>Claim your spot →</Link>
          </div>
        </div>

        {/* ── FOOTER NOTE ── */}
        <p style={{
          textAlign: "center", fontSize: "13px",
          color: "rgba(196,163,92,0.70)", marginTop: "2rem",
          letterSpacing: "0.03em",
        }}>
          Works for real estate agents worldwide · Payments in USD · Cancel anytime
        </p>

      </div>
    </div>
  );
}