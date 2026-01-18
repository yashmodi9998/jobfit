"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function submitApplication(jobId: string, resumeUrl: string, note: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("You must be logged in to apply");
  }

  try {
    // 1. Create the application in the database
    // Matching your schema: 'candidateId', 'resumeUrl', 'coverLetter'
    await prisma.application.create({
      data: {
        jobId: jobId,
        candidateId: userId,
        resumeUrl: resumeUrl, 
        coverLetter: note, // Mapping your textarea 'note' to 'coverLetter'
        status: "PENDING",
        aiScore: Math.floor(Math.random() * 31) + 65, // Placeholder AI logic
      },
    });

    // 2. Refresh the dashboard data
    revalidatePath("/dashboard/candidate");
    
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to submit application.");
  }

  // 3. Redirect back to tracker
  redirect("/dashboard/candidate");
}