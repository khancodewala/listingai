export default function Hero() {
  return (
    <section className="w-full bg-blue-700 text-white py-16 px-4 text-center overflow-hidden">
      <h1 className="text-3xl md:text-5xl font-bold mb-6">Write Perfect Property Listings in Seconds with AI</h1>
      <p className="text-base md:text-xl text-blue-100 mb-10 mx-auto">ListingAI helps real estate agents generate professional property descriptions, social media posts, and buyer emails instantly.</p>
      <div className="flex flex-col gap-4 items-center w-full">
        <a href="/generate" className="block w-full max-w-xs bg-white text-blue-600 font-bold px-6 py-4 rounded-lg hover:bg-blue-50">Start Free Trial</a>
        <a href="/#features" className="block w-full max-w-xs bg-blue-800 text-white font-bold px-6 py-4 rounded-lg hover:bg-blue-900">See Features</a>
      </div>
      <p className="mt-6 text-blue-200 text-sm">No credit card required. 5 free generations. Cancel anytime.</p>
    </section>
  );
}