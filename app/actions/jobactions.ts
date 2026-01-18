"use server"
import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createJobs(formData: FormData) {
  const { userId, sessionClaims } = await auth();
  const clerkUser = await currentUser();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  if (!userId || role !== "COMPANY") {
    throw new Error("Unauthorized: Only companies can post jobs.");
  }

  const email = clerkUser?.emailAddresses[0].emailAddress;
  if (!email) throw new Error("User email not found");

  // 1. First, Upsert the User to handle the Unique Email constraint
  // This ensures the User exists in Supabase with the correct Clerk ID
  await prisma.user.upsert({
    where: { email: email },
    update: { id: userId }, // If email exists, update the ID to match current Clerk user
    create: {
      id: userId,
      email: email,
      role: "COMPANY",
      name: clerkUser.firstName || "Company User",
    },
  });

  // 2. Extract Job Data
  const title = formData.get("title") as string;
  const company = formData.get("company") as string;
  const location = formData.get("location") as string;
  const type = formData.get("type") as string;
  const salary = formData.get("salary") as string;
  const description = formData.get("description") as string;
  const requirements = formData.get("requirements") as string;

  // 3. Create the Job linked to the validated User ID
  try {
    await prisma.job.create({
      data: {
        title,
        company,
        location,
        type,
        salary,
        description,
        requirements,
        postedById: userId, // We use the ID directly now
        status: "PENDING",
      },
    });
  } catch (error) {
    console.error("PRISMA JOB CREATE ERROR:", error);
    throw new Error("Failed to create job listing.");
  }

  revalidatePath("/jobs");
  revalidatePath("/dashboard/company");
  redirect("/dashboard/company");
}