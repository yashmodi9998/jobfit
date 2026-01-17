import { auth, currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import CreateNewJobModal from "../components/CreateNewJobModal";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string | null;
  description: string;
  createdAt: string;
};

export default async function Jobs() {
 const jobs = await prisma.job.findMany({
    orderBy: { createdAt: 'desc' }, // If you want to filter by status
  });


const { sessionClaims } = await auth();
const userRole = (sessionClaims?.metadata as { role?: string })?.role || null;
  return (
    <div className="bg-zinc-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-6 space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Browse Jobs
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Find your next opportunity
            </p>
          </div>

          <span className="text-sm text-gray-600">
            {jobs.length} jobs available
          </span>
      
        {/*  add new JOB by  */}
        {userRole === "COMPANY" && (
             <CreateNewJobModal />
             )}
              </div>
        {/* Empty State */}
        {jobs.length === 0 && (
          <div className="bg-white border rounded-2xl p-12 text-center text-gray-500">
            No approved jobs yet. Check back soon.
          </div>
        )}

        {/* Job Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white border rounded-2xl p-6 hover:shadow-lg transition flex flex-col justify-between"
            >
              {/* Job Info */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {job.title}
                </h2>

                <p className="text-gray-600 text-sm mt-1">
                  {job.company} • {job.location} • {job.type}
                </p>

                {job.salary && (
                  <p className="mt-3 text-green-600 font-medium">
                    {job.salary}
                  </p>
                )}

                <p className="mt-4 text-gray-700 text-sm line-clamp-3">
                  {job.description}
                </p>
              </div>

              {/* Footer */}
              <div className="mt-6 flex items-center justify-between text-sm">
                <a
                  href={`/jobs/${job.id}`}
                  className="text-blue-600 font-medium hover:underline"
                >
                  View Details →
                </a>

                <span className="text-gray-400">
                  {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
