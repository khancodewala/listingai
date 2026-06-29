"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import LogoMark from "@/components/LogoMark";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validSession, setValidSession] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setValidSession(true);
      }
      setChecking(false);
    });
  }, []);

  const handleUpdate = async () => {
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => { window.location.href = "/login"; }, 3000);
    }
  };

  const inputStyle = {
    width: "100%", boxSizing: "border-box",
    background: "#0a1628", border: "1px solid rgba(196,163,92,0.2)",
    borderRadius: "8px", padding: "12px 16px",
    color: "#ffffff", fontSize: "14px", outline: "none",
  };

  const labelStyle = {
    display: "block", color: "#D8E4F0",
    fontSize: "13px", fontWeight: 500, marginBottom: "8px",
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
          Set New Password
        </h1>
        <p style={{ color: "#A8B8C8", fontSize: "13px", textAlign: "center", margin: "0 0 24px" }}>
          Choose a strong password for your account
        </p>

        {checking ? (
          <p style={{ color: "#A8B8C8", fontSize: "14px", textAlign: "center" }}>
            Verifying your reset link...
          </p>
        ) : !validSession ? (
          <div style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            color: "#fca5a5", fontSize: "13px",
            borderRadius: "8px", padding: "16px", textAlign: "center",
          }}>
            ⚠️ This reset link is invalid or has expired.{" "}
            <a href="/forgot-password" style={{ color: "#C4A35C", textDecoration: "underline" }}>
              Request a new one
            </a>
          </div>
        ) : success ? (
          <div style={{
            background: "rgba(34,197,94,0.1)",
            border: "1px solid rgba(34,197,94,0.3)",
            color: "#86efac", fontSize: "13px",
            borderRadius: "8px", padding: "16px", textAlign: "center",
          }}>
            ✅ Password updated! Redirecting you to login...
          </div>
        ) : (
          <>
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

            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={labelStyle}>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                style={inputStyle}
              />
            </div>

            <button
              onClick={handleUpdate}
              disabled={loading}
              style={{
                width: "100%", padding: "12px",
                background: loading ? "#8a6d3b" : "#C4A35C",
                color: "#0B1628", fontWeight: 700, fontSize: "15px",
                border: "none", borderRadius: "50px", cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </>
        )}

        <p style={{ color: "#A8B8C8", fontSize: "13px", textAlign: "center", marginTop: "20px" }}>
          <a href="/login" style={{ color: "#C4A35C", fontWeight: 600, textDecoration: "none" }}>
            Back to Login
          </a>
        </p>
      </div>
    </main>
  );
}