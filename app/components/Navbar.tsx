"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-900 text-white shadow-lg">
      <Link href="/" className="text-xl font-bold">FitJob</Link>

      <div className="flex gap-6 items-center">
        {status === "authenticated" ? (
          <>
            <Link href="/dashboard" className="hover:text-blue-400">Dashboard</Link>
            <span className="text-gray-400">|</span>
            <span className="text-sm font-medium">{session.user?.name}</span>
            <button 
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:text-blue-400">Login</Link>
            <Link 
              href="/signup" 
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm transition"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}