"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase/browser";
import { useAuth } from "./AuthProvider";

export function AuthButton() {
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setStatus(null);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setError(error.message);
    } else {
      setStatus("Check your email for a magic link!");
    }
    setSubmitting(false);
  }

  async function handleSignOut() {
    setSubmitting(true);
    await supabase.auth.signOut();
    setSubmitting(false);
  }

  if (loading) return <div>Loading...</div>;

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm">{user.email}</span>
        <button
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
          onClick={handleSignOut}
          disabled={submitting}
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSignIn} className="flex items-center gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        className="px-2 py-1 border rounded text-sm"
      />
      <button
        type="submit"
        className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
        disabled={submitting}
      >
        {submitting ? "Signing in..." : "Sign in"}
      </button>
      {status && <span className="text-green-600 text-xs ml-2">{status}</span>}
      {error && <span className="text-red-600 text-xs ml-2">{error}</span>}
    </form>
  );
}
