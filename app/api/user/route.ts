import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConfig';
import User from '@/app/model/userModel';
import bcrypt from 'bcryptjs'; 
import { auth } from '@/lib/auth';
// --- GET: Fetch current logged-in user details
export async function GET(request: Request) {
  try {
    await dbConnect();
    const session = await auth(); // Get current session
    if (!session?.user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }
    const user = await User.findOne({ email: session.user.email }).select("-password");
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  } 

}
// This route handles user creation (signup)
export async function POST(request: Request) {
  try {
    // 1. Connect to DB immediately
    await dbConnect();

    const { name, email, password } = await request.json();

    // 2. Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" }, 
        { status: 400 }
      );
    }

    // 3. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already in use" }, 
        { status: 400 }
      );
    }

    // 4. Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Create and save new user
    const newUser = await User.create({ 
      name, 
      email, 
      password: hashedPassword 
    });

    return NextResponse.json(
      { success: true, message: "User created!", userId: newUser._id }, 
      { status: 201 }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, message: "Server error", error: errorMessage }, 
      { status: 500 }
    );
  }
}