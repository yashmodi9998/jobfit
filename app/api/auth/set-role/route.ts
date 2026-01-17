import { prisma } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 1. Authenticate the request
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse the body
    const { email, name, role } = await req.json();

    if (!role || !email) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    console.log(`--- Syncing Role for ${email} ---`);
    console.log(`Target Role: ${role}`);

    // 3. Update Clerk (Public Metadata)
    // This controls what the Navbar and Middleware see
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: role,
      },
    });
    console.log("✅ Clerk Metadata Updated");

    // 4. Update Supabase via Prisma (Upsert)
    // We use the Clerk 'id' as the unique key to prevent duplicates
    const updatedUser = await prisma.user.upsert({
      where: { 
        id: userId 
      },
      update: { 
        role: role,
        email: email, // Keep email in sync
        name: name,
      },
      create: { 
        id: userId, 
        email, 
        name, 
        role 
      },
    });
    
    console.log("✅ Supabase/Prisma Updated:", updatedUser.role);

    return NextResponse.json({ 
      success: true, 
      role: updatedUser.role 
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("SET_ROLE_ERROR:", errorMessage);
    return NextResponse.json(
      { error: "Internal Server Error", details: errorMessage }, 
      { status: 500 }
    );
  }
}