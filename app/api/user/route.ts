import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConfig';
import User from '@/app/model/userModel';
import bcrypt from 'bcryptjs'; 
import { auth } from '@/lib/auth';

// This API route handles both fetching the current user (GET) and creating a new user (POST).
export async function GET() {
  try {
    // connect to the database and fetch the current user based on the session
    await dbConnect();
    const session = await auth(); // Get current session

    if (!session?.user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }
    // find the user and exclude the password field from the response for security reasons
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
    //  Connect to DB immediately
    await dbConnect();

    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {

      return NextResponse.json(
        { success: false, message: "All fields are required" }, 
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already in use" }, 
        { status: 400 }
      );
    }

    //  Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //  Create and save new user
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
    // Handle any unexpected errors and return a consistent error response
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, message: "Server error", error: errorMessage }, 
      { status: 500 }
    );
  }
}