import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import PageHeader from "@/app/components/PageHeader";

export const dynamic = "force-dynamic";

export default async function Jobs() {
  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-zinc-50 text-black px-6 py-16">
      <div className="max-w-6xl mx-auto">
        
   
        <PageHeader 
          title="Marketplace" 
          description="Discover active listings and find your next role."
        >
          <div className="px-6 py-3 border-2 border-black font-black text-[10px] uppercase tracking-[0.2em] bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {jobs.length} Positions Available
          </div>
        </PageHeader>
        {/* Job Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {jobs.length === 0 ? (
            <div className="col-span-full bg-white border border-zinc-200 border-dashed rounded-[2rem] py-24 text-center">
              <p className="text-black font-bold uppercase tracking-widest opacity-40">No jobs available yet.</p>
            </div>
          ) : (
            jobs.map((job) => (
              <div 
                key={job.id} 
                className="group bg-white border border-zinc-200 rounded-[2rem] p-8 flex flex-col justify-between 
                           transition-colors duration-200 
                           hover:border-black ]"
              >
   
                <div className="space-y-6">
                  <div className="space-y-1">
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-900">
                      {job.company}
                    </p>
                    <h3 className="text-2xl font-black tracking-tight leading-tight group-hover:text-blue-900 transition-colors">
                      {job.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] font-bold text-black uppercase tracking-wider">
                    <span>{job.location}</span>
                    <span className="w-1 h-1 bg-black rounded-full opacity-20"></span>
                    <span className="bg-zinc-100 px-2 py-0.5 rounded-md text-black">{job.type}</span>
                  </div>

                  <p className="text-black text-sm font-normal leading-relaxed line-clamp-3 opacity-90">
                    {job.description}
                  </p>
                </div>

                <div className="flex items-center gap-10 mt-10 pt-8 border-t border-zinc-100 w-full justify-between">
                  <div className="text-left">
                    <p className="text-2xl font-black text-emerald-700 tracking-tighter">
                      {job.salary || "—"}
                    </p>
                    <p className="text-[10px] font-black text-black uppercase tracking-[0.2em] opacity-50">
                      Salary Range
                    </p>
                  </div>
                  
                  <Link 
                    href={`/dashboard/candidate/job/${job.id}`}
                    className="px-6 py-3 border-2 border-black text-black font-bold rounded-xl 
                               hover:bg-black hover:text-white transition-all text-xs uppercase tracking-widest active:scale-95"
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