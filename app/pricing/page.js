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
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-gray-500">
            Choose the plan that works for you. Upgrade or cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-2xl p-8 relative flex flex-col ${
                plan.highlighted
                  ? "border-2 border-blue-600 shadow-lg"
                  : "border border-gray-200"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              <h2 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h2>
              <p className="text-sm text-gray-500 mb-5">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-sm text-gray-500 ml-1">/{plan.period}</span>
              </div>

              {plan.planKey === "free" ? (
                <a
                  href="/signup"
                  className="block text-center bg-white text-blue-600 border-2 border-blue-600 rounded-lg py-3 font-semibold text-sm mb-7 hover:bg-blue-50 transition-colors"
                >
                  Get Started Free
                </a>
              ) : (
                <button
                  onClick={() => handleUpgrade(plan.planKey)}
                  disabled={loading === plan.planKey}
                  className={`block w-full text-center rounded-lg py-3 font-semibold text-sm mb-7 transition-colors disabled:opacity-70 disabled:cursor-not-allowed ${
                    plan.highlighted
                      ? "bg-blue-600 text-white hover:bg-blue-700 border-2 border-blue-600"
                      : "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50"
                  }`}
                >
                  {loading === plan.planKey ? "Redirecting..." : plan.buttonText}
                </button>
              )}

              <div className="flex-1">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2.5 mb-2.5">
                    <span className="text-green-500 font-bold text-base">+</span>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
                {plan.notIncluded.map((feature) => (
                  <div key={feature} className="flex items-center gap-2.5 mb-2.5">
                    <span className="text-gray-300 font-bold text-base">-</span>
                    <span className="text-sm text-gray-400">{feature}</span>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

        <p className="text-center text-gray-400 text-sm mt-10">
          Works for real estate agents worldwide. Payments in USD. Cancel anytime.
        </p>

      </div>
    </div>
  );
}