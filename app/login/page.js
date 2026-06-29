"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import LogoMark from "@/components/LogoMark";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      window.location.href = "/generate";
    }
  };

  return (
    <main style={{
      minHeight: "100vh",
      background: "#080F1E",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{
        background: "#0f1c3f",
        border: "1px solid rgba(196,163,92,0.2)",
        borderRadius: "16px",
        padding: "40px",
        width: "100%",
        maxWidth: "420px",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "28px" }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <LogoMark size="lg" theme="dark" />
          </a>
        </div>

        <h1 style={{ color: "#ffffff", fontSize: "22px", fontWeight: 700, textAlign: "center", margin: "0 0 6px" }}>
          Welcome Back
        </h1>
        <p style={{ color: "#A8B8C8", fontSize: "14px", textAlign: "center", margin: "0 0 28px" }}>
          Login to your account
        </p>

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            color: "#fca5a5",
            fontSize: "13px",
            borderRadius: "8px",
            padding: "12px 16px",
            marginBottom: "20px",
          }}>
            ⚠️ {error}
          </div>
        )}

        <div style={{ marginBottom: "16px" }}>
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

        <div style={{ marginBottom: "8px" }}>
          <label style={{ display: "block", color: "#D8E4F0", fontSize: "13px", fontWeight: 500, marginBottom: "8px" }}>
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%", boxSizing: "border-box",
              background: "#0a1628", border: "1px solid rgba(196,163,92,0.2)",
              borderRadius: "8px", padding: "12px 16px",
              color: "#ffffff", fontSize: "14px", outline: "none",
            }}
          />
        </div>

        <div style={{ textAlign: "right", marginBottom: "24px" }}>
          <a href="/forgot-password" style={{ color: "#C4A35C", fontSize: "13px", textDecoration: "none" }}>
            Forgot password?
          </a>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%", padding: "13px",
            background: loading ? "#8a6d3b" : "#C4A35C",
            color: "#0B1628", fontWeight: 700, fontSize: "15px",
            border: "none", borderRadius: "50px", cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={{ color: "#A8B8C8", fontSize: "14px", textAlign: "center", marginTop: "24px" }}>
          Don't have an account?{" "}
          <a href="/signup" style={{ color: "#C4A35C", fontWeight: 600, textDecoration: "none" }}>Sign Up</a>
        </p>
      </div>
    </main>
  );
}