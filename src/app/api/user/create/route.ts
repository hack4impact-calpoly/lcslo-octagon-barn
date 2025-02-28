import { NextResponse } from "next/server";
import { Clerk } from "@clerk/clerk-sdk-node";

const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY! });

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, password } = await req.json();

    // Check if a user with this email already exists
    const existingUsers = await clerk.users.getUserList({ emailAddress: email });
    if (existingUsers.length > 0) {
      return NextResponse.json(
        { success: false, error: "User already exists. Please sign in instead." },
        { status: 409 },
      );
    }

    const user = await clerk.users.createUser({
      firstName,
      lastName,
      emailAddress: [email],
      password,
      publicMetadata: { isAdmin: false },
    });

    return NextResponse.json({ success: true, userId: user.id });
  } catch (error: any) {
    console.error("Clerk User Creation Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
