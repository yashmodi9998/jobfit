import { currentUser } from "@clerk/nextjs/server";
export default async function Home() {
  const user = await currentUser(); 

// console.log(user);
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Welcome to Job Fit
        </h1>
        {user ? (
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
            Hello, {user.firstName || "User"}!
          </p>
        ) : (
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
            Please sign in to continue.
            {/* <SignupPage /> */}
          </p>
        )}
      </div>
    </div>
  );
}
