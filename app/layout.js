import "./globals.css";
import Navbar from "@/components/Navbar";

const siteUrl = "https://listingai-rose.vercel.app";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ListingAI — AI Property Listing Writer for Real Estate Agents",
    template: "%s | ListingAI",
  },
  description:
    "Generate professional real estate listings, social media captions, and buyer emails in seconds with AI. Save 30 minutes per listing. Free to start.",
  keywords: [
    "real estate AI",
    "property listing generator",
    "AI listing writer",
    "real estate agent tools",
    "property description generator",
    "MLS listing writer",
    "real estate copywriting AI",
    "listing description AI",
  ],
  authors: [{ name: "ListingAI" }],
  creator: "ListingAI",
  publisher: "ListingAI",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "ListingAI",
    title: "ListingAI — AI Property Listing Writer for Real Estate Agents",
    description:
      "Generate professional real estate listings, social media captions, and buyer emails in seconds. Free to start — no credit card required.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ListingAI — AI-powered real estate listing writer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ListingAI — AI Property Listing Writer",
    description:
      "Generate professional real estate listings in seconds with AI. Free to start.",
    images: ["/og-image.png"],
    creator: "@listingai",
  },
  alternates: {
    canonical: siteUrl,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ListingAI",
  url: siteUrl,
  description:
    "AI-powered tool for real estate agents to generate property listings, social media captions, and buyer emails instantly.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: [
    { "@type": "Offer", name: "Free", price: "0", priceCurrency: "USD", description: "5 AI generations per month" },
    { "@type": "Offer", name: "Pro", price: "29", priceCurrency: "USD", description: "100 AI generations per month" },
    { "@type": "Offer", name: "Agency", price: "79", priceCurrency: "USD", description: "Unlimited AI generations" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}