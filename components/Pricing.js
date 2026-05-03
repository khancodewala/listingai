export default function Pricing() {
  return (
    <section id="pricing" className="w-full py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
          Simple, Transparent Pricing
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="rounded-xl p-8 border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold mb-2">Free</h3>
            <div className="text-4xl font-bold mb-4">$0</div>
            <p className="text-gray-500 mb-6">5 AI generations per month</p>
            <a href="#" className="block text-center font-bold py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
              Get Started Free
            </a>
          </div>
          <div className="rounded-xl p-8 border border-blue-600 shadow-xl bg-blue-600 text-white">
            <h3 className="text-xl font-bold mb-2">Starter</h3>
            <div className="text-4xl font-bold mb-4">$12</div>
            <p className="text-blue-200 mb-6">50 AI generations per month</p>
            <a href="#" className="block text-center font-bold py-3 rounded-lg bg-white text-blue-600 hover:bg-blue-50">
              Start Starter Plan
            </a>
          </div>
          <div className="rounded-xl p-8 border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold mb-2">Pro</h3>
            <div className="text-4xl font-bold mb-4">$25</div>
            <p className="text-gray-500 mb-6">Unlimited AI generations</p>
            <a href="#" className="block text-center font-bold py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
              Start Pro Plan
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}