"use client";

import { useState, useTransition } from "react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { updateApplicationStatus } from "@/app/actions/updateApplicationStatus";

interface Props {
  applicationId: string;
  jobId: string;
  currentStatus: string;
}

export default function ApplicationStatusControls({ applicationId, jobId, currentStatus }: Props) {
  const [isPending, startTransition] = useTransition();
  const [optimisticStatus, setOptimisticStatus] = useState(currentStatus);

  const handleStatusUpdate = (status: "SHORTLISTED" | "REJECTED" | "PENDING") => {
    setOptimisticStatus(status);
    startTransition(async () => {
      try {
        await updateApplicationStatus(applicationId, status, jobId);
      } catch (error) {
        console.error("Failed to update status");
        setOptimisticStatus(currentStatus); // Revert on error
      }
    });
  };

  // CASE 1: ALREADY SHORTLISTED
  if (optimisticStatus === "SHORTLISTED") {
    return (
      <div className="bg-emerald-50 border-2 border-emerald-100 rounded-3xl p-8 text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="flex justify-center mb-3">
          <div className="p-3 bg-emerald-100 rounded-full">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
        <h3 className="text-emerald-900 font-black uppercase tracking-widest text-lg mb-1">
          Shortlisted
        </h3>
        <p className="text-emerald-700 text-xs font-bold mb-4 opacity-80">
          Candidate moved to next stage
        </p>
        
        {/* Undo Link */}
        <button 
           onClick={() => handleStatusUpdate("PENDING")}
           disabled={isPending}
           className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 hover:text-emerald-700 underline decoration-2 underline-offset-4 transition-colors"
        >
          {isPending ? "Updating..." : "Undo Decision"}
        </button>
      </div>
    );
  }

  // CASE 2: ALREADY REJECTED
  if (optimisticStatus === "REJECTED") {
    return (
      <div className="bg-red-50 border-2 border-red-100 rounded-3xl p-8 text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="flex justify-center mb-3">
          <div className="p-3 bg-red-100 rounded-full">
             <XCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <h3 className="text-red-900 font-black uppercase tracking-widest text-lg mb-1">
          Rejected
        </h3>
        <p className="text-red-700 text-xs font-bold mb-4 opacity-80">
          Application has been closed
        </p>
        
        {/* Undo Link */}
        <button 
           onClick={() => handleStatusUpdate("PENDING")}
           disabled={isPending}
           className="text-[10px] font-bold uppercase tracking-widest text-red-400 hover:text-red-700 underline decoration-2 underline-offset-4 transition-colors"
        >
           {isPending ? "Updating..." : "Undo Decision"}
        </button>
      </div>
    );
  }

  // CASE 3: PENDING (Show Action Buttons)
  return (
    <div className="grid grid-cols-1 gap-4">
      <button
        onClick={() => handleStatusUpdate("SHORTLISTED")}
        disabled={isPending}
        className="bg-emerald-600 text-white py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-200 transition-all active:scale-95 flex items-center justify-center gap-2"
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        Shortlist
      </button>

      <button
        onClick={() => handleStatusUpdate("REJECTED")}
        disabled={isPending}
        className="bg-white border-2 border-zinc-100 text-zinc-400 py-4 rounded-2xl font-bold uppercase tracking-widest hover:border-red-100 hover:bg-red-50 hover:text-red-600 transition-all active:scale-95 flex items-center justify-center gap-2"
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        Reject
      </button>
    </div>
  );
}