import { auth } from "@/lib/auth";
import Link from "next/link";
import "./globals.css";
import { Zap, ShieldCheck, BarChart3, ArrowRight } from "lucide-react";
import FeatureCard from "./components/FeatureCard";

export default async function HomePage() {
  // Check if user is authenticated
  const session = await auth();

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center px-4 overflow-hidden relative">
      {/* Background Decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-50 to-transparent -z-10" />

      {/* Hero Section */}
      <div className="text-center max-w-3xl mt-20">
        
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Land your dream job with <span className="text-blue-600">JobFit</span>
        </h1>
        
        <p className="text-xl text-slate-600 mb-10 leading-relaxed">
          Stop guessing why you aren&apos;t getting interviews. Our AI analyzes your resume 
          against job descriptions to find skill gaps and generate technical prep questions.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {session ? (
            <div className="flex flex-col items-center gap-4">
              <Link
                href="/dashboard"
                className="group bg-blue-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center gap-2"
              >
                Go to Dashboard
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-sm text-slate-400">
                Welcome back, <span className="font-semibold text-slate-600">{session.user?.email}</span>
              </p>
            </div>
          ) : (
            <>
              <Link
                href="/signup"
                className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
              >
                Start Free Analysis
              </Link>
              <Link
                href="/login"
                className="bg-white text-slate-700 border border-slate-200 px-10 py-4 rounded-xl font-bold hover:bg-slate-50 transition"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 mb-20 max-w-6xl w-full">
        <FeatureCard 
          icon={<Zap className="text-amber-500" />} 
          title="Gap Analysis" 
          desc="Identify missing keywords and technical skills required for specific job postings." 
        />
        <FeatureCard 
          icon={<ShieldCheck className="text-emerald-500" />} 
          title="Interview Prep" 
          desc="Get AI-generated technical questions based on your specific experience and the JD." 
        />
        <FeatureCard 
          icon={<BarChart3 className="text-blue-500" />} 
          title="Match Scoring" 
          desc="Receive a real-time compatibility score to see how well you fit the role." 
        />
      </div>
    </div>
  );
}
