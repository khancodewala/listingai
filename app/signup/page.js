"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import LogoMark from "@/components/LogoMark";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name } }
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      window.location.href = "/generate";
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/generate`,
      },
    });
    if (error) {
      setError(error.message);
      setGoogleLoading(false);
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
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{
        background: "#ffffff",
        border: "1px solid #ece6d8",
        borderRadius: "16px",
        padding: "26px 36px",
        width: "100%",
        maxWidth: "420px",
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
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px", position: "relative" }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <LogoMark size="md" theme="light" />
          </a>
        </div>

        <h1 style={{ color: "#1a1a1a", fontSize: "20px", fontWeight: 500, textAlign: "center", margin: "0 0 4px", fontFamily: "Georgia, serif" }}>
          Create account
        </h1>
        <p style={{ color: "#8a8a85", fontSize: "13px", textAlign: "center", margin: "0 0 20px" }}>
          Start your free trial today
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

        {/* Google Sign Up Button */}
        <button
          onClick={handleGoogleSignup}
          disabled={googleLoading || loading}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            padding: "11px",
            background: "#ffffff",
            border: "1px solid #e2ded4",
            borderRadius: "8px",
            color: "#1a1a1a",
            fontSize: "14px",
            fontWeight: 500,
            cursor: googleLoading || loading ? "not-allowed" : "pointer",
            marginBottom: "18px",
            opacity: googleLoading ? 0.7 : 1,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 01-1.8 2.72v2.26h2.9c1.7-1.57 2.68-3.87 2.68-6.62z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 009 18z"/>
            <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 013.68 9c0-.59.1-1.17.27-1.7V4.97H.96A9 9 0 000 9c0 1.45.35 2.83.96 4.03l2.99-2.33z"/>
            <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 00.96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58z"/>
          </svg>
          {googleLoading ? "Redirecting..." : "Sign up with Google"}
        </button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
          <div style={{ flex: 1, height: "1px", background: "#e2ded4" }} />
          <span style={{ color: "#8a8a85", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.04em" }}>or</span>
          <div style={{ flex: 1, height: "1px", background: "#e2ded4" }} />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", color: "#8a8a85", fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "6px" }}>
            Full name
          </label>
          <input
            type="text"
            placeholder="John Smith"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%", boxSizing: "border-box",
              background: "#f7f6f3", border: "1px solid #e2ded4",
              borderRadius: "8px", padding: "10px 14px",
              color: "#1a1a1a", fontSize: "14px", outline: "none",
            }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
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

        <div style={{ marginBottom: "18px" }}>
          <label style={{ display: "block", color: "#8a8a85", fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "6px" }}>
            Password
          </label>
          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%", boxSizing: "border-box",
              background: "#f7f6f3", border: "1px solid #e2ded4",
              borderRadius: "8px", padding: "10px 14px",
              color: "#1a1a1a", fontSize: "14px", outline: "none",
            }}
          />
        </div>

        <button
          onClick={handleSignup}
          disabled={loading || googleLoading}
          style={{
            width: "100%", padding: "12px",
            background: loading ? "#5c7d91" : "#185F85",
            color: "#ffffff", fontWeight: 500, fontSize: "14px",
            border: "none", borderRadius: "8px", cursor: loading ? "not-allowed" : "pointer",
            letterSpacing: "0.02em",
          }}
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p style={{ color: "#8a8a85", fontSize: "13px", textAlign: "center", marginTop: "16px", marginBottom: 0 }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "#185F85", fontWeight: 500, textDecoration: "none" }}>Log in</a>
        </p>
      </div>
    </main>
  );
}