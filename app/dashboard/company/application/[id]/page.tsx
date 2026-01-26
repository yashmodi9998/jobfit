import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Calendar, Download, ExternalLink } from "lucide-react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import ApplicationStatusControls from "./ApplicationStatus";
import ApplicationDocumentViewer from "./ApplicationDocumentViewer";

export default async function ApplicationProfilePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const { userId } = await auth();

  const application = await prisma.application.findUnique({
    where: { id },
    include: {
      candidate: true,
      job: true
    }
  });

  if (!application) return notFound();
  if (application.job.postedById !== userId) {
    return <div className="p-12 font-bold text-red-600">Unauthorized</div>;
  }

  const score = Math.round(application.aiScore || 0);
  let verdict = "Pending Review";
  if (score >= 85) verdict = "High Match";
  else if (score >= 60) verdict = "Potential Fit";
  else if (score > 0) verdict = "Low Match";

  return (
   <div className="min-h-screen bg-zinc-50 text-black px-6 py-16">
      <div className="max-w-6xl mx-auto">

    

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* LEFT COLUMN */}
          <div className="space-y-6 sticky top-8">

            {/* Candidate Card */}
            <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
              <span className="inline-block mb-4 text-xs font-bold uppercase tracking-widest text-blue-800">
                Application ID · {application.id.slice(-6)}
              </span>

              <h1 className="text-4xl font-black tracking-tight">
                {application.candidate.name || "Unknown Candidate"}
              </h1>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-blue-800" />
                  <span className="font-medium">{application.candidate.email}</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-500">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Applied on {new Date(application.appliedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* AI Score */}
            <div className="bg-white border border-zinc-200 rounded-3xl p-10 text-center shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">
                AI Match Score
              </p>

              <div
                className={`text-7xl font-black tracking-tight ${
                  score >= 75 ? "text-emerald-600" : "text-blue-900"
                }`}
              >
                {score}%
              </div>

              <div className="mt-4 inline-block px-4 py-2 rounded-xl bg-blue-900 text-white text-xs font-bold uppercase tracking-widest">
                {verdict}
              </div>
            </div>

            {/* Actions */}

            <ApplicationStatusControls 
              applicationId={application.id} 
              jobId={application.jobId}
              currentStatus={application.status}
            />
          </div>

          {/* RIGHT COLUMN */}
        <div className="lg:col-span-2">
             <ApplicationDocumentViewer 
                resumeUrl={application.resumeUrl}
                coverLetter={application.coverLetter}
             />
          </div>

        </div>
      </div>
    </div>
  );
}