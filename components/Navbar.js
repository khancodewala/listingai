"use client";

import Link from "next/link";
import LogoMark from "@/components/LogoMark";
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

  if (pathname === "/dashboard") return null;

  return (
    <>
      <style>{`
        .nav-link {
          color: #D8E4F0;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s ease;
        }
        .nav-link:hover { color: #C4A35C; }
        .nav-mobile-link {
          color: #D8E4F0;
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          padding: 10px 0;
          border-bottom: 1px solid rgba(196,163,92,0.10);
          transition: color 0.2s ease;
        }
        .nav-mobile-link:hover { color: #C4A35C; }
        .nav-desktop { display: flex; gap: 24px; align-items: center; }
        .nav-hamburger { display: none; }
        @media (max-width: 640px) {
          .nav-desktop { display: none; }
          .nav-hamburger { display: block; }
        }
      `}</style>

      <nav style={{
        background: "#0B1628",
        borderBottom: "1px solid rgba(196,163,92,0.15)",
        padding: "14px 24px",
        position: "sticky",
        top: 0,
        zIndex: 100,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none" }}>
            <LogoMark size="md" theme="dark" />
          </Link>
          {/* Desktop Nav */}
          <div className="nav-desktop">
            <Link href="/generate" className="nav-link">AI Generator</Link>
            <Link href="/pricing" className="nav-link">Pricing</Link>
            <Link href="/dashboard" className="nav-link">Dashboard</Link>
            {user ? (
              <>
                <span style={{ color: "#A8B8C8", fontSize: "13px" }}>{user.email}</span>
                <button
                  onClick={handleLogout}
                  style={{
                    background: "#ef4444", color: "#fff",
                    border: "none", fontSize: "14px", fontWeight: 600,
                    padding: "8px 18px", borderRadius: "8px", cursor: "pointer",
                  }}
                >Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="nav-link">Login</Link>
                <Link href="/signup" style={{
                  background: "#C4A35C", color: "#0B1628",
                  textDecoration: "none", fontSize: "14px", fontWeight: 700,
                  padding: "8px 20px", borderRadius: "50px",
                }}>Sign Up</Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="nav-hamburger"
            style={{
              background: "none", border: "none",
              cursor: "pointer", fontSize: "22px",
              color: "#C4A35C",
            }}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{
            maxWidth: "1100px", margin: "0 auto",
            paddingTop: "12px", paddingBottom: "8px",
            display: "flex", flexDirection: "column",
            borderTop: "1px solid rgba(196,163,92,0.10)",
            marginTop: "12px",
          }}>
            <Link href="/generate" onClick={() => setMenuOpen(false)} className="nav-mobile-link">AI Generator</Link>
            <Link href="/pricing" onClick={() => setMenuOpen(false)} className="nav-mobile-link">Pricing</Link>
            <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="nav-mobile-link">Dashboard</Link>
            {user ? (
              <>
                <span style={{ color: "#A8B8C8", fontSize: "13px", padding: "10px 0" }}>{user.email}</span>
                <button
                  onClick={handleLogout}
                  style={{
                    background: "#ef4444", color: "#fff",
                    border: "none", fontSize: "15px", fontWeight: 600,
                    padding: "11px 16px", borderRadius: "8px",
                    cursor: "pointer", textAlign: "left", marginTop: "4px",
                  }}
                >Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)} className="nav-mobile-link">Login</Link>
                <Link href="/signup" onClick={() => setMenuOpen(false)} style={{
                  background: "#C4A35C", color: "#0B1628",
                  textDecoration: "none", fontSize: "15px", fontWeight: 700,
                  padding: "11px 16px", borderRadius: "50px",
                  textAlign: "center", marginTop: "8px",
                }}>Sign Up</Link>
              </>
            )}
          </div>
        )}
      </nav>
    </>
  );
}