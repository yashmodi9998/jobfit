import PageHeader from "@/app/components/PageHeader";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function CandidateDashboard() {
  const { userId } = await auth();

  const myApplications = await prisma.application.findMany({
    where: { candidateId: userId as string },
    include: { job: true },
    orderBy: { appliedAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-zinc-50 text-black px-6 py-16">
      <div className="max-w-6xl mx-auto">
        
    <PageHeader 
          title="Workspace" 
          description="Tracking your active career paths and AI match scores."
        >
          <Link 
            href="/dashboard/candidate/find-job" 
            className="px-6 py-3 border-2 border-black font-black text-[10px] uppercase tracking-[0.2em] bg-white hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:scale-95"
          >
            Explore Marketplace
          </Link>
        </PageHeader>

        {/* Standard Summary Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <SummaryCard title="Applied Roles" value={myApplications.length} />
          <SummaryCard title="Avg. Match" value="92%" color="text-blue-900" />
          <SummaryCard title="In Review" value="03" color="text-emerald-700" />
        </div>

        {/* Section Heading - Unified font-black uppercase */}
        <div className="flex justify-between items-center border-b-4 border-black pb-4 pt-8">
          <h2 className="text-xl font-black uppercase tracking-tight">Your Pipeline</h2>
          <span className="text-[10px] font-black uppercase tracking-widest opacity-40 italic font-medium">
            Sorted by most recent application
          </span>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {myApplications.length === 0 ? (
            <div className="col-span-full py-24 border-2 border-black border-dashed rounded-[2rem] text-center bg-white/50">
              <p className="text-black font-bold uppercase tracking-widest opacity-30">Your pipeline is currently clear.</p>
            </div>
          ) : (
            myApplications.map((app) => (
              <div 
                key={app.id} 
                className="group bg-white border border-zinc-200 rounded-[2rem] p-8 flex flex-col justify-between min-h-[350px] transition-all duration-300 hover:border-black shadow-sm"
              >
                <div className="space-y-6">
                  <div className="space-y-1">
                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-900">
                      {app.job.company}
                    </p>
                    <h3 className="text-2xl font-black tracking-tight leading-tight group-hover:text-blue-900 transition-colors">
                      {app.job.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] font-bold text-black uppercase tracking-widest">
                    <span>{app.job.location}</span>
                    <span className="w-1 h-1 bg-black rounded-full opacity-20"></span>
                    <span>Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                  </div>

                  {app.aiScore && (
                    <div className="pt-2">
                      <p className="text-3xl font-black text-emerald-700 tracking-tighter leading-none">
                        {Math.round(app.aiScore)}%
                      </p>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mt-1">Match Confidence</p>
                    </div>
                  )}
                </div>

                {/* Unified Card Footer & Button */}
                <div className="mt-10 space-y-4 pt-8 border-t border-zinc-100">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40 font-medium">Status</span>
                    <span className="text-[10px] font-black uppercase px-3 py-1 border-2 border-black rounded-full bg-white">
                      {app.status}
                    </span>
                  </div>
                  <Link 
                    href={`#`} 
                    className="block w-full text-center py-4 border-2 border-black text-black font-bold rounded-xl hover:bg-black hover:text-white transition-all text-xs uppercase tracking-widest active:scale-95 shadow-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, color = "text-black" }: { title: string; value: string | number, color?: string }) {
  return (
    <div className="border border-zinc-200 rounded-[2rem] p-8 bg-white shadow-sm hover:border-black transition-colors duration-300">
      <p className="text-[10px] font-black text-black uppercase tracking-[0.3em] mb-2 opacity-40 font-medium italic">{title}</p>
      <p className={`text-5xl font-black tracking-tighter ${color}`}>{value}</p>
    </div>
  );
}