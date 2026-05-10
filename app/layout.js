"use client";

import "./globals.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function RootLayout({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <html lang="en">
      <body>
        <nav style={{
          background: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}>
          <Link href="/" style={{ fontWeight: "700", fontSize: "20px", color: "#1d4ed8", textDecoration: "none" }}>
            🏠 ListingAI
          </Link>
          <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
            <Link href="/generate" style={{ color: "#374151", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>
              AI Generator
            </Link>
            <Link href="/pricing" style={{ color: "#374151", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>
              Pricing
            </Link>
            <Link href="/dashboard" style={{ color: "#374151", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>
              Dashboard
            </Link>

            {user ? (
              <>
                <span style={{ color: "#6b7280", fontSize: "14px" }}>
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  style={{
                    background: "#ef4444",
                    color: "#ffffff",
                    border: "none",
                    fontSize: "14px",
                    fontWeight: "500",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" style={{ color: "#374151", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>
                  Login
                </Link>
                <Link href="/signup" style={{
                  background: "#1d4ed8",
                  color: "#ffffff",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: "500",
                  padding: "8px 16px",
                  borderRadius: "8px",
                }}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}