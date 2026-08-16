"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import LogoMark from "@/components/LogoMark";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  return (
    <main className="theme-light-auth" style={{
      minHeight: "calc(100vh - 60px)",
      background: "#FAF8F2",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px",
      paddingTop: "12px",
      paddingBottom: "12px",
      fontFamily: "var(--font-dm-sans)",
    }}>
      <div style={{
        background: "#ffffff",
        border: "1px solid #ece6d8",
        borderRadius: "16px",
        padding: "40px 36px",
        width: "100%",
        maxWidth: "380px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative corner accent */}
        <div style={{
          position: "absolute",
          top: "-40px",
          right: "-40px",
          width: "140px",
          height: "140px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(94,155,124,0.10) 0%, rgba(24,95,133,0.06) 55%, rgba(24,95,133,0) 80%)",
        }} />

        {/* Logo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px", position: "relative" }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <LogoMark size="md" theme="light" />
          </a>
        </div>

        {/* Icon badge */}
        <div style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          background: "#eaf1f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
          position: "relative",
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16v12H4z" stroke="#185F85" strokeWidth="1.6" strokeLinejoin="round"/>
            <path d="M4 7l8 6 8-6" stroke="#185F85" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h1 style={{ color: "#1a1a1a", fontSize: "20px", fontWeight: 500, textAlign: "center", margin: "0 0 4px", fontFamily: "Georgia, serif" }}>
          Forgot password
        </h1>
        <p style={{ color: "#8a8a85", fontSize: "13px", textAlign: "center", margin: "0 0 28px", lineHeight: 1.5 }}>
          Enter your email and we'll send you a reset link
        </p>

        {error && (
          <div style={{
            background: "#fdf0ee",
            border: "1px solid #f3c9c2",
            color: "#a3372a",
            fontSize: "13px",
            borderRadius: "8px",
            padding: "10px 14px",
            marginBottom: "16px",
          }}>
            {error}
          </div>
        )}

        {success ? (
          <div style={{
            background: "#eef6f0",
            border: "1px solid #c7e3cd",
            color: "#2f6b3f",
            fontSize: "13px",
            borderRadius: "8px",
            padding: "14px",
            textAlign: "center",
          }}>
            Reset link sent! Check your email and click the link to set a new password.
          </div>
        ) : (
          <>
            <div style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", color: "#8a8a85", fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "6px" }}>
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%", boxSizing: "border-box",
                  background: "#f7f6f3", border: "1px solid #e2ded4",
                  borderRadius: "8px", padding: "10px 14px",
                  color: "#1a1a1a", fontSize: "14px", outline: "none",
                }}
              />
            </div>

            <button
              onClick={handleReset}
              disabled={loading}
              style={{
                width: "100%", padding: "12px",
                background: loading ? "#5c7d91" : "#185F85",
                color: "#ffffff", fontWeight: 500, fontSize: "14px",
                border: "none", borderRadius: "8px", cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: "0.02em",
              }}
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </>
        )}

        <p style={{ color: "#8a8a85", fontSize: "13px", textAlign: "center", marginTop: "22px", marginBottom: 0 }}>
          Remember your password?{" "}
          <a href="/login" style={{ color: "#185F85", fontWeight: 500, textDecoration: "none" }}>
            Back to login
          </a>
        </p>
      </div>
    </main>
  );
}