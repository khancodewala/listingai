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
          disabled={loading}
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