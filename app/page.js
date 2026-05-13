import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

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