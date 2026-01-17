import { PrismaClient } from "@prisma/client";
import { auth,currentUser } from "@clerk/nextjs/server";


const prisma = new PrismaClient();
export async function GET() {
    const users = await prisma.user.findMany();
    return new Response(JSON.stringify(users));
}