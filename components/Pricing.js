export default function Pricing() {
  return (
    <section id="pricing" className="w-full py-16 px-4 bg-white overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Simple, Transparent Pricing</h2>
        <p className="text-center text-gray-500 mb-12">Start free, upgrade when you are ready</p>
        <div className="flex flex-col md:flex-row md:items-stretch gap-6">
          {/* Free Plan */}
          <div className="rounded-xl p-8 border border-gray-200 shadow-sm w-full">
            <h3 className="text-xl font-bold mb-2">Free</h3>
            <div className="text-4xl font-bold mb-4">$0</div>
            <p className="text-gray-500 mb-2">5 AI generations per month</p>
            <ul className="text-gray-500 text-sm mb-6 space-y-1">
              <li>✅ Property Listing Writer</li>
              <li>✅ Social Media Captions</li>
              <li>✅ Buyer Emails</li>
              <li>✅ Contract Summary</li>
            </ul>
            <a href="/signup" className="block text-center font-bold py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Get Started Free</a>
          </div>

          {/* Pro Plan */}
          <div className="rounded-xl p-8 border border-blue-600 shadow-xl bg-blue-600 text-white w-full">
            <div className="inline-block bg-white text-blue-600 text-xs font-bold px-3 py-1 rounded-full mb-3">MOST POPULAR</div>
            <h3 className="text-xl font-bold mb-2">Pro</h3>
            <div className="text-4xl font-bold mb-4">$29<span className="text-lg font-normal">/month</span></div>
            <p className="text-blue-200 mb-2">100 AI generations per month</p>
            <ul className="text-blue-100 text-sm mb-6 space-y-1">
              <li>✅ Everything in Free</li>
              <li>✅ 100 generations/month</li>
              <li>✅ Priority support</li>
              <li>✅ Works for any country</li>
            </ul>
            <a href="/pricing" className="block text-center font-bold py-3 rounded-lg bg-white text-blue-600 hover:bg-blue-50">Start Pro Plan</a>
          </div>

          {/* Agency Plan */}
          <div className="rounded-xl p-8 border border-gray-200 shadow-sm w-full">
            <h3 className="text-xl font-bold mb-2">Agency</h3>
            <div className="text-4xl font-bold mb-4">$79<span className="text-lg font-normal text-gray-500">/month</span></div>
            <p className="text-gray-500 mb-2">Unlimited AI generations</p>
            <ul className="text-gray-500 text-sm mb-6 space-y-1">
              <li>✅ Everything in Pro</li>
              <li>✅ Unlimited generations</li>
              <li>✅ Team access</li>
              <li>✅ Dedicated support</li>
            </ul>
            <a href="/pricing" className="block text-center font-bold py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Start Agency Plan</a>
          </div>

        </div>
      </div>
    </section>
  );
}