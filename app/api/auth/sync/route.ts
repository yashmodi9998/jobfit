import { auth, currentUser } from "@clerk/nextjs/server";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const clerkUser = await currentUser();
  if (!clerkUser) {
    return new Response("Unauthorized", { status: 401 });
  }

  const email = clerkUser.emailAddresses[0].emailAddress;

  const name =
    (clerkUser.firstName || "") +
    (clerkUser.lastName ? " " + clerkUser.lastName : "");

 
  const user = await prisma.user.upsert({
    where: { email },

    update: { name },
    create: {
      email,
      name,
      role: Role.CANDIDATE,
    },
  });

  return new Response(JSON.stringify(user), { status: 200 });
}
