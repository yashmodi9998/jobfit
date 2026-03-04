import User from "@/app/model/userModel";
import dbConnect from "@/lib/dbConfig";
import bcrypt from "bcryptjs";
import { signupSchema } from "@/lib/zod";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Parse the incoming JSON data
    const body = await request.json();
    
    //  Validate the data against our Zod schema
    const validation = signupSchema.safeParse(body);

    if (!validation.success) {
      // Return the specific Zod error message
      return NextResponse.json(
        { message: validation.error.issues[0].message }, 
        { status: 400 }
      );
    }
// If validation is successful, we can safely extract the validated data
    const { name, email, password } = validation.data;

    //  Connect to Database
    await dbConnect();

    //  Check for existing user
    const existingUser = await User.findOne({ email });
    // If a user with the provided email already exists, we return a 400 response with an appropriate message. This prevents duplicate accounts and ensures email uniqueness in our system.
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists with this email" }, 
        { status: 400 }
      );
    }

    //  Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //  Create and save new user
    const newUser = new User({ 
        name, 
        email, 
        password: hashedPassword 
    });
    // save new user to the database.

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