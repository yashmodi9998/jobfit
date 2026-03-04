"use client";

import React, { useState, useRef } from 'react';
import { Briefcase, FileText, UploadCloud, CheckCircle2, Zap, Loader2, AlertCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Shadcn UI
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Server Actions & AI logic
import { parsePDF } from '@/actions/parsePDFAction';
import { generateReport } from '@/lib/ai';
import { saveReportAction } from '@/actions/saveReport';

export default function ReviewResume() {
  const [jobDescription, setJobDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(""); 
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const file = e.target.files?.[0];
    
    if (file && file.type === "application/pdf") {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("File too large. Please upload a PDF under 5MB.");
        return;
      }
      setSelectedFile(file);
    } else if (file) {
      setErrorMessage("Invalid file type. Please upload a PDF document.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !jobDescription || loading) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      // 1. Extract Text from PDF
      setLoadingStep("Extracting text from PDF...");
      const formData = new FormData();
      formData.append("resume", selectedFile);
      formData.append("jobDescription", jobDescription);

      const parseResult = await parsePDF(formData);

      // Type Guard: Ensures parseResult and its data are defined
      if (!parseResult || !parseResult.success || !parseResult.data) {
        throw new Error(parseResult?.error || "Failed to parse PDF content.");
      }

      // 2. AI Analysis via Gemini
      setLoadingStep("AI is analyzing alignment...");
      const aiResult = await generateReport({ 
        resume: parseResult.data.resumeText, 
        jobDescription: jobDescription 
      });

      if (!aiResult) {
        throw new Error("AI Analysis failed to generate a response.");
      }

      // 3. Save to MongoDB
      setLoadingStep("Saving results to your dashboard...");
      const saveResult = await saveReportAction({
        resume: parseResult.data.resumeText,
        jobDescription: jobDescription,
        technicalQuestions: aiResult.technicalQuestions,
        skillScore: aiResult.skillScore,
        matchPercentage: aiResult.matchingPercentage 
      });

      if (!saveResult.success || !saveResult.reportId) {
        throw new Error(saveResult.error || "Failed to save the report.");
      }

      // 4. Redirect to Results
      router.push(`/results/${saveResult.reportId}`);

    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "An unexpected error occurred.";
      setErrorMessage(msg);
      setLoading(false);
      setLoadingStep("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-12">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Resume Gap Analysis
          </h1>
          <p className="text-slate-500 text-lg">
            Compare your resume against any job description using AI.
          </p>
        </header>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
            <XCircle size={20} className="shrink-0" />
            <p className="text-sm font-semibold">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className={`overflow-hidden border-slate-200 shadow-xl transition-all ${loading ? 'opacity-60 pointer-events-none' : ''}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
              
              {/* Left Side: Job Description */}
              <div className="p-8 space-y-4">
                <div className="flex items-center gap-2 text-blue-600 font-semibold">
                  <Briefcase size={20} />
                  <h2 className="uppercase tracking-wide text-sm">Job Description</h2>
                </div>
                <textarea
                  className="w-full h-[400px] p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none text-sm leading-relaxed"
                  placeholder="Paste the full job posting details here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  required
                />
              </div>

              {/* Right Side: Resume Upload */}
              <div className="p-8 flex flex-col space-y-4">
                <div className="flex items-center gap-2 text-purple-600 font-semibold">
                  <FileText size={20} />
                  <h2 className="uppercase tracking-wide text-sm">Your Resume (PDF)</h2>
                </div>

                <div 
                  onClick={() => !loading && fileInputRef.current?.click()}
                  className={`flex-grow border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 transition-all cursor-pointer group
                    ${selectedFile ? 'border-emerald-400 bg-emerald-50/50' : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50/50'}`}
                >
                  <input type="file" ref={fileInputRef} hidden accept=".pdf" onChange={handleFileChange} />
                  
                  {selectedFile ? (
                    <div className="text-center space-y-3">
                      <div className="p-3 bg-white rounded-full shadow-sm mx-auto w-fit">
                        <CheckCircle2 size={32} className="text-emerald-500" />
                      </div>
                      <p className="font-bold text-slate-700 truncate max-w-[200px]">{selectedFile.name}</p>
                      <Button variant="outline" size="sm" type="button" className="bg-white">Change File</Button>
                    </div>
                  ) : (
                    <div className="text-center space-y-3">
                      <div className="p-4 bg-white rounded-full shadow-sm mx-auto w-fit group-hover:scale-110 transition-transform">
                        <UploadCloud size={32} className="text-slate-400 group-hover:text-blue-500" />
                      </div>
                      <p className="text-sm font-bold text-slate-600">Click to upload your resume</p>
                      <p className="text-xs text-slate-400 uppercase tracking-tighter">Maximum size 5MB</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-slate-50 p-6 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-slate-500 text-sm italic">
                <AlertCircle size={16} />
                <span>AI analysis usually completes in under 15 seconds.</span>
              </div>
              
              <Button 
                type="submit" 
                size="lg" 
                className="w-full md:w-auto px-16 h-12 font-bold shadow-lg shadow-blue-200 bg-blue-600 hover:bg-blue-700 transition-all active:scale-95"
                disabled={!selectedFile || !jobDescription || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {loadingStep}
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-5 w-5 fill-current" />
                    Analyze Resume
                  </>
                )}
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
}