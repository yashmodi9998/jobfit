import User from "@/app/model/userModel";
import dbConnect from "@/lib/dbConfig";
import bcrypt from "bcryptjs";
import { signupSchema } from "@/lib/zod";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Validate the data against our Zod schema
    const validation = signupSchema.safeParse(body);

    if (!validation.success) {
      // Return the specific Zod error message
      return NextResponse.json(
        { message: validation.error.issues[0].message }, 
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;

    // 2. Connect to Database
    await dbConnect();

    // 3. Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists with this email" }, 
        { status: 400 }
      );
    }

    // 4. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Create and save new user
    const newUser = new User({ 
        name, 
        email, 
        password: hashedPassword 
    });
    
    await newUser.save();

    return NextResponse.json(
        { message: "User created successfully" }, 
        { status: 201 }
    );

  } catch (error) {
    console.error("Signup error details:", error);
    return NextResponse.json(
        { message: "Internal Server Error" }, 
        { status: 500 }
    );
  }
}