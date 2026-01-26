"use client";

import { useState } from "react";
import { Download, ExternalLink, FileText, AlignLeft } from "lucide-react";

interface Props {
  resumeUrl: string;
  coverLetter: string | null;
}

export default function ApplicationDocumentViewer({ resumeUrl, coverLetter }: Props) {
  const [activeTab, setActiveTab] = useState<"resume" | "letter">("resume");

  return (
    // UPDATED: Added h-[800px] to force the large preview size matching earlier designs
    <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm flex flex-col h-[800px]">
      
      {/* 1. HEADER & TABS */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50 shrink-0">
        
        {/* Toggle Switch */}
        <div className="flex p-1 bg-zinc-200/50 rounded-xl">
          <button
            onClick={() => setActiveTab("resume")}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all
              ${activeTab === "resume" 
                ? "bg-white text-blue-900 shadow-sm" 
                : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200/50"
              }
            `}
          >
            <FileText className="w-3 h-3" />
            Resume
          </button>

          {coverLetter && (
            <button
              onClick={() => setActiveTab("letter")}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all
                ${activeTab === "letter" 
                  ? "bg-white text-blue-900 shadow-sm" 
                  : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200/50"
                }
              `}
            >
              <AlignLeft className="w-3 h-3" />
              Cover Letter
            </button>
          )}
        </div>

        {/* Tools */}
        <div className="flex items-center gap-3">
          {activeTab === "resume" && (
            <>
              <a
                href={resumeUrl}
                download
                className="text-blue-900 hover:opacity-70 transition p-2"
                title="Download PDF"
              >
                <Download className="w-4 h-4" />
              </a>
              <div className="w-px h-4 bg-zinc-300"></div>
              <a
                href={resumeUrl}
                target="_blank"
                className="text-xs font-bold uppercase tracking-widest text-blue-900 hover:underline flex items-center gap-1"
              >
                Open Tab
                <ExternalLink className="w-3 h-3" />
              </a>
            </>
          )}
        </div>
      </div>

      {/* 2. CONTENT AREA */}
      <div className="flex-1 bg-white relative group min-h-0">
        
        {activeTab === "resume" ? (
          // PDF IFRAME (Fills the remaining height)
          <iframe
            src={`${resumeUrl}#toolbar=0`} 
            className="w-full h-full bg-zinc-100 border-none"
            title="Resume Preview"
          />
        ) : (
          // COVER LETTER (Scrollable if text is long)
          <div className="absolute inset-0 overflow-y-auto bg-zinc-50/30 p-8 md:p-12">
            <div className="max-w-2xl mx-auto bg-white p-10 shadow-sm border border-zinc-100 rounded-xl min-h-full">
               <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6 border-b border-zinc-100 pb-4">
                 Candidate Notes
               </h3>
               <div className="prose prose-zinc prose-sm max-w-none text-zinc-700 leading-relaxed whitespace-pre-wrap font-serif">
                 {coverLetter}
               </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}