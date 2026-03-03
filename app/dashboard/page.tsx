import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardSidebar from "../components/DashboardSidebar";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 1. Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6">
          <h2 className="text-xl font-bold text-blue-600 italic">FitJob</h2>
        </div>
     <DashboardSidebar />
        <div className="p-4 border-t">
          <form action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}>
            <button className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition">
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* 2. Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">User Dashboard</h1>
            <p className="text-gray-500 text-sm">Welcome back, {session.user?.name}</p>
          </div>
          <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            {session.user?.name?.charAt(0) || "U"}
          </div>
        </header>

        {/* 3. Stats/Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Account Email</p>
            <p className="text-lg font-semibold text-gray-800 truncate">{session.user?.email}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Status</p>
            <p className="text-lg font-semibold text-green-600">Active</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Joined</p>
            <p className="text-lg font-semibold text-gray-800">March 2024</p>
          </div>
        </div>

        {/* 4. Placeholder Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-64 flex flex-col items-center justify-center text-center p-6">
          <div className="bg-blue-50 p-4 rounded-full mb-4">
            🚀
          </div>
          <h3 className="text-gray-800 font-medium">Ready to start your journey?</h3>
          <p className="text-gray-500 text-sm mb-4">Explore your dashboard features and optimize your routine.</p>
        </div>
      </main>
    </div>
  );
}