"use server";

import dbConnect from "@/lib/dbConfig";
import { auth } from "@/lib/auth";
import Report from "@/app/model/reportModel";
// This action handles saving the report to the database after processing
// 1. Define the incoming data structure
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
}

// 2. Define a consistent return type
interface ActionResponse {
  success: boolean;
  reportId: string | null;
  error: string | null;
}

export async function saveReportAction(data: SaveReportData): Promise<ActionResponse> {
  try {
    // check if user is authenticated
    const session = await auth();
    // If there's no valid session or user ID, we return an error response instead of throwing an exception
    if (!session?.user?.id) {
      return { success: false, error: "You must be logged in to save reports.", reportId: null };
    }
// connect to the database
    await dbConnect();
// Create a new report document in MongoDB with the provided data and the authenticated user's ID
    const newReport = await Report.create({
      ...data,
      userId: session.user.id,
    });
// Return a success response with the new report's ID, ensuring it's a string for consistency
    return { 
      success: true, 
      reportId: (newReport._id as string).toString(), 
      error: null 
    };

  } catch (error: unknown) {
    
    const errorMessage = error instanceof Error ? error.message : "Failed to save report";
    
    return { 
      success: false, 
      error: errorMessage, 
      reportId: null 
    };
  }
}