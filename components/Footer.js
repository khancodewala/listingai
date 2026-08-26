"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoMark from "@/components/LogoMark";

export default function Footer() {
  const pathname = usePathname();

  if (pathname === "/dashboard") return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .footer-link {
          color: #A8B8C8;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s ease;
        }
        .footer-link:hover { color: #C4A35C; }
        .footer-cols {
          display: flex;
          flex-wrap: wrap;
          gap: 40px;
          justify-content: space-between;
        }
        .footer-col-heading {
          color: #D8E4F0;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 14px;
        }
        @media (max-width: 640px) {
          .footer-cols { flex-direction: column; gap: 28px; }
        }
      ` }} />

      <footer style={{
        background: "#0B1628",
        borderTop: "1px solid rgba(196,163,92,0.15)",
        padding: "48px 24px 28px",
        fontFamily: "var(--font-dm-sans)",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div className="footer-cols" style={{ marginBottom: "36px" }}>

            {/* Brand */}
            <div style={{ maxWidth: "280px" }}>
              <LogoMark size="md" theme="dark" />
              <p style={{ color: "#8A9AAC", fontSize: "13px", lineHeight: 1.6, marginTop: "14px" }}>
                AI-powered listing descriptions, social captions, and marketing copy for real estate professionals.
              </p>
            </div>

            {/* Product */}
            <div>
              <div className="footer-col-heading">Product</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <Link href="/about" className="footer-link">About</Link>
                <Link href="/generate" className="footer-link">AI Generator</Link>
                <Link href="/pricing" className="footer-link">Pricing</Link>
                <Link href="/dashboard" className="footer-link">Dashboard</Link>
              </div>
            </div>

            {/* Account */}
            <div>
              <div className="footer-col-heading">Account</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <Link href="/login" className="footer-link">Login</Link>
                <Link href="/signup" className="footer-link">Sign Up</Link>
              </div>
            </div>

            {/* Legal */}
            <div>
              <div className="footer-col-heading">Legal</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <Link href="/privacy" className="footer-link">Privacy Policy</Link>
                <Link href="/terms" className="footer-link">Terms of Service</Link>
                <Link href="/contact" className="footer-link">Contact</Link>
              </div>
            </div>
          </div>

          <div style={{
            borderTop: "1px solid rgba(196,163,92,0.10)",
            paddingTop: "20px",
          }}>
            <div style={{ color: "#6E7C8E", fontSize: "13px" }}>
              © {new Date().getFullYear()} ListingAI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}