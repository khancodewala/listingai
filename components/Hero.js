export default function Hero() {
  return (
    <section className="w-full bg-blue-700 text-white py-24 px-6 text-center">
      <h1 className="text-5xl font-bold mb-6">Write Perfect Property Listings in Seconds with AI</h1>
      <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">ListingAI helps real estate agents generate professional property descriptions, social media posts, and buyer emails instantly.</p>
      <div className="flex gap-4 justify-center">
        <a href="/generate" className="bg-white text-blue-600 font-bold px-8 py-4 rounded-lg hover:bg-blue-50 text-lg">Start Free Trial</a>
        <a href="#features" className="bg-blue-800 text-white font-bold px-8 py-4 rounded-lg hover:bg-blue-900 text-lg">See Features</a>
      </div>
      <p className="mt-6 text-blue-200 text-sm">No credit card required. 5 free generations. Cancel anytime.</p>
    </section>
  );
}