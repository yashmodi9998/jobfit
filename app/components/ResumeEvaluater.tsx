"use client";

import { useState } from "react";
import { calculateMatch } from "../actions/resumeanalyze";

type MatchResult = {
  score: number;
  verdict: string;
  strengths: string[];
  gaps: string[];
};

export default function ResumeEvaluator() {
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [result, setResult] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    try {
      setLoading(true);
      const data = await calculateMatch(resumeText, jdText);
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-16 px-6">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Resume Match Analyzer</h1>
        <p className="text-zinc-500 text-lg">
          Compare your resume against a job description and see how well they align.
        </p>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-sm text-zinc-600">
            Resume
          </label>
          <textarea
            className="h-[420px] rounded-xl border border-zinc-300 p-6 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            placeholder="Paste your resume here..."
            onChange={(e) => setResumeText(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-sm text-zinc-600">
            Job Description
          </label>
          <textarea
            className="h-[420px] rounded-xl border border-zinc-300 p-6 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            placeholder="Paste the job description here..."
            onChange={(e) => setJdText(e.target.value)}
          />
        </div>
      </div>

      {/* Action */}
      <button
        onClick={handleAnalyze}
        disabled={loading || !resumeText || !jdText}
        className="w-full rounded-xl bg-emerald-600 py-5 text-xl font-semibold text-white hover:bg-emerald-700 disabled:bg-zinc-300 disabled:cursor-not-allowed transition"
      >
        {loading ? "Analyzing..." : "Analyze Match"}
      </button>

   {/* Results */}
{result && (
  <div className="mt-16 space-y-12">
  {/* Score */}
    <div className="rounded-2xl border border-black/15 p-10 bg-white shadow-sm">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="text-7xl font-bold text-emerald-600">
          {result.score}%
        </div>
        <div>
          <p className="text-black font-bold text-xl mb-1">Verdict</p>
          <h2 className="text-sm text-black">{result.verdict}</h2>
        </div>
      </div>
    </div>

    {/* Details */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Strengths */}
      <div className="rounded-2xl border border-black p-8 bg-white">
        <h3 className="text-xl font-bold mb-6 text-emerald-600">
          Strengths
        </h3>
        <ul className="space-y-4 text-black">
          {result.strengths.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Weak / Missing Areas */}
      <div className="rounded-2xl border border-black p-8 bg-white">
        <h3 className="text-xl font-bold mb-6 text-red-600">
          Missing / Weak Areas
        </h3>
        <ul className="space-y-4 text-black">
          {result.gaps.map((g, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-red-600 font-bold">x</span>
              <span>{g}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
