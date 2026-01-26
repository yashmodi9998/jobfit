
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// Ensure these match your Prisma Schema Enum exactly
type Status = "SHORTLISTED" | "REJECTED" | "PENDING";

export async function updateApplicationStatus(applicationId: string, newStatus: Status, jobId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // 1. Verify ownership (Security)
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { job: true },
  });

  if (!application || application.job.postedById !== userId) {
    throw new Error("Unauthorized access to this application");
  }

  // 2. Update the status
  await prisma.application.update({
    where: { id: applicationId },
    data: { status: newStatus },
  });

  // 3. Refresh the page data without a full reload
  revalidatePath(`/dashboard/company/application/${applicationId}`);
  revalidatePath(`/dashboard/company/job/${jobId}`);
}