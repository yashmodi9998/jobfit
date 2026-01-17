"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function Onboarding() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

// inside your Onboarding component
const chooseRole = async (role: "CANDIDATE" | "COMPANY") => {
  setLoading(true);
  console.log("Sending request for role:", role);

  try {
    const res = await fetch("/api/auth/set-role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user?.primaryEmailAddress?.emailAddress,
        name: user?.firstName,
        role,
      }),
    });

    console.log("Response status:", res.status);

   if (res.ok) {
  if (role === "COMPANY") {
    window.location.href = "/dashboard/company";
  } else {
    window.location.href = "/jobs";
  }
}else {
      const errorData = await res.json();
      console.error("API Error:", errorData);
      setLoading(false);
    }
  } catch (err) {
    console.error("Fetch Error:", err);
    setLoading(false);
  }
};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Choose Your Role</h1>
      <div className="flex gap-4">
        <button 
          disabled={loading}
          onClick={() => chooseRole("CANDIDATE")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
        >
          {loading ? "Loading..." : "I'm a Candidate"}
        </button>
        <button 
          disabled={loading}
          onClick={() => chooseRole("COMPANY")}
          className="px-6 py-3 bg-green-600 text-white rounded-lg disabled:bg-gray-400"
        >
          {loading ? "Loading..." : "I'm a Company"}
        </button>
      </div>
    </div>
  );
}