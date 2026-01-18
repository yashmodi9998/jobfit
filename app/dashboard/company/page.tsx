import PageHeader from "@/app/components/PageHeader";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CompanyDashboard() {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  // Protect the route
  if (role !== "COMPANY") redirect("/");

  const myJobs = await prisma.job.findMany({
    where: { postedById: userId as string },
    include: {
      _count: { select: { applications: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
  <div className="min-h-screen bg-zinc-50 text-black px-6 py-16">
      <div className="max-w-6xl mx-auto">
        
        <PageHeader 
          title="Company Dashboard" 
          description="Manage your job listings and track applicants."
        > 
          <Link 
            href="/dashboard/company/jobs/post-job" 
            className="px-6 py-3 border-2 border-black font-black text-[10px] uppercase tracking-[0.2em] bg-white hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:scale-95"
          >
            Post New Job
          </Link>
        </PageHeader>  


        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard label="Active Listings" value={myJobs.length} />
          <StatCard 
            label="Total Applicants" 
            value={myJobs.reduce((acc, job) => acc + job._count.applications, 0)} 
          />
          <StatCard label="Hired" value="0" />
        </div>

        {/* Job Listings Area */}
        <div className="space-y-6">
          <h2 className="text-sm font-bold text-black uppercase tracking-widest ml-1">
            Your Active Jobs
          </h2>
          
          {myJobs.length === 0 ? (
            <div className="bg-white border border-zinc-200 border-dashed rounded-3xl py-20 text-center">
              <p className="text-zinc-400 font-medium">No jobs posted yet.</p>
            </div>
          ) : (
            myJobs.map((job) => (
              <div 
                key={job.id} 
                className="group bg-white border border-zinc-200 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center transition-all hover:border-black shadow-sm"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-black uppercase tracking-tight">{job.title}</h3>
                  <div className="flex items-center gap-4 text-sm font-bold text-zinc-500">
                    <span className="uppercase">{job.location}</span>
                    <span className="w-1 h-1 bg-zinc-300 rounded-full"></span>
                    <span className="text-black uppercase tracking-wider">{job.type}</span>
                  </div>
                </div>

                <div className="flex items-center gap-10 mt-6 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-left md:text-center">
                    <p className="text-3xl font-black">{job._count.applications}</p>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Applicants</p>
                  </div>
                  <Link 
                    href={`/dashboard/company/jobs/${job.id}`}
                    className="px-6 py-3 border-2 border-black text-black font-bold rounded-xl hover:bg-black hover:text-white transition-all text-sm uppercase tracking-widest"
                  >
                    Manage
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

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white border border-zinc-200 p-8 rounded-3xl shadow-sm">
      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-1">{label}</p>
      <p className="text-4xl font-black tracking-tighter">{value}</p>
    </div>
  );
}