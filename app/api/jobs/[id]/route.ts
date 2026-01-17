import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  _req: Request,
  context: { params:Promise< { id: string } >}
) {
  try {
    const {id:jobId} = await context.params; // ✅ explicitly extract id

    if (!jobId) {
      return new Response(
        JSON.stringify({ error: "Job ID is required" }),
        { status: 400 }
      );
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        postedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!job) {
      return new Response(
        JSON.stringify({ error: "Job not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(job), { status: 200 });

  } catch (error) {
    console.error("JOB FETCH ERROR:", error);

    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
