import { auth } from "@/lib/auth";
import Link from "next/link";
import "./globals.css";
export default async function HomePage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      {/* Hero Section */}
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
          Welcome to <span className="text-blue-600">FitJob</span>
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          The ultimate platform to manage your career and fitness goals in one place. 
          Join thousands of users optimizing their daily routine.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {session ? (
            // If Logged In
            <>
              <Link
                href="/dashboard"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md"
              >
                Go to Dashboard
              </Link>
              <p className="w-full text-sm text-gray-500 mt-4 sm:mt-0 flex items-center justify-center">
                Logged in as {session.user?.email}
              </p>
            </>
          ) : (
            // If Logged Out
            <>
              <Link
                href="/signup"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="bg-white text-blue-600 border border-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-5xl">
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 text-center">
          <div className="text-3xl mb-3">🚀</div>
          <h3 className="font-bold text-gray-800">Fast Setup</h3>
          <p className="text-sm text-gray-500">Get your profile live in under 2 minutes.</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 text-center">
          <div className="text-3xl mb-3">🔒</div>
          <h3 className="font-bold text-gray-800">Secure Auth</h3>
          <p className="text-sm text-gray-500">Your data is protected with Auth.js v5.</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 text-center">
          <div className="text-3xl mb-3">📊</div>
          <h3 className="font-bold text-gray-800">Insights</h3>
          <p className="text-sm text-gray-500">Track your progress with real-time data.</p>
        </div>
      </div>
    </div>
  );
}