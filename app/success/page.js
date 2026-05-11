 
"use client";

export default function SuccessPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#ffffff", borderRadius: "16px", border: "1px solid #e5e7eb", padding: "48px 40px", textAlign: "center", maxWidth: "480px", width: "100%" }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎉</div>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#111827", margin: "0 0 12px" }}>You are all set!</h1>
        <p style={{ fontSize: "16px", color: "#6b7280", margin: "0 0 32px" }}>Your plan has been upgraded successfully!</p>
        <a href="/generate" style={{ display: "inline-block", background: "#1d4ed8", color: "#ffffff", borderRadius: "8px", padding: "12px 32px", fontWeight: "600", fontSize: "15px", textDecoration: "none" }}>Start Generating</a>
        <p style={{ fontSize: "13px", color: "#9ca3af", marginTop: "24px" }}>Questions? Contact us anytime.</p>
      </div>
    </div>
  );
}