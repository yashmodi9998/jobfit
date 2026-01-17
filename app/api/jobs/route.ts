import { PrismaClient,JobStatus } from "@prisma/client";
import { auth, currentUser } from "@clerk/nextjs/server";


const prisma = new PrismaClient();
export async function GET() {
    const jobs = await prisma.job.findMany();
    return new Response(JSON.stringify(jobs));
}
export async function POST(req: Request) {
try{
    const {userId} = await auth();
    if (!userId) {
        return new Response("Unauthorized user", { status: 401 });
    }
    const clerkUser = await currentUser();
    if (!clerkUser) {
        return new Response("Unauthorized clerk", { status: 401 });
    }
    const email = clerkUser.emailAddresses[0].emailAddress;

    const user = await prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        return new Response("User not found", { status: 404 });
    }
    if(user.role !== "COMPANY"){
        return new Response("Forbidden", { status: 403 });
    }
    const body = await req.json();

    const title = body.title;
    const company = body.company;
    const description = body.description;
    const location = body.location;
    const type= body.type;       
    const salary = body.salary;
    const requirements = body.requirements;
   const job = await prisma.job.create({
    data: {
      title,
      company,
      location,
      type,
      salary,
      description,
      requirements,
      status: JobStatus.PENDING, // admin will approve later
      postedById: user.id,
    },
  });
  return new Response(JSON.stringify(job), { status: 201 });
}catch (error) {
    console.error("JOB API ERROR:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}