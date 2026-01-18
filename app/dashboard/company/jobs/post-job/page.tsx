"use client";

import { createJobs } from "@/app/actions/jobactions";
import { useFormStatus } from "react-dom";
import { useState } from "react";
import PageHeader from "@/app/components/PageHeader";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-4 bg-black text-white font-bold rounded-xl
                 hover:bg-zinc-800 transition-all active:scale-[0.99]
                 disabled:opacity-50 disabled:cursor-not-allowed
                 shadow-lg shadow-black/10 mt-4"
    >
      {pending ? "Publishing…" : "Publish Job"}
    </button>
  );
}

export default function PostJobPage() {
  const [selectedType, setSelectedType] = useState("Full-time");

  return (
    <div className="min-h-screen bg-zinc-50 text-black px-6 py-16">
      <div className="max-w-6xl mx-auto">
        
    <PageHeader 
          title="Post a New Job" 
          description="Create a new job listing to attract top talent."
        />

        <form
          action={createJobs}
          className="bg-white border border-zinc-200 rounded-3xl p-8 md:p-12 shadow-sm space-y-10"
        >
          {/* Top Row: Title & Company */}
          <div className="grid md:grid-cols-2 gap-8">
            <FormField label="Job title">
              <input name="title" required placeholder="Software Engineer" />
            </FormField>

            <FormField label="Company">
              <input name="company" required placeholder="Your company name" />
            </FormField>
          </div>

          {/* Middle Row: Location & Salary */}
          <div className="grid md:grid-cols-2 gap-8">
            <FormField label="Location">
              <input name="location" required placeholder="Remote / Toronto" />
            </FormField>

            <FormField label="Salary range">
              <input name="salary" placeholder="$100k – $130k" />
            </FormField>
          </div>

          {/* Dedicated Section: Job Type (Enhanced UI) */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-black uppercase tracking-widest">
              Job Type
            </label>
            <div className="grid grid-cols-3 gap-3 p-1.5 bg-zinc-100 rounded-2xl border border-zinc-200">
              {["Full-time", "Part-time", "Contract"].map((type) => (
                <label
                  key={type}
                  className={`
                    flex flex-col items-center justify-center py-3 rounded-xl cursor-pointer transition-all font-bold text-sm
                    ${selectedType === type 
                      ? "bg-white text-black shadow-sm ring-1 ring-zinc-200" 
                      : "text-zinc-500 hover:text-black hover:bg-zinc-50"}
                  `}
                >
                  <input
                    type="radio"
                    name="type"
                    value={type}
                    className="hidden"
                    checked={selectedType === type}
                    onChange={() => setSelectedType(type)}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          {/* Full Width Fields */}
          <div className="space-y-8">
            <FormField label="Job description">
              <textarea
                name="description"
                rows={6}
                required
                placeholder="Describe the role and responsibilities in detail..."
              />
            </FormField>

            <FormField label="Requirements">
              <textarea
                name="requirements"
                rows={4}
                required
                placeholder="Skills, experience, and qualifications..."
              />
            </FormField>
          </div>

          <SubmitButton />
        </form>
      </div>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2 w-full">
      <label className="text-sm font-bold text-black uppercase tracking-widest">
        {label}
      </label>
      <div
        className=" [&_input]:w-full [&_textarea]:w-full 
                     [&_input]:rounded-xl [&_textarea]:rounded-xl 
                     [&_input]:bg-white [&_textarea]:bg-white 
                     [&_input]:border [&_textarea]:border 
                     [&_input]:border-zinc-300 [&_textarea]:border-zinc-300 
                     [&_input]:px-4 [&_textarea]:px-4 
                     [&_input]:py-4 [&_textarea]:py-4 
                     [&_input]:text-black [&_textarea]:text-black 
                     [&_input]:font-medium [&_textarea]:font-medium 
                     [&_input]:placeholder:text-zinc-400 [&_textarea]:placeholder:text-zinc-400
                     focus-within:[&_input]:border-black
                     focus-within:[&_textarea]:border-black
                     focus-within:[&_input]:ring-1
                     focus-within:[&_input]:ring-black
                     focus-within:[&_input]:outline-none"
      >
        {children}
      </div>
    </div>
  );
}