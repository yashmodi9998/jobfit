import { currentUser } from "@clerk/nextjs/server";

import ResumeEvaluater from "./components/ResumeEvaluater";

export default async function Home() {
  const user = await currentUser();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-6xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white">
            Job Fit.
          </h1>
          {user && (
            <p className="mt-2 font-bold text-emerald-600 uppercase tracking-widest text-xs">
              Welcome back, {user.firstName}
            </p>
          )}
        </header>

        {/* This is the Client Component we built in the previous step */}
        <ResumeEvaluater />
      </div>
    </div>
  );
}