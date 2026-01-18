import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import PageHeader from "@/app/components/PageHeader";
import Link from "next/link";
import App from "next/app";
import ApplyForm from "./ApplyForm";

export default async function JobDetailsPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { userId } = await auth();
  const { id } = await params;

  const job = await prisma.job.findUnique({
    where: { id },
  });

  if (!job) notFound();

  return (
    <div className="min-h-screen bg-zinc-50 text-black px-6 py-16">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <Link 
          href="/dashboard/candidate/find-job" 
          className="text-[10px] font-black uppercase tracking-[0.2em] text-black hover:text-blue-900 transition-all mb-12 inline-block border-b-2 border-black"
        >
          ← Back to Search
        </Link>

        {/* Reusable Header */}
        <PageHeader 
          title={job.title} 
          description={`${job.company} • ${job.location} • ${job.type}`}
        >
          <div className="px-8 py-4 border-2 border-black font-black text-emerald-700 bg-white rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {job.salary || "Competitive Pay"}
          </div>
        </PageHeader>

        {/* The 2-Box Grid Layout (Side-by-Side) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mt-12">
  
          {/* BOX 1: POSITION INFO */}
          <section className="bg-white border border-zinc-200 rounded-[2.5rem] p-12 shadow-sm flex flex-col">
     <h2 className="text-3xl font-black uppercase tracking-tight border-b-4 border-black pb-4 mb-10">
                Position Info
              </h2>
              
              <div className="space-y-12 flex-grow">
                {/* Role Description */}
                <div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.4em] mb-4 text-blue-900">
                    Role Description
                  </h3>
                  <div className="text-black text-lg font-normal leading-relaxed whitespace-pre-line opacity-90">
                    {job.description}
                  </div>
                </div>

                {/* Key Requirements */}
                {job.requirements && (
                  <div className="pt-10 border-t border-zinc-100">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] mb-4 text-blue-900">
                      Key Requirements
                    </h3>
                    <div className="text-black text-lg font-normal leading-relaxed whitespace-pre-line opacity-90">
                      {job.requirements}
                    </div>
                  </div>
                )}
              </div>
            </section>
          {/* </div> */}

          {/* BOX 2: INITIALIZE TRACK */}
           <section className="bg-white border border-zinc-200 rounded-[2.5rem] p-12 shadow-sm flex flex-col">
    <h2 className="text-3xl font-black uppercase tracking-tight border-b-4 border-black pb-4 mb-10">
                Initialize Track
              </h2>
              
              
               <ApplyForm jobId={job.id} userId={userId || ""} companyName={job.company} />
            </section>
          {/* </div> */}

        </div>
      </div>
    </div>
  );
}