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
    <main style={{
      minHeight: "calc(100vh - 60px)",
      background: "#080F1E",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      paddingTop: "60px",
      paddingLeft: "24px",
      paddingRight: "24px",
      paddingBottom: "40px",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{
        background: "#0f1c3f",
        border: "1px solid rgba(196,163,92,0.2)",
        borderRadius: "16px",
        padding: "36px",
        width: "100%",
        maxWidth: "400px",
      }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <LogoMark size="md" theme="dark" />
          </a>
        </div>

        <h1 style={{ color: "#ffffff", fontSize: "20px", fontWeight: 700, textAlign: "center", margin: "0 0 6px" }}>
          Forgot Password
        </h1>
        <p style={{ color: "#A8B8C8", fontSize: "13px", textAlign: "center", margin: "0 0 24px" }}>
          Enter your email and we'll send you a reset link
        </p>

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            color: "#fca5a5", fontSize: "13px",
            borderRadius: "8px", padding: "12px 16px", marginBottom: "16px",
          }}>
            ⚠️ {error}
          </div>
        )}

        {success ? (
          <div style={{
            background: "rgba(34,197,94,0.1)",
            border: "1px solid rgba(34,197,94,0.3)",
            color: "#86efac", fontSize: "13px",
            borderRadius: "8px", padding: "16px", textAlign: "center",
          }}>
            ✅ Reset link sent! Check your email and click the link to set a new password.
          </div>
        ) : (
          <>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", color: "#D8E4F0", fontSize: "13px", fontWeight: 500, marginBottom: "8px" }}>
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%", boxSizing: "border-box",
                  background: "#0a1628", border: "1px solid rgba(196,163,92,0.2)",
                  borderRadius: "8px", padding: "12px 16px",
                  color: "#ffffff", fontSize: "14px", outline: "none",
                }}
              />
            </div>

            <button
              onClick={handleReset}
              disabled={loading}
              style={{
                width: "100%", padding: "12px",
                background: loading ? "#8a6d3b" : "#C4A35C",
                color: "#0B1628", fontWeight: 700, fontSize: "15px",
                border: "none", borderRadius: "50px", cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </>
        )}

        <p style={{ color: "#A8B8C8", fontSize: "13px", textAlign: "center", marginTop: "20px" }}>
          Remember your password?{" "}
          <a href="/login" style={{ color: "#C4A35C", fontWeight: 600, textDecoration: "none" }}>
            Back to Login
          </a>
        </p>
      </div>
    </main>
  );
}