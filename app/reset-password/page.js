"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validSession, setValidSession] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Supabase automatically exchanges the token from the URL hash into a session
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setValidSession(true);
      }
      setChecking(false);
    });
  }, []);

  const handleUpdate = async () => {
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-sm p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="text-2xl font-bold text-blue-600">ListingAI</a>
          <h1 className="text-2xl font-bold text-gray-800 mt-4">Set New Password</h1>
          <p className="text-gray-500 mt-1">Choose a strong password for your account</p>
        </div>

        {checking ? (
          <p className="text-center text-gray-500">Verifying your reset link...</p>
        ) : !validSession ? (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-4 text-center">
            ⚠️ This reset link is invalid or has expired.{" "}
            <a href="/forgot-password" className="underline font-medium">
              Request a new one
            </a>
          </div>
        ) : success ? (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-4 text-center">
            ✅ Password updated! Redirecting you to login...
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                ⚠️ {error}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>

            <button
              onClick={handleUpdate}
              disabled={loading}
              className="block w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 text-center disabled:bg-blue-400"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </>
        )}

        <p className="text-center text-gray-500 mt-6">
          <a href="/login" className="text-blue-600 font-medium hover:underline">
            Back to Login
          </a>
        </p>
      </div>
    </main>
  );
}
