"use server";

import dbConnect from "@/lib/dbConfig";
import { auth } from "@/lib/auth";
import Report from "@/app/model/reportModel";

//  This server action handles saving the AI-generated report to the database after the review process is complete. 
// It ensures that only authenticated users can save reports and associates each report with the correct user ID.
//saveReportAction is called from the reviewresume/page.tsx after receiving the AI analysis results. 
// It takes the analysis data, connects to the database, and creates a new report document linked to the user.
interface SaveReportData {
  resume: string;
  jobDescription: string;
  matchPercentage: number;
  skillScore: Array<{
    skillGap: string;
    skillGapSeverity: 'low' | 'medium' | 'high';
  }>;
  technicalQuestions: Array<{
    question: string;
    answer: string;
    intention: string;
  }>;
  // NEW FIELD ADDED HERE
  revisedResume: {
    revisedSummary: string;
    revisedExperience: Array<{
      role: string;
      optimizedBulletPoints: string[];
    }>;
    suggestedSkills: string[];
  };
}
// Define the shape of the response from the action
interface ActionResponse {
  success: boolean;
  reportId: string | null;
  error: string | null;
}
//
export async function saveReportAction(data: SaveReportData): Promise<ActionResponse> {
  try {
    // Check if the user is authenticated   
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "You must be logged in to save reports.", reportId: null };
    }

    await dbConnect();
// console.log("Saving revisedResume check:", !!data.revisedResume);
// newReport is created with all the analysis data, including the new revisedResume field, 
// and linked to the user's ID from the session.
    const newReport = await Report.create({
      ...data,
      userId: session.user.id,
    });

    return { 
      success: true, 
      reportId: (newReport._id as string).toString(), 
      error: null 
    };

  } catch (error: unknown) {
    console.error("Database Save Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to save report";
    return { success: false, error: errorMessage, reportId: null };
  }
}