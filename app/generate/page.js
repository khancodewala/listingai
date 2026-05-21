"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const TABS = [
  { id: "listing", label: "🏠 Listing Writer" },
  { id: "social",  label: "📱 Social Media" },
  { id: "email",   label: "📧 Buyer Email" },
  { id: "contract",label: "📄 Contract Summary" },
];

function Field({ label, value, onChange, placeholder, textarea }) {
  const cls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  return (
    <div className="col-span-1">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {textarea
        ? <textarea className={cls + " min-h-[80px] resize-y"} value={value} onChange={onChange} placeholder={placeholder} />
        : <input className={cls} value={value} onChange={onChange} placeholder={placeholder} />}
    </div>
  );
}

function GenerateBtn({ onClick, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Generating...
        </>
      ) : (
        "✨ Generate with AI"
      )}
    </button>
  );
}

function ListingForm({ onGenerate, loading }) {
  const [form, setForm] = useState({
    propertyType: "", location: "", bedrooms: "", bathrooms: "",
    size: "", price: "", features: "", notes: "",
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Property Type" value={form.propertyType} onChange={set("propertyType")} placeholder="e.g. 3-bed villa, studio apartment" />
        <Field label="Location" value={form.location} onChange={set("location")} placeholder="e.g. Manhattan NY, Dubai Marina, DHA Lahore" />
        <Field label="Bedrooms" value={form.bedrooms} onChange={set("bedrooms")} placeholder="e.g. 4" />
        <Field label="Bathrooms" value={form.bathrooms} onChange={set("bathrooms")} placeholder="e.g. 3" />
        <Field label="Size" value={form.size} onChange={set("size")} placeholder="e.g. 2400 sq ft or 220 sqm" />
        <Field label="Price" value={form.price} onChange={set("price")} placeholder="e.g. $250,000 or PKR 2.5 Crore or AED 900,000" />
      </div>
      <Field label="Key Features" value={form.features} onChange={set("features")} placeholder="e.g. Pool, Gym, Parking, Garden, Sea View" textarea />
      <Field label="Additional Notes (optional)" value={form.notes} onChange={set("notes")} placeholder="Anything else to highlight..." textarea />
      <GenerateBtn onClick={() => onGenerate({ feature: "listing", ...form })} loading={loading} />
    </div>
  );
}

function SocialForm({ onGenerate, loading }) {
  const [form, setForm] = useState({
    propertyType: "", location: "", price: "", highlights: "", targetBuyer: "",
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Property Type" value={form.propertyType} onChange={set("propertyType")} placeholder="e.g. Luxury penthouse, family home" />
        <Field label="Location" value={form.location} onChange={set("location")} placeholder="e.g. Beverly Hills CA, Palm Jumeirah, Gulberg Lahore" />
        <Field label="Price" value={form.price} onChange={set("price")} placeholder="e.g. $500,000 or AED 1.2M or PKR 3 Crore" />
        <Field label="Target Buyer" value={form.targetBuyer} onChange={set("targetBuyer")} placeholder="e.g. Young professionals, families, investors" />
      </div>
      <Field label="Key Highlights" value={form.highlights} onChange={set("highlights")} placeholder="e.g. Stunning city views, modern kitchen, pool, gym" textarea />
      <GenerateBtn onClick={() => onGenerate({ feature: "social", ...form })} loading={loading} />
    </div>
  );
}

function EmailForm({ onGenerate, loading }) {
  const [form, setForm] = useState({
    agentName: "", buyerName: "", propertyAddress: "",
    showingDate: "", buyerInterests: "", nextStep: "",
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Your Name (Agent)" value={form.agentName} onChange={set("agentName")} placeholder="e.g. John Smith, Ahmed Khan" />
        <Field label="Buyer's Name" value={form.buyerName} onChange={set("buyerName")} placeholder="e.g. Mr. Robert, Ms. Sarah" />
        <Field label="Property Address" value={form.propertyAddress} onChange={set("propertyAddress")} placeholder="e.g. 123 Main St NY, Flat 5 Dubai Marina" />
        <Field label="Showing Date" value={form.showingDate} onChange={set("showingDate")} placeholder="e.g. Yesterday, May 5 2026" />
      </div>
      <Field label="Buyer's Interests / Requirements" value={form.buyerInterests} onChange={set("buyerInterests")} placeholder="e.g. Needs 4 beds, good schools nearby, budget $300,000" textarea />
      <Field label="Suggested Next Step" value={form.nextStep} onChange={set("nextStep")} placeholder="e.g. Schedule a second visit this weekend" textarea />
      <GenerateBtn onClick={() => onGenerate({ feature: "email", ...form })} loading={loading} />
    </div>
  );
}

function ContractForm({ onGenerate, loading }) {
  const [contractText, setContractText] = useState("");
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Paste Contract Text
        </label>
        <textarea
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px] resize-y"
          placeholder="Paste any real estate contract text here. Claude AI will summarize it in plain English for any country..."
          value={contractText}
          onChange={(e) => setContractText(e.target.value)}
        />
      </div>
      <GenerateBtn onClick={() => onGenerate({ feature: "contract", contractText })} loading={loading} />
    </div>
  );
}

function ResultPanel({ result, onCopy, copied, onClose }) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.3)",
          zIndex: 150,
        }}
      />

      {/* Slide-over panel */}
      <div style={{
        position: "fixed", top: 0, right: 0,
        height: "100vh", width: "100%", maxWidth: "540px",
        background: "#fff", zIndex: 200,
        boxShadow: "-4px 0 24px rgba(0,0,0,0.12)",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
        animation: "slideIn 0.25s ease-out",
      }}>
        <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>

        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "16px 20px", borderBottom: "1px solid #e5e7eb",
          background: "#fff", flexShrink: 0,
        }}>
          <h3 style={{ fontWeight: "600", fontSize: "16px", color: "#111827", margin: 0 }}>
            ✅ Generated Result
          </h3>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button
              onClick={onCopy}
              style={{
                fontSize: "13px",
                background: copied ? "#f0fdf4" : "#f9fafb",
                border: `1px solid ${copied ? "#86efac" : "#d1d5db"}`,
                color: copied ? "#16a34a" : "#374151",
                padding: "6px 14px", borderRadius: "8px", cursor: "pointer",
                fontWeight: "500",
              }}
            >
              {copied ? "✔ Copied!" : "Copy"}
            </button>
            <button
              onClick={onClose}
              style={{
                fontSize: "20px", background: "none", border: "none",
                cursor: "pointer", color: "#6b7280", lineHeight: 1,
                padding: "4px 8px", borderRadius: "6px",
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          <pre style={{
            whiteSpace: "pre-wrap", fontSize: "14px", color: "#1f2937",
            fontFamily: "inherit", lineHeight: "1.7", margin: 0,
          }}>
            {result}
          </pre>
        </div>
      </div>
    </>
  );
}

export default function GeneratePage() {
  const [activeTab, setActiveTab] = useState("listing");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [session, setSession] = useState(null);
  const [usage, setUsage] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session) {
        const res = await fetch("/api/usage", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        const data = await res.json();
        if (data.used !== undefined) {
          setUsage({ used: data.used, limit: data.limit, plan: data.plan });
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGenerate = async (payload) => {
    if (!session) {
      setError("Please log in to generate content.");
      return;
    }
    setLoading(true);
    setResult("");
    setError("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.status === 429 && data.error === "limit_reached") {
        setError(`⚠️ ${data.message}`);
        setUsage({ used: data.used, limit: data.limit, plan: data.plan });
        return;
      }

      if (!res.ok || !data.success) {
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        setResult(data.result);
        const usageRes = await fetch("/api/usage", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        const usageData = await usageRes.json();
        if (usageData.used !== undefined) {
          setUsage({ used: usageData.used, limit: usageData.limit, plan: usageData.plan });
        }
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const forms = {
    listing:  <ListingForm  onGenerate={handleGenerate} loading={loading} />,
    social:   <SocialForm   onGenerate={handleGenerate} loading={loading} />,
    email:    <EmailForm    onGenerate={handleGenerate} loading={loading} />,
    contract: <ContractForm onGenerate={handleGenerate} loading={loading} />,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">AI Generator</h1>
          <p className="text-gray-500 mt-2">Powered by Claude · Works for any country worldwide 🌍</p>
        </div>

        {session && usage && (
          <div className="mb-4 bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Generations used this month: <strong>{usage.used} / {usage.limit ?? "∞"}</strong>
            </span>
            {usage.limit && usage.used >= usage.limit && (
              <a href="/pricing" className="text-blue-600 font-semibold hover:underline">
                Upgrade Plan →
              </a>
            )}
          </div>
        )}

        {!session && (
          <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-xl px-4 py-3">
            ⚠️ Please <a href="/login" className="font-semibold underline">log in</a> to use the AI generator.
          </div>
        )}

        <div className="flex gap-2 mb-6 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setResult(""); setError(""); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {forms[activeTab]}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}
        </div>

      </div>

      {/* Slide-over result panel — outside card, overlays full screen */}
      {result && (
        <ResultPanel
          result={result}
          onCopy={handleCopy}
          copied={copied}
          onClose={() => setResult("")}
        />
      )}
    </div>
  );
}