 export const metadata = {
  title: "AI Property Listing Generator — Write Listings in Seconds",
  description:
    "Use ListingAI's AI generator to write property listings, social media captions, buyer emails, and contract summaries instantly. Powered by Claude AI.",
  robots: { index: false, follow: false },
  alternates: {
    canonical: "https://listingai-rose.vercel.app/generate",
  },
};

export default function GenerateLayout({ children }) {
  return children;
}
