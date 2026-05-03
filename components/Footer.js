export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-gray-400 py-12 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <div className="text-2xl font-bold text-white mb-2">ListingAI</div>
          <p className="text-sm">
            AI powered tools for real estate agents
          </p>
        </div>
        <nav className="flex gap-6 text-sm">
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#pricing" className="hover:text-white">Pricing</a>
          <a href="#" className="hover:text-white">Login</a>
          <a href="#" className="hover:text-white">Sign Up</a>
        </nav>
        <div className="text-sm">
          © 2026 ListingAI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}