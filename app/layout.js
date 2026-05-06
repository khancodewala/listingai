import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }) {
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
            <Link href="/dashboard" style={{ color: "#374151", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>
              Dashboard
            </Link>
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
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}