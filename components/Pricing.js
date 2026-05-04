export default function Pricing() {
  return (
    <section id="pricing" className="w-full py-16 px-4 bg-white overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Simple, Transparent Pricing</h2>
        <p className="text-center text-gray-500 mb-12">Start free, upgrade when you are ready</p>
        <div className="flex flex-col gap-6">
          <div className="rounded-xl p-8 border border-gray-200 shadow-sm w-full">
            <h3 className="text-xl font-bold mb-2">Free</h3>
            <div className="text-4xl font-bold mb-4">$0</div>
            <p className="text-gray-500 mb-6">5 AI generations per month</p>
            <a href="/signup" className="block text-center font-bold py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Get Started Free</a>
          </div>
          <div className="rounded-xl p-8 border border-blue-600 shadow-xl bg-blue-600 text-white w-full">
            <h3 className="text-xl font-bold mb-2">Starter</h3>
            <div className="text-4xl font-bold mb-4">$12</div>
            <p className="text-blue-200 mb-6">50 AI generations per month</p>
            <a href="/signup" className="block text-center font-bold py-3 rounded-lg bg-white text-blue-600 hover:bg-blue-50">Start Starter Plan</a>
          </div>
          <div className="rounded-xl p-8 border border-gray-200 shadow-sm w-full">
            <h3 className="text-xl font-bold mb-2">Pro</h3>
            <div className="text-4xl font-bold mb-4">$25</div>
            <p className="text-gray-500 mb-6">Unlimited AI generations</p>
            <a href="/signup" className="block text-center font-bold py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Start Pro Plan</a>
          </div>
        </div>
      </div>
    </section>
  );
}