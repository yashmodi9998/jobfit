import { notFound, redirect } from "next/navigation";
import { AlertTriangle , HelpCircle, Zap, FileText, Briefcase } from "lucide-react";
import dbConnect from "@/lib/dbConfig";
import Report from "../../model/reportModel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth";

type Params = Promise<{ id: string }>;

interface ReportType {
  _id: string;
  userId: string;
  jobDescription: string;
  resume: string;
  technicalQuestions: {
    question: string;
    answer: string;
    intention: string;
  }[];
  skillScore: {
    skillGap: string;
    skillGapSeverity: "low" | "medium" | "high";
  }[];
  matchPercentage: number;
}
export default async function ResultsPage(props: { params: Params }) {
// Extract the report ID from the route parameters, ensuring we have the correct type
const { id } = await props.params;
// Protect this route to ensure only authenticated users can access it
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }
// Fetch the report from the database
  await dbConnect();
  // Use the Report model to find the report by its ID and convert it to a plain JavaScript object with .lean() for better performance
  const report = await Report.findById(id).lean();
// If no report is found with the given ID, we return a 404 Not Found response using Next.js's notFound() helper function
  if (!report) return notFound();

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-12">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* 1. Match Header */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center animate-in fade-in zoom-in duration-500">
          <h1 className="text-sm font-bold text-blue-600 uppercase tracking-[0.2em] mb-2">Analysis Complete</h1>
          <div className="mt-4 text-8xl font-black text-slate-900">
            {report.matchPercentage}<span className="text-blue-600">%</span>
          </div>
          <p className="text-slate-500 mt-2 text-lg font-medium">Alignment Score</p>
        </div>

        {/* 2. Original Context (JD & Resume) Section */}
        <section className="animate-in slide-in-from-bottom-2 fade-in duration-600">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FileText className="text-slate-400" size={20} /> Input Context
          </h2>
          <Tabs defaultValue="resume" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-200/50">
              <TabsTrigger value="resume" className="gap-2">
                <FileText size={14} /> My Resume
              </TabsTrigger>
              <TabsTrigger value="jd" className="gap-2">
                <Briefcase size={14} /> Job Description
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="resume">
              <Card className="border-slate-200 shadow-none">
                <CardContent className="pt-6">
                  <ScrollArea className="h-[250px] w-full rounded-md border p-4 bg-slate-50/50">
                    <pre className="text-xs leading-relaxed text-slate-600 whitespace-pre-wrap font-sans">
                      {report.resume}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="jd">
              <Card className="border-slate-200 shadow-none">
                <CardContent className="pt-6">
                  <ScrollArea className="h-[250px] w-full rounded-md border p-4 bg-slate-50/50">
                    <pre className="text-xs leading-relaxed text-slate-600 whitespace-pre-wrap font-sans">
                      {report.jobDescription}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* 3. Skill Gaps */}
        <section className="animate-in slide-in-from-bottom-4 fade-in duration-700">
          <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="text-amber-500" /> Skill Gaps & Improvements
          </h2>
          <div className="grid gap-4">
            {report.skillScore?.map((skill: ReportType['skillScore'][0], i: number) => (
              <div key={i} className="bg-white p-4 rounded-xl border-l-4 border-l-amber-500 shadow-sm flex justify-between items-center transition-transform hover:scale-[1.01]">
                <span className="font-semibold text-slate-700">{skill.skillGap}</span>
                <span className={`text-[10px] px-2 py-1 rounded-full uppercase font-bold 
                  ${skill.skillGapSeverity === 'high' ? 'bg-red-100 text-red-600' : 
                    skill.skillGapSeverity === 'medium' ? 'bg-amber-100 text-amber-600' : 
                    'bg-emerald-100 text-emerald-600'}`}>
                  {skill.skillGapSeverity} priority
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Interview Prep */}
        <section className="animate-in slide-in-from-bottom-8 fade-in duration-1000">
          <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <HelpCircle className="text-blue-500" /> Recommended Interview Questions
          </h2>
          <div className="space-y-6">
            {report.technicalQuestions?.map((q: ReportType['technicalQuestions'][0], i: number) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <p className="font-bold text-slate-900 text-lg">Q: {q.question}</p>
                <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-[10px] font-bold text-blue-800 uppercase mb-1">Expected Answer</p>
                  <p className="text-slate-700 leading-relaxed">{q.answer}</p>
                </div>
                <p className="mt-3 text-sm text-slate-400 italic flex items-center gap-1">
                   <Zap size={14} className="text-blue-400" /> Targeting: {q.intention}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}