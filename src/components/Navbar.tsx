"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { supabase } from "@/lib/supabase/browser";
import { useState } from "react";
import { toast } from "sonner";

export function Navbar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Successfully signed out");
    }

    setSigningOut(false);
  }

  const navLinks = [
    { href: "/lounges", label: "Home" },
    { href: "/my-lounges", label: "My Lounges" },
  ];

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm">
      <div className="flex items-center gap-6">
        <Link
          href="/"
          className="font-bold text-lg tracking-tight text-blue-700"
        >
          Lounge
        </Link>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm font-medium px-2 py-1 rounded transition-colors duration-150
              ${
                pathname === link.href
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            aria-current={pathname === link.href ? "page" : undefined}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-gray-600">{user.email}</span>
            <button
              onClick={handleSignOut}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
              disabled={signingOut}
            >
              {signingOut ? "Signing out..." : "Sign out"}
            </button>
          </>
        ) : (
          <>
            <Link
              href="/signin"
              className={`text-sm px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors`}
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className={`text-sm px-3 py-1 rounded bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors`}
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
