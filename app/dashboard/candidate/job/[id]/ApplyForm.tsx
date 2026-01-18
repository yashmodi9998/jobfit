"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { submitApplication } from "@/app/actions/apply";

export default function ApplyForm({ jobId, userId, companyName }: { jobId: string; userId: string; companyName: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState(""); // Simple state for the text
  const [loading, setLoading] = useState(false);

  const handleCloudUpload = async (selectedFile: File) => {
    const fileName = `${userId}-${jobId}-${Date.now()}.pdf`;
    const { data, error } = await supabase.storage
      .from("resumes")
      .upload(fileName, selectedFile);

    if (error) return null;

    const { data: { publicUrl } } = supabase.storage
      .from("resumes")
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Upload resume first");
    
    setLoading(true);

    try {
      const resumeUrl = await handleCloudUpload(file);
      if (!resumeUrl) throw new Error("Upload failed");

      // Use the 'note' state directly here instead of FormData
      await submitApplication(jobId, resumeUrl, note);
      
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 flex-grow">
      {/* 1. FILE UPLOAD SECTION */}
      <input
        type="file"
        id="resume-upload"
        className="hidden"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <label 
        htmlFor="resume-upload"
        className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-zinc-200 rounded-[2rem] text-center hover:border-black transition-all cursor-pointer bg-zinc-50 min-h-[160px] group"
      >
        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-black">
          {file ? `✓ ${file.name}` : "Upload Resume (PDF)"}
        </p>
      </label>

      {/* 2. NOTE SECTION (Now using value/onChange) */}
      <div className="space-y-3">
         <label className="text-[11px] font-black uppercase tracking-[0.3em] opacity-50 font-black">
           Introduction Note
         </label>
         <textarea 
          required
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full border-2 border-black rounded-2xl p-6 min-h-[200px] focus:outline-none focus:border-blue-900 font-medium"
          placeholder="Why are you the right fit?"
         />
      </div>

      <button 
        type="submit"
        disabled={loading || !file}
        className="w-full py-5 bg-emerald-700 text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-black transition-all active:scale-95 disabled:opacity-50"
      >
        {loading ? "Initializing..." : "Submit Application"}
      </button>
    </form>
  );
}