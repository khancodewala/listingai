export default function Signup() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-sm p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="text-2xl font-bold text-blue-600">ListingAI</a>
          <h1 className="text-2xl font-bold text-gray-800 mt-4">Create Account</h1>
          <p className="text-gray-500 mt-1">Start your free trial today</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Full Name</label>
          <input type="text" placeholder="John Smith" className="w-full border border-gray-300 rounded-lg px-4 py-3" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <input type="email" placeholder="you@example.com" className="w-full border border-gray-300 rounded-lg px-4 py-3" />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Password</label>
          <input type="password" placeholder="Create a password" className="w-full border border-gray-300 rounded-lg px-4 py-3" />
        </div>
        <a href="/dashboard" className="block w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 text-center">Create Account</a>
        <p className="text-center text-gray-500 mt-6">Already have an account? <a href="/login" className="text-blue-600 font-medium hover:underline">Login</a></p>
      </div>
    </main>
  );
}