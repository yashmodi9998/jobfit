"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Download, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResumePDF } from "./ResumePDF";
import { ReportData } from "@/types/report-types";
// Dynamically import PDFDownloadLink to avoid SSR issues with @react-pdf/renderer
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);
// The DownloadResumeBtn component is responsible for rendering a button that 
// allows users to download their optimized resume as a PDF.
export function DownloadResumeBtn({ reportData }: { reportData: ReportData }) {
  const [mounted, setMounted] = useState(false);
// We use useEffect to set the mounted state to true after the component has been rendered on the client side.
  useEffect(() => {
    // requestAnimationFrame ensures this happens AFTER the initial render
    // which silences the "cascading renders" warning.
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!mounted) return null;

  // Check if the actual content inside revisedResume is missing
  const hasData = reportData?.revisedResume && Object.keys(reportData.revisedResume).length > 0;

  if (!hasData) {
    return (
      <div className="p-4 border border-amber-200 bg-amber-50 rounded-xl text-amber-700 flex items-center gap-3">
        <AlertCircle size={20} />
        <p className="text-sm">Please try running the analysis again.</p>
      </div>
    );
  }

  return (
    <div className="bg-blue-600 p-6 rounded-2xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="text-white">
        <h3 className="text-lg font-bold">Optimized Resume Ready</h3>
        <p className="text-blue-100 text-sm">Your JD-tailored resume is ready for download.</p>
      </div>
{/*  PDFDownloadLink is used to generate a downloadable PDF of the optimized resume. */}
      <PDFDownloadLink
        document={<ResumePDF data={reportData.revisedResume} />}
        fileName={`${reportData.revisedResume.fullName?.replace(/\s/g, '_') || 'Optimized'}_Resume.pdf`}
      >
        {({ loading }) => (
          <Button 
            size="lg" 
            variant="secondary" 
            className="font-bold bg-white text-blue-600"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : <><Download className="mr-2 h-5 w-5" /> Download PDF</>}
          </Button>
        )}
      </PDFDownloadLink>
    </div>
  );
}