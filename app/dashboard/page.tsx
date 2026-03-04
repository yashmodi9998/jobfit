import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardSidebar from "../components/DashboardSidebar";
import Link from "next/link";
import dbConnect from "@/lib/dbConfig";
import { ArrowRight, Zap, History } from "lucide-react";

// Shadcn UI Imports
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Report from "../model/reportModel";

export default async function DashboardPage() {
  // Check if user is authenticated
  const session = await auth();

  if (!session || !session.user?.id) {
    redirect("/login");
  }
// Fetch user's reports from the database
  await dbConnect();
  const reports = await Report.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="min-h-screen bg-slate-50/50 flex">
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6">
       
        <DashboardSidebar />
        
        </div>
        <div className="p-4 border-t">
          <form action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}>
            <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
              Logout
            </Button>
          </form>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
            <p className="text-slate-500">Welcome back, {session.user?.name}</p>
          </div>
          <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
            <AvatarImage src={session.user?.image || ""} />
            <AvatarFallback className="bg-blue-600 text-white font-bold">
              {session.user?.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </header>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Account Email</CardDescription>
              <CardTitle className="text-lg truncate">{session.user?.email}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Reports</CardDescription>
              <CardTitle className="text-2xl text-blue-600">{reports.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Account Status</CardDescription>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Reports History */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <History size={20} className="text-slate-400" />
              Recent Analyses
            </h3>
            <Button asChild variant="outline" size="sm">
              <Link href="/reviewresume">New Analysis</Link>
            </Button>
          </div>

          {reports.length > 0 ? (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Date</TableHead>
                    <TableHead>Match Score</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report._id.toString()}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                          <span className="text-xs text-slate-400 font-normal">
                             {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={report.matchPercentage >= 75 ? "default" : "secondary"} className={report.matchPercentage >= 75 ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : ""}>
                          {report.matchPercentage}% Match
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/results/${report._id}`} className="gap-2">
                            View <ArrowRight size={14} />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          ) : (
            <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
              <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <Zap size={32} />
              </div>
              <CardTitle className="mb-2">No Reports Yet</CardTitle>
              <CardDescription className="mb-6">
                Upload your resume to get your first AI-powered analysis.
              </CardDescription>
              <Button asChild>
                <Link href="/reviewresume">Get Started</Link>
              </Button>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}