"use client";

import { useState } from "react";

const TABS = [
  { id: "listing", label: "🏠 Listing Writer" },
  { id: "social",  label: "📱 Social Media" },
  { id: "email",   label: "📧 Buyer Email" },
  { id: "contract",label: "📄 Contract Summary" },
];

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
        <Field label="Location" value={form.location} onChange={set("location")} placeholder="e.g. DHA Phase 5, Lahore" />
        <Field label="Bedrooms" value={form.bedrooms} onChange={set("bedrooms")} placeholder="e.g. 4" />
        <Field label="Bathrooms" value={form.bathrooms} onChange={set("bathrooms")} placeholder="e.g. 3" />
        <Field label="Size (sq ft)" value={form.size} onChange={set("size")} placeholder="e.g. 2400" />
        <Field label="Price" value={form.price} onChange={set("price")} placeholder="e.g. PKR 2.5 Crore" />
      </div>
      <Field label="Key Features" value={form.features} onChange={set("features")} placeholder="e.g. Marble flooring, rooftop garden, generator backup" textarea />
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
        <Field label="Property Type" value={form.propertyType} onChange={set("propertyType")} placeholder="e.g. Luxury penthouse" />
        <Field label="Location" value={form.location} onChange={set("location")} placeholder="e.g. Gulberg III, Lahore" />
        <Field label="Price" value={form.price} onChange={set("price")} placeholder="e.g. PKR 3.8 Crore" />
        <Field label="Target Buyer" value={form.targetBuyer} onChange={set("targetBuyer")} placeholder="e.g. Young professionals, families" />
      </div>
      <Field label="Key Highlights" value={form.highlights} onChange={set("highlights")} placeholder="e.g. Stunning city views, modern kitchen, gym, pool" textarea />
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
        <Field label="Your Name (Agent)" value={form.agentName} onChange={set("agentName")} placeholder="e.g. Tauqeer Ahmed" />
        <Field label="Buyer's Name" value={form.buyerName} onChange={set("buyerName")} placeholder="e.g. Mr. Ali Khan" />
        <Field label="Property Address" value={form.propertyAddress} onChange={set("propertyAddress")} placeholder="e.g. House 12, Street 5, F-7/2, Islamabad" />
        <Field label="Showing Date" value={form.showingDate} onChange={set("showingDate")} placeholder="e.g. Yesterday, 4 May 2026" />
      </div>
      <Field label="Buyer's Interests / Requirements" value={form.buyerInterests} onChange={set("buyerInterests")} placeholder="e.g. Needs 4 beds, school nearby, budget PKR 2 Crore" textarea />
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
          placeholder="Paste the full contract text here. Claude will summarize it in plain English..."
          value={contractText}
          onChange={(e) => setContractText(e.target.value)}
        />
      </div>
      <GenerateBtn onClick={() => onGenerate({ feature: "contract", contractText })} loading={loading} />
    </div>
  );
}

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

function ResultBox({ result, onCopy, copied }) {
  return (
    <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-5">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800">✅ Generated Result</h3>
        <button
          onClick={onCopy}
          className="text-sm bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg transition-colors"
        >
          {copied ? "✓ Copied!" : "Copy"}
        </button>
      </div>
      <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
        {result}
      </pre>
    </div>
  );
}

export default function GeneratePage() {
  const [activeTab, setActiveTab] = useState("listing");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (payload) => {
    setLoading(true);
    setResult("");
    setError("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        setResult(data.result);
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
    listing: <ListingForm onGenerate={handleGenerate} loading={loading} />,
    social:  <SocialForm  onGenerate={handleGenerate} loading={loading} />,
    email:   <EmailForm   onGenerate={handleGenerate} loading={loading} />,
    contract:<ContractForm onGenerate={handleGenerate} loading={loading} />,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">AI Generator</h1>
          <p className="text-gray-500 mt-2">Powered by Claude · Choose a tool below</p>
        </div>

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
              ⚠️ {error}
            </div>
          )}

          {result && <ResultBox result={result} onCopy={handleCopy} copied={copied} />}
        </div>
      </div>
    </div>
  );
}