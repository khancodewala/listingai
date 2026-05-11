"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

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
      price: "$0",
      period: "forever",
      description: "Perfect for trying out ListingAI",
      features: [
        "5 AI generations per month",
        "Property Listing Writer",
        "Social Media Captions",
        "Buyer Email Templates",
        "Contract Summarizer",
        "Copy to clipboard",
      ],
      notIncluded: ["Priority support", "Unlimited generations", "Team access"],
      buttonText: "Get Started Free",
      planKey: "free",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$29",
      period: "per month",
      description: "For active real estate agents",
      features: [
        "100 AI generations per month",
        "Property Listing Writer",
        "Social Media Captions",
        "Buyer Email Templates",
        "Contract Summarizer",
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
      price: "$79",
      period: "per month",
      description: "For real estate teams and agencies",
      features: [
        "Unlimited AI generations",
        "Property Listing Writer",
        "Social Media Captions",
        "Buyer Email Templates",
        "Contract Summarizer",
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
    <div style={{ minHeight: "100vh", background: "#f9fafb", padding: "60px 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h1 style={{ fontSize: "36px", fontWeight: "700", color: "#111827", margin: "0 0 12px" }}>
            Simple, Transparent Pricing
          </h1>
          <p style={{ fontSize: "18px", color: "#6b7280", margin: "0" }}>
            Choose the plan that works for you. Upgrade or cancel anytime.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
          {plans.map((plan) => (
            <div
              key={plan.name}
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                border: plan.highlighted ? "2px solid #1d4ed8" : "1px solid #e5e7eb",
                padding: "32px 24px",
                position: "relative",
              }}
            >
              {plan.highlighted && (
                <div style={{
                  position: "absolute",
                  top: "-14px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#1d4ed8",
                  color: "#ffffff",
                  fontSize: "12px",
                  fontWeight: "600",
                  padding: "4px 16px",
                  borderRadius: "20px",
                }}>
                  Most Popular
                </div>
              )}

              <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#111827", margin: "0 0 8px" }}>
                {plan.name}
              </h2>
              <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 20px" }}>
                {plan.description}
              </p>

              <div style={{ marginBottom: "24px" }}>
                <span style={{ fontSize: "40px", fontWeight: "700", color: "#111827" }}>
                  {plan.price}
                </span>
                <span style={{ fontSize: "14px", color: "#6b7280", marginLeft: "4px" }}>
                  /{plan.period}
                </span>
              </div>

              {plan.planKey === "free" ? (
            <a    
                  href="/signup"
                  style={{
                    display: "block",
                    textAlign: "center",
                    background: "#ffffff",
                    color: "#1d4ed8",
                    border: "2px solid #1d4ed8",
                    borderRadius: "8px",
                    padding: "12px",
                    fontWeight: "600",
                    fontSize: "15px",
                    textDecoration: "none",
                    marginBottom: "28px",
                  }}
                >
                  Get Started Free
                </a>
              ) : (
                <button
                  onClick={() => handleUpgrade(plan.planKey)}
                  disabled={loading === plan.planKey}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "center",
                    background: plan.highlighted ? "#1d4ed8" : "#ffffff",
                    color: plan.highlighted ? "#ffffff" : "#1d4ed8",
                    border: "2px solid #1d4ed8",
                    borderRadius: "8px",
                    padding: "12px",
                    fontWeight: "600",
                    fontSize: "15px",
                    cursor: loading === plan.planKey ? "not-allowed" : "pointer",
                    opacity: loading === plan.planKey ? 0.7 : 1,
                    marginBottom: "28px",
                  }}
                >
                  {loading === plan.planKey ? "Redirecting..." : plan.buttonText}
                </button>
              )}

              <div>
                {plan.features.map((feature) => (
                  <div key={feature} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                    <span style={{ color: "#16a34a", fontSize: "16px" }}>+</span>
                    <span style={{ fontSize: "14px", color: "#374151" }}>{feature}</span>
                  </div>
                ))}
                {plan.notIncluded.map((feature) => (
                  <div key={feature} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                    <span style={{ color: "#d1d5db", fontSize: "16px" }}>-</span>
                    <span style={{ fontSize: "14px", color: "#9ca3af" }}>{feature}</span>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", color: "#6b7280", fontSize: "14px", marginTop: "40px" }}>
          Works for real estate agents worldwide. Payments in USD. Cancel anytime.
        </p>

      </div>
    </div>
  );
}