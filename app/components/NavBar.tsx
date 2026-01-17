"use client"

import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton, useUser } from "@clerk/nextjs"
import Link from "next/link"

export default function Navbar() {
  const { user } = useUser();
  
  // Get the role from Clerk Metadata
  const role = user?.publicMetadata?.role;
  console.log("Navbar - User Role:", role);
  return (
    <nav className="w-full h-16 border-b flex items-center justify-between px-6 bg-white dark:bg-black">
      <Link href="/" className="text-xl font-semibold">JobFit</Link>
      
      <div className="flex items-center gap-4">
        <SignedIn>
          {/* 1. Links for CANDIDATES */}
          {role === "CANDIDATE" && (
            <>
              <Link href="/jobs" className="text-sm font-medium hover:text-blue-600 transition">
                Find Jobs
              </Link>
              <Link href="/my-applications" className="text-sm font-medium hover:text-blue-600 transition">
                My Applied
              </Link>
            </>
          )}

          {/* 2. Links for COMPANIES */}
          {role === "COMPANY" && (
            <>
              <Link href="/dashboard/company" className="text-sm font-medium hover:text-blue-600 transition">
                Dashboard
              </Link>
              <Link href="/post-job" className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition">
                Post a Job
              </Link>
            </>
          )}

          <UserButton appearance={{ elements: { avatarBox: "w-10 h-10" } }} />
        </SignedIn>

        <SignedOut>
          <SignInButton mode="modal">
            <button className="px-4 py-2 rounded-lg border">Sign In</button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="px-4 py-2 rounded-lg bg-[#6c47ff] text-white">Sign Up</button>
          </SignUpButton>
        </SignedOut>
      </div>
    </nav> 
  )
}