import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

export const metadata = {
  title: "ListingAI — Write Perfect Property Listings with AI",
  description:
    "ListingAI helps real estate agents generate professional property descriptions, social media posts, and buyer emails in seconds. 5 free generations — no credit card needed.",
  alternates: {
    canonical: "https://listingai-rose.vercel.app",
  },
};

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen w-full overflow-hidden">
      <Hero />
      <Features />
      <Pricing />
      <Footer />
    </main>
  );
}