"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

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

  if (pathname === '/dashboard') return null;

  return (
    <nav style={{
      background: "#ffffff",
      borderBottom: "1px solid #e5e7eb",
      padding: "12px 24px",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ fontWeight: "700", fontSize: "20px", color: "#1d4ed8", textDecoration: "none" }}>
          🏠 ListingAI
        </Link>

        <div style={{ display: "flex", gap: "24px", alignItems: "center" }} className="desktop-nav">
          <Link href="/generate" style={{ color: "#374151", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>AI Generator</Link>
          <Link href="/pricing" style={{ color: "#374151", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>Pricing</Link>
          <Link href="/dashboard" style={{ color: "#374151", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>Dashboard</Link>
          {user ? (
            <>
              <span style={{ color: "#6b7280", fontSize: "14px" }}>{user.email}</span>
              <button onClick={handleLogout} style={{ background: "#ef4444", color: "#fff", border: "none", fontSize: "14px", fontWeight: "500", padding: "8px 16px", borderRadius: "8px", cursor: "pointer" }}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" style={{ color: "#374151", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>Login</Link>
              <Link href="/signup" style={{ background: "#1d4ed8", color: "#fff", textDecoration: "none", fontSize: "14px", fontWeight: "500", padding: "8px 16px", borderRadius: "8px" }}>Sign Up</Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="mobile-menu-btn"
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: "24px" }}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-nav" style={{ paddingTop: "12px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <Link href="/generate" onClick={() => setMenuOpen(false)} style={{ color: "#374151", textDecoration: "none", fontSize: "15px", fontWeight: "500" }}>AI Generator</Link>
          <Link href="/pricing" onClick={() => setMenuOpen(false)} style={{ color: "#374151", textDecoration: "none", fontSize: "15px", fontWeight: "500" }}>Pricing</Link>
          <Link href="/dashboard" onClick={() => setMenuOpen(false)} style={{ color: "#374151", textDecoration: "none", fontSize: "15px", fontWeight: "500" }}>Dashboard</Link>
          {user ? (
            <>
              <span style={{ color: "#6b7280", fontSize: "14px" }}>{user.email}</span>
              <button onClick={handleLogout} style={{ background: "#ef4444", color: "#fff", border: "none", fontSize: "15px", fontWeight: "500", padding: "10px 16px", borderRadius: "8px", cursor: "pointer", textAlign: "left" }}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)} style={{ color: "#374151", textDecoration: "none", fontSize: "15px", fontWeight: "500" }}>Login</Link>
              <Link href="/signup" onClick={() => setMenuOpen(false)} style={{ background: "#1d4ed8", color: "#fff", textDecoration: "none", fontSize: "15px", fontWeight: "500", padding: "10px 16px", borderRadius: "8px", textAlign: "center" }}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}