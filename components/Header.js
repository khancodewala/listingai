export default function Header() {
  return (
    <header className="w-full px-4 py-3 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <a href="/" className="text-xl font-bold text-blue-600 flex items-center gap-1">
          🏠 ListingAI
        </a>
        <nav className="hidden md:flex items-center gap-4 text-gray-600 font-medium text-sm">
          <a href="/#features" className="hover:text-blue-600">Features</a>
          <a href="/#pricing" className="hover:text-blue-600">Pricing</a>
          <a href="/dashboard" className="hover:text-blue-600">Dashboard</a>
          <a href="/login" className="hover:text-blue-600">Login</a>
        </nav>
        <div className="flex items-center gap-2">
          <a href="/login" className="md:hidden text-sm text-gray-600 font-medium hover:text-blue-600">Login</a>
          <a href="/signup" className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm font-bold">Get Started Free</a>
        </div>
      </div>
    </header>
  );
}