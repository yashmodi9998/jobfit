import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/app/components/PageHeader";

export default async function CompanyJobView({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { userId } = await auth();
  const { id } = await params;

  const job = await prisma.job.findUnique({
    where: { id: id },
    include: {
      applications: {
        include: {
          candidate: true, 
        },
        orderBy: { aiScore: 'desc' }, 
      },
    },
  });

  if (!job) notFound();
  if (job.postedById !== userId) redirect("/dashboard/company");

  return (
     <div className="min-h-screen bg-zinc-50 text-black px-6 py-16">
      <div className="max-w-6xl mx-auto">
        
    

        {/* Integrated Reusable Page Header */}
        <PageHeader 
          title={job.title} 
          description={`Monitoring the pipeline for this position. Currently reviewing ${job.applications.length} candidates.`}
        >
          <div className="flex gap-3">
            <button className="px-6 py-3 border-2 border-black font-black bg-white text-black rounded-xl hover:bg-black hover:text-white transition-all text-xs uppercase tracking-widest active:scale-95 shadow-sm">
              Edit Role
            </button>
            <button className="px-6 py-3 bg-white border-2 border-red-600 text-red-600 font-black rounded-xl hover:bg-red-600 hover:text-white transition-all text-xs uppercase tracking-widest active:scale-95 shadow-sm">
              Close Listing
            </button>
          </div>
        </PageHeader>

        {/* Pipeline Section */}
        <div className="space-y-8">
          <div className="flex justify-between items-center border-b-4 border-black pb-4">
             <h2 className="text-xl font-black uppercase tracking-tight">
              Candidate Pipeline
            </h2>
            <span className="text-[10px] font-black uppercase px-3 py-1 bg-black text-white rounded-md">
              {job.status}
            </span>
          </div>

          {job.applications.length === 0 ? (
            <div className="bg-white border-2 border-black border-dashed rounded-[2rem] py-24 text-center">
              <p className="text-black font-bold uppercase tracking-widest opacity-40 italic">No one has applied yet</p>
            </div>
          ) : (
            <div className="bg-white border border-zinc-200 rounded-[2rem] overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-black bg-white">
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">Candidate</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">AI Match</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y border-t-0 border-zinc-100">
                  {job.applications.map((app) => (
                    <tr key={app.id} className="group hover:bg-zinc-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <p className="font-black uppercase text-xl leading-none group-hover:text-blue-900 transition-colors">
                          {app.candidate.name || "Anonymous Candidate"}
                        </p>
                        <p className="text-[10px] text-black font-bold mt-2 uppercase opacity-50">
                          {app.candidate.email}
                        </p>
                      </td>
                      <td className="px-8 py-6">
                        {/* Navy Blue for High Scores, Emerald for others if preferred */}
                        <span className={`text-3xl font-black tracking-tighter ${app.aiScore && app.aiScore > 80 ? 'text-blue-900' : 'text-black'}`}>
                          {app.aiScore ? `${Math.round(app.aiScore)}%` : '—'}
                        </span>
                        <p className="text-[9px] font-black uppercase opacity-40">Match Score</p>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Link 
                          href={`/dashboard/company/application/${app.id}`}
                          className="inline-block px-8 py-3 border-2 border-black text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-black hover:text-white transition-all active:scale-95 shadow-sm"
                        >
                          Review Track
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}