"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/browser";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";

export default function SignUpPage() {
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Check your email for a magic link!");
    }

    setSubmitting(false);
  }

  if (loading) return <div>Loading...</div>;
  if (user)
    return (
      <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow text-center">
        <p className="mb-4">
          You are already signed in as <b>{user.email}</b>.
        </p>
        <button
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
          onClick={async () => {
            await supabase.auth.signOut();
            router.push("/lounges");
          }}
        >
          Sign out
        </button>
      </div>
    );

  return (
    <main className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Sign Up</h1>
      <form onSubmit={handleSignUp} className="flex flex-col gap-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="px-3 py-2 border rounded text-sm"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
          disabled={submitting}
        >
          {submitting ? "Signing up..." : "Sign up"}
        </button>
      </form>
    </main>
  );
}
