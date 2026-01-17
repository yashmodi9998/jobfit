import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();
export async function GET() {
    const applications = await prisma.application.findMany();

    return new Response(JSON.stringify(applications));
}