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
    background: "#f7f6f3", border: "1px solid #e2ded4",
    borderRadius: "8px", padding: "10px 14px",
    color: "#1a1a1a", fontSize: "14px", outline: "none",
  };

  const labelStyle = {
    display: "block", color: "#8a8a85",
    fontSize: "11px", fontWeight: 500, textTransform: "uppercase",
    letterSpacing: "0.04em", marginBottom: "6px",
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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="5" y="11" width="14" height="9" rx="2" stroke="#185F85" strokeWidth="1.6"/>
            <path d="M8 11V7a4 4 0 018 0v4" stroke="#185F85" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
        </div>

        <h1 style={{ color: "#1a1a1a", fontSize: "20px", fontWeight: 500, textAlign: "center", margin: "0 0 4px", fontFamily: "Georgia, serif" }}>
          Set new password
        </h1>
        <p style={{ color: "#8a8a85", fontSize: "13px", textAlign: "center", margin: "0 0 28px", lineHeight: 1.5 }}>
          Choose a strong password for your account
        </p>

        {checking ? (
          <p style={{ color: "#8a8a85", fontSize: "14px", textAlign: "center" }}>
            Verifying your reset link...
          </p>
        ) : !validSession ? (
          <div style={{
            background: "#fdf0ee",
            border: "1px solid #f3c9c2",
            color: "#a3372a",
            fontSize: "13px",
            borderRadius: "8px",
            padding: "14px",
            textAlign: "center",
          }}>
            This reset link is invalid or has expired.{" "}
            <a href="/forgot-password" style={{ color: "#185F85", textDecoration: "underline" }}>
              Request a new one
            </a>
          </div>
        ) : success ? (
          <div style={{
            background: "#eef6f0",
            border: "1px solid #c7e3cd",
            color: "#2f6b3f",
            fontSize: "13px",
            borderRadius: "8px",
            padding: "14px",
            textAlign: "center",
          }}>
            Password updated! Redirecting you to login...
          </div>
        ) : (
          <>
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

            <div style={{ marginBottom: "14px" }}>
              <label style={labelStyle}>New password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "18px" }}>
              <label style={labelStyle}>Confirm password</label>
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
                background: loading ? "#5c7d91" : "#185F85",
                color: "#ffffff", fontWeight: 500, fontSize: "14px",
                border: "none", borderRadius: "8px", cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: "0.02em",
              }}
            >
              {loading ? "Updating..." : "Update password"}
            </button>
          </>
        )}

        <p style={{ color: "#8a8a85", fontSize: "13px", textAlign: "center", marginTop: "22px", marginBottom: 0 }}>
          <a href="/login" style={{ color: "#185F85", fontWeight: 500, textDecoration: "none" }}>
            Back to login
          </a>
        </p>
      </div>
    </main>
  );
}