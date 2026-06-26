"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-sm p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="text-2xl font-bold text-blue-600">ListingAI</a>
          <h1 className="text-2xl font-bold text-gray-800 mt-4">Forgot Password</h1>
          <p className="text-gray-500 mt-1">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            ⚠️ {error}
          </div>
        )}

        {success ? (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-4 text-center">
            ✅ Reset link sent! Check your email and click the link to set a new password.
          </div>
        ) : (
          <>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              onClick={handleReset}
              disabled={loading}
              className="block w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 text-center disabled:bg-blue-400"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </>
        )}

        <p className="text-center text-gray-500 mt-6">
          Remember your password?{" "}
          <a href="/login" className="text-blue-600 font-medium hover:underline">
            Back to Login
          </a>
        </p>
      </div>
    </main>
  );
}
