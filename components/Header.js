export default function Header() {
  return (
    <header className="w-full px-4 py-4 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <a href="/" className="text-2xl font-bold text-blue-600">ListingAI</a>
        <a href="/signup" className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm font-bold">Get Started Free</a>
      </div>
      <nav className="flex flex-wrap gap-3 text-gray-600 font-medium text-sm">
        <a href="/#features" className="hover:text-blue-600">Features</a>
        <a href="/#pricing" className="hover:text-blue-600">Pricing</a>
        <a href="/dashboard" className="hover:text-blue-600">Dashboard</a>
        <a href="/login" className="hover:text-blue-600">Login</a>
      </nav>
    </header>
  );
}