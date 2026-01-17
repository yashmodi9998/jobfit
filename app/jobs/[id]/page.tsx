export const dynamic = "force-dynamic";

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string | null;
  description: string;
  requirements: string;
  createdAt: string;
  postedBy: {
    id: string;
    name: string | null;
    email: string;
  };
};

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/jobs/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <h1 className="text-xl font-semibold text-gray-600">
          Job not found
        </h1>
      </div>
    );
  }

  const job: Job = await res.json();

  return (
    <div className="bg-zinc-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* LEFT: Main Content */}
        <div className="md:col-span-2 bg-white rounded-2xl border p-8 space-y-8">
          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {job.title}
            </h1>
            <p className="text-gray-600 mt-2">
              {job.company} • {job.location} • {job.type}
            </p>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold mb-2 text-gray-900">
              About the Role
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* Requirements */}
          <div>
            <h2 className="text-lg font-semibold mb-2 text-gray-900">
              Requirements
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {job.requirements}
            </p>
          </div>
        </div>

        {/* RIGHT: Sticky Apply Card */}
        <div className="bg-white rounded-2xl border p-6 h-fit sticky top-24 space-y-6">
          <div>
            <p className="text-sm text-gray-500">Salary</p>
            <p className="text-lg font-semibold text-green-600">
              {job.salary || "Not disclosed"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Posted By</p>
            <p className="font-medium text-gray-900">
              {job.postedBy.name || "Company"}
            </p>
            <p className="text-sm text-gray-500">
              {job.postedBy.email}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Posted On</p>
            <p className="text-sm text-gray-700">
              {new Date(job.createdAt).toLocaleDateString()}
            </p>
          </div>

          <button className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition">
            Apply Now
          </button>
        </div>

      </div>
    </div>
  );
}
