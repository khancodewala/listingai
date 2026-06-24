"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const TABS = [
  { id: "listing",      label: "🏠 Listing Writer" },
  { id: "social",       label: "📱 Social Media" },
  { id: "email",        label: "📧 Buyer Email" },
  { id: "contract",     label: "📄 Contract Summary" },
  { id: "openhouse",    label: "🎪 Open House" },
  { id: "neighborhood", label: "📍 Neighborhood" },
  { id: "pricedrop",    label: "💰 Price Reduction" },
  { id: "videoscript",  label: "🎥 Video Script" },
  { id: "bio",          label: "👤 Realtor Bio" },
  { id: "leadmagnet",   label: "🧲 Lead Magnet / Blog" },
];

const LANGUAGES = [
  { code: "en", label: "🇬🇧 English" },
  { code: "es", label: "🇪🇸 Spanish" },
  { code: "ar", label: "🇸🇦 Arabic" },
  { code: "fr", label: "🇫🇷 French" },
];

function getPricePlaceholder(language) {
  if (language === "es") return "e.g. €250,000 or $250,000 or MXN 4,500,000";
  if (language === "fr") return "e.g. €250,000 or CHF 250,000 or CAD 350,000";
  if (language === "ar") return "e.g. AED 900,000 or SAR 950,000 or $250,000";
  return "e.g. $250,000 or PKR 2.5 Crore or AED 900,000";
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

function LanguageSelector({ language, setLanguage }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">Output Language</label>
      <select
        className="w-full sm:w-64 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>{l.label}</option>
        ))}
      </select>
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

function ListingForm({ onGenerate, loading, language }) {
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
        <Field label="Price" value={form.price} onChange={set("price")} placeholder={getPricePlaceholder(language)} />
      </div>
      <Field label="Key Features" value={form.features} onChange={set("features")} placeholder="e.g. Pool, Gym, Parking, Garden, Sea View" textarea />
      <Field label="Additional Notes (optional)" value={form.notes} onChange={set("notes")} placeholder="Anything else to highlight..." textarea />
      <GenerateBtn onClick={() => onGenerate({ feature: "listing", language, ...form })} loading={loading} />
    </div>
  );
}

function SocialForm({ onGenerate, loading, language }) {
  const [form, setForm] = useState({
    propertyType: "", location: "", price: "", highlights: "", targetBuyer: "",
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Property Type" value={form.propertyType} onChange={set("propertyType")} placeholder="e.g. Luxury penthouse, family home" />
        <Field label="Location" value={form.location} onChange={set("location")} placeholder="e.g. Beverly Hills CA, Palm Jumeirah, Gulberg Lahore" />
        <Field label="Price" value={form.price} onChange={set("price")} placeholder={getPricePlaceholder(language)} />
        <Field label="Target Buyer" value={form.targetBuyer} onChange={set("targetBuyer")} placeholder="e.g. Young professionals, families, investors" />
      </div>
      <Field label="Key Highlights" value={form.highlights} onChange={set("highlights")} placeholder="e.g. Stunning city views, modern kitchen, pool, gym" textarea />
      <GenerateBtn onClick={() => onGenerate({ feature: "social", language, ...form })} loading={loading} />
    </div>
  );
}

function EmailForm({ onGenerate, loading, language }) {
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
      <GenerateBtn onClick={() => onGenerate({ feature: "email", language, ...form })} loading={loading} />
    </div>
  );
}

function ContractForm({ onGenerate, loading, language }) {
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
      <GenerateBtn onClick={() => onGenerate({ feature: "contract", language, contractText })} loading={loading} />
    </div>
  );
}

function OpenHouseForm({ onGenerate, loading, language }) {
  const [form, setForm] = useState({
    propertyType: "", location: "", date: "", time: "",
    price: "", highlights: "", agentName: "", agentPhone: "",
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Property Type" value={form.propertyType} onChange={set("propertyType")} placeholder="e.g. 4-bed family home, luxury apartment" />
        <Field label="Location / Address" value={form.location} onChange={set("location")} placeholder="e.g. 45 Maple St, Austin TX" />
        <Field label="Open House Date" value={form.date} onChange={set("date")} placeholder="e.g. Saturday June 7, 2026" />
        <Field label="Time" value={form.time} onChange={set("time")} placeholder="e.g. 11:00 AM – 2:00 PM" />
        <Field label="Asking Price" value={form.price} onChange={set("price")} placeholder={getPricePlaceholder(language)} />
        <Field label="Your Name (Agent)" value={form.agentName} onChange={set("agentName")} placeholder="e.g. Sarah Johnson" />
        <Field label="Phone / WhatsApp" value={form.agentPhone} onChange={set("agentPhone")} placeholder="e.g. +1 555 123 4567" />
      </div>
      <Field label="Key Highlights" value={form.highlights} onChange={set("highlights")} placeholder="e.g. Renovated kitchen, backyard pool, top school district" textarea />
      <GenerateBtn onClick={() => onGenerate({ feature: "openhouse", language, ...form })} loading={loading} />
    </div>
  );
}

function NeighborhoodForm({ onGenerate, loading, language }) {
  const [form, setForm] = useState({
    neighborhood: "", city: "", propertyType: "",
    targetBuyer: "", nearbyPlaces: "", vibe: "",
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Neighborhood / Area Name" value={form.neighborhood} onChange={set("neighborhood")} placeholder="e.g. DHA Phase 6, Palm Jumeirah, Upper East Side" />
        <Field label="City / Country" value={form.city} onChange={set("city")} placeholder="e.g. Lahore Pakistan, Dubai UAE, New York USA" />
        <Field label="Property Type Being Listed" value={form.propertyType} onChange={set("propertyType")} placeholder="e.g. 3-bed apartment, commercial office" />
        <Field label="Target Buyer / Tenant" value={form.targetBuyer} onChange={set("targetBuyer")} placeholder="e.g. Young families, expats, investors" />
      </div>
      <Field label="Nearby Places / Amenities" value={form.nearbyPlaces} onChange={set("nearbyPlaces")} placeholder="e.g. Mall of Lahore 5 min, LGS school nearby, parks, hospitals" textarea />
      <Field label="Vibe / Feel of the Area" value={form.vibe} onChange={set("vibe")} placeholder="e.g. Quiet and residential, trendy and modern, fast-developing" textarea />
      <GenerateBtn onClick={() => onGenerate({ feature: "neighborhood", language, ...form })} loading={loading} />
    </div>
  );
}

function PriceDropForm({ onGenerate, loading, language }) {
  const [form, setForm] = useState({
    propertyType: "", location: "", oldPrice: "", newPrice: "",
    reason: "", features: "", agentName: "",
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Property Type" value={form.propertyType} onChange={set("propertyType")} placeholder="e.g. 5-bed villa, 2-bed apartment" />
        <Field label="Location" value={form.location} onChange={set("location")} placeholder="e.g. Bahria Town Karachi, Downtown Dubai" />
        <Field label="Original Price" value={form.oldPrice} onChange={set("oldPrice")} placeholder={getPricePlaceholder(language)} />
        <Field label="New Reduced Price" value={form.newPrice} onChange={set("newPrice")} placeholder={getPricePlaceholder(language)} />
        <Field label="Your Name (Agent)" value={form.agentName} onChange={set("agentName")} placeholder="e.g. Ali Raza" />
      </div>
      <Field label="Reason for Reduction (optional)" value={form.reason} onChange={set("reason")} placeholder="e.g. Motivated seller, relocating abroad, quick sale needed" textarea />
      <Field label="Key Property Features" value={form.features} onChange={set("features")} placeholder="e.g. Pool, 3 parking spots, new renovation, corner plot" textarea />
      <GenerateBtn onClick={() => onGenerate({ feature: "pricedrop", language, ...form })} loading={loading} />
    </div>
  );
}

function VideoScriptForm({ onGenerate, loading, language }) {
  const [form, setForm] = useState({
    propertyType: "", location: "", price: "", bedrooms: "",
    features: "", targetBuyer: "", agentName: "", duration: "",
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Property Type" value={form.propertyType} onChange={set("propertyType")} placeholder="e.g. Luxury penthouse, family home" />
        <Field label="Location" value={form.location} onChange={set("location")} placeholder="e.g. Islamabad F-7, Downtown LA, JVC Dubai" />
        <Field label="Price" value={form.price} onChange={set("price")} placeholder={getPricePlaceholder(language)} />
        <Field label="Bedrooms" value={form.bedrooms} onChange={set("bedrooms")} placeholder="e.g. 4" />
        <Field label="Agent / Presenter Name" value={form.agentName} onChange={set("agentName")} placeholder="e.g. Hamza Malik" />
        <Field label="Video Duration" value={form.duration} onChange={set("duration")} placeholder="e.g. 60 seconds, 2-3 minutes" />
      </div>
      <Field label="Key Features to Highlight" value={form.features} onChange={set("features")} placeholder="e.g. Rooftop terrace, smart home, sea view, marble flooring" textarea />
      <Field label="Target Buyer / Audience" value={form.targetBuyer} onChange={set("targetBuyer")} placeholder="e.g. Investors, luxury buyers, overseas Pakistanis" textarea />
      <GenerateBtn onClick={() => onGenerate({ feature: "videoscript", language, ...form })} loading={loading} />
    </div>
  );
}

function BioForm({ onGenerate, loading, language }) {
  const [form, setForm] = useState({
    agentName: "", yearsExperience: "", location: "",
    specialties: "", achievements: "", personalTouch: "", tone: "",
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Agent Name" value={form.agentName} onChange={set("agentName")} placeholder="e.g. Sarah Johnson, Ahmed Khan" />
        <Field label="Years of Experience" value={form.yearsExperience} onChange={set("yearsExperience")} placeholder="e.g. 7" />
        <Field label="Location / Market" value={form.location} onChange={set("location")} placeholder="e.g. Austin TX, Dubai UAE, Lahore Pakistan" />
        <Field label="Tone" value={form.tone} onChange={set("tone")} placeholder="e.g. Professional, friendly, luxury, energetic" />
      </div>
      <Field label="Specialties" value={form.specialties} onChange={set("specialties")} placeholder="e.g. Luxury homes, first-time buyers, commercial, relocation" textarea />
      <Field label="Achievements / Credentials" value={form.achievements} onChange={set("achievements")} placeholder="e.g. Top 1% agent 2025, $50M+ in sales, certified luxury specialist" textarea />
      <Field label="Personal Touch (optional)" value={form.personalTouch} onChange={set("personalTouch")} placeholder="e.g. Local to the area for 20 years, loves hiking, bilingual" textarea />
      <GenerateBtn onClick={() => onGenerate({ feature: "bio", language, ...form })} loading={loading} />
    </div>
  );
}

const CONTENT_TYPES = [
  { value: "blog_post",          label: "📝 Blog Post" },
  { value: "buyers_guide",       label: "📘 Buyer's Guide" },
  { value: "sellers_guide",      label: "📙 Seller's Guide" },
  { value: "market_report",      label: "📊 Market Report" },
  { value: "checklist",          label: "✅ Checklist" },
  { value: "faq",                label: "❓ FAQ Article" },
  { value: "tips_list",          label: "💡 Tips List" },
  { value: "neighborhood_guide", label: "🗺️ Neighborhood Guide" },
];

function LeadMagnetForm({ onGenerate, loading, language }) {
  const [form, setForm] = useState({
    contentType: "blog_post",
    topic: "",
    targetAudience: "",
    location: "",
    agentName: "",
    keyPoints: "",
    tone: "",
    wordCount: "",
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CONTENT_TYPES.map((ct) => (
            <button
              key={ct.value}
              type="button"
              onClick={() => setForm((f) => ({ ...f, contentType: ct.value }))}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors text-left ${
                form.contentType === ct.value
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {ct.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Topic / Title Idea" value={form.topic} onChange={set("topic")} placeholder="e.g. How to buy your first home in Dubai, Top 5 mistakes home sellers make" />
        <Field label="Target Audience" value={form.targetAudience} onChange={set("targetAudience")} placeholder="e.g. First-time buyers, overseas investors, young couples" />
        <Field label="Location / Market (optional)" value={form.location} onChange={set("location")} placeholder="e.g. Dubai, Lahore, Austin TX — or leave blank for general" />
        <Field label="Your Name / Brand (optional)" value={form.agentName} onChange={set("agentName")} placeholder="e.g. Ahmed Khan – Lahore Realty" />
        <Field label="Tone" value={form.tone} onChange={set("tone")} placeholder="e.g. Friendly & educational, professional, conversational" />
        <Field label="Approx. Word Count" value={form.wordCount} onChange={set("wordCount")} placeholder="e.g. 500 words, 800 words, short (default: ~600)" />
      </div>

      <Field label="Key Points to Cover (optional)" value={form.keyPoints} onChange={set("keyPoints")} placeholder="e.g. Down payment tips, mortgage pre-approval, hidden costs, negotiation tactics" textarea />

      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
        <span className="text-lg mt-0.5">🧲</span>
        <p className="text-xs text-blue-700 leading-relaxed">
          <strong>Lead Magnet tip:</strong> Share the generated content as a free download, blog post, or email newsletter to attract and convert potential buyers and sellers into clients.
        </p>
      </div>

      <GenerateBtn onClick={() => onGenerate({ feature: "leadmagnet", language, ...form })} loading={loading} />
    </div>
  );
}

const FIELD_LABELS = {
  propertyType:    "Property Type",
  location:        "Location",
  bedrooms:        "Bedrooms",
  bathrooms:       "Bathrooms",
  size:            "Size",
  price:           "Price",
  features:        "Features",
  notes:           "Notes",
  highlights:      "Key Highlights",
  targetBuyer:     "Target Buyer",
  agentName:       "Agent Name",
  buyerName:       "Buyer Name",
  propertyAddress: "Property Address",
  showingDate:     "Showing Date",
  buyerInterests:  "Buyer Interests",
  nextStep:        "Next Step",
  contractText:    "Contract Text",
  date:            "Open House Date",
  time:            "Time",
  agentPhone:      "Phone / WhatsApp",
  neighborhood:    "Neighborhood",
  city:            "City / Country",
  vibe:            "Area Vibe",
  nearbyPlaces:    "Nearby Places",
  oldPrice:        "Original Price",
  newPrice:        "New Price",
  reason:          "Reason for Reduction",
  duration:        "Video Duration",
  yearsExperience: "Years of Experience",
  specialties:     "Specialties",
  achievements:    "Achievements",
  personalTouch:   "Personal Touch",
  tone:            "Tone",
  language:        "Output Language",
  contentType:     "Content Type",
  topic:           "Topic / Title Idea",
  targetAudience:  "Target Audience",
  keyPoints:       "Key Points",
  wordCount:       "Word Count",
};

const TAB_LABELS = {
  listing:      "Listing Writer",
  social:       "Social Media",
  email:        "Buyer Email",
  contract:     "Contract Summary",
  openhouse:    "Open House",
  neighborhood: "Neighborhood",
  pricedrop:    "Price Reduction",
  videoscript:  "Video Script",
  bio:          "Realtor Bio",
  leadmagnet:   "Lead Magnet / Blog",
};

function ResultPanel({ result, inputData, onCopy, copied, onClose }) {
  const { feature, language, ...fields } = inputData || {};
  const inputEntries = Object.entries(fields).filter(([, v]) => v && v.trim && v.trim() !== "");

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.3)",
          zIndex: 150,
        }}
      />

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

        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "16px 20px", borderBottom: "1px solid #e5e7eb",
          background: "#fff", flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{
              background: "#eff6ff", color: "#1d4ed8",
              fontSize: "12px", fontWeight: "600",
              padding: "3px 10px", borderRadius: "20px",
            }}>
              {TAB_LABELS[feature] || feature}
            </span>
            {language && language !== "en" && (
              <span style={{
                background: "#fef3c7", color: "#92400e",
                fontSize: "12px", fontWeight: "600",
                padding: "3px 10px", borderRadius: "20px",
              }}>
                {LANGUAGES.find((l) => l.code === language)?.label || language}
              </span>
            )}
          </div>
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

        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>

          {inputEntries.length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <p style={{
                fontSize: "11px", fontWeight: "600", color: "#9ca3af",
                letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px",
              }}>
                Input Details
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {inputEntries.map(([key, value]) => (
                  <div key={key}>
                    <p style={{ fontSize: "11px", color: "#9ca3af", margin: "0 0 2px" }}>
                      {FIELD_LABELS[key] || key}
                    </p>
                    <p style={{ fontSize: "14px", fontWeight: "500", color: "#111827", margin: 0 }}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {inputEntries.length > 0 && (
            <div style={{ borderTop: "1px solid #e5e7eb", marginBottom: "20px" }} />
          )}

          <p style={{
            fontSize: "11px", fontWeight: "600", color: "#9ca3af",
            letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px",
          }}>
            AI Output
          </p>
          <pre style={{
            whiteSpace: "pre-wrap", fontSize: "14px", color: "#1f2937",
            fontFamily: "inherit", lineHeight: "1.7", margin: 0,
            direction: language === "ar" ? "rtl" : "ltr",
            textAlign: language === "ar" ? "right" : "left",
          }}>
            {result}
          </pre>

          {feature === "listing" && (
            <div style={{
              marginTop: "20px", padding: "12px 14px",
              background: "#f8fafc", border: "1px solid #e2e8f0",
              borderRadius: "10px", display: "flex", gap: "10px", alignItems: "flex-start",
            }}>
              <span style={{ fontSize: "16px" }}>⚖️</span>
              <p style={{ fontSize: "12px", color: "#64748b", lineHeight: 1.6, margin: 0 }}>
                <strong style={{ color: "#475569" }}>Fair Housing Notice:</strong> This AI-generated description is a drafting aid. Review before publishing to ensure compliance with the Fair Housing Act — remove any language that could be seen as discriminatory based on race, color, religion, sex, disability, familial status, or national origin.
              </p>
            </div>
          )}

          {feature === "leadmagnet" && (
            <div style={{
              marginTop: "20px", padding: "12px 14px",
              background: "#f0fdf4", border: "1px solid #bbf7d0",
              borderRadius: "10px", display: "flex", gap: "10px", alignItems: "flex-start",
            }}>
              <span style={{ fontSize: "16px" }}>🧲</span>
              <p style={{ fontSize: "12px", color: "#166534", lineHeight: 1.6, margin: 0 }}>
                <strong>How to use this:</strong> Post it on your website or blog, share it as a free PDF download to collect email leads, or send it as a newsletter to your contact list to position yourself as the local market expert.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function GeneratePage() {
  const [activeTab, setActiveTab] = useState("listing");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [inputData, setInputData] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [session, setSession] = useState(null);
  const [usage, setUsage] = useState(null);
  const [language, setLanguage] = useState("en");

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
    setInputData(null);
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
        setInputData(payload);
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
    listing:      <ListingForm      onGenerate={handleGenerate} loading={loading} language={language} />,
    social:       <SocialForm       onGenerate={handleGenerate} loading={loading} language={language} />,
    email:        <EmailForm        onGenerate={handleGenerate} loading={loading} language={language} />,
    contract:     <ContractForm     onGenerate={handleGenerate} loading={loading} language={language} />,
    openhouse:    <OpenHouseForm    onGenerate={handleGenerate} loading={loading} language={language} />,
    neighborhood: <NeighborhoodForm onGenerate={handleGenerate} loading={loading} language={language} />,
    pricedrop:    <PriceDropForm    onGenerate={handleGenerate} loading={loading} language={language} />,
    videoscript:  <VideoScriptForm  onGenerate={handleGenerate} loading={loading} language={language} />,
    bio:          <BioForm          onGenerate={handleGenerate} loading={loading} language={language} />,
    leadmagnet:   <LeadMagnetForm   onGenerate={handleGenerate} loading={loading} language={language} />,
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
              onClick={() => { setActiveTab(tab.id); setResult(""); setError(""); setInputData(null); }}
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
          <LanguageSelector language={language} setLanguage={setLanguage} />
          {forms[activeTab]}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}
        </div>

      </div>

      {result && (
        <ResultPanel
          result={result}
          inputData={inputData}
          onCopy={handleCopy}
          copied={copied}
          onClose={() => { setResult(""); setInputData(null); }}
        />
      )}
    </div>
  );
}