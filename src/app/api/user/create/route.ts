import { Clerk } from "@clerk/clerk-sdk-node";
import { createSuccessResponse, createErrorResponse } from "@/lib/response";

const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY! });

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, password } = await req.json();

    //const existingUsers = await clerk.users.getUserList({ emailAddress: email });
    console.log("Incoming user data:", { firstName, lastName, email, password });
    const existingUsers = await clerk.users.getUserList({ emailAddress: email });
    console.log("Existing users found:", existingUsers.length);

    if (existingUsers.length > 0) {
      return createErrorResponse("User exists", "User already exists. Please sign in instead.", 409);
    }

    const user = await clerk.users.createUser({
      firstName,
      lastName,
      emailAddress: [email],
      password,
      publicMetadata: { isAdmin: false },
    });

    return createSuccessResponse({ success: true, userId: user.id }, 200);
  } catch (error: any) {
    console.error("Clerk User Creation Error:", error);
    return createErrorResponse("Error", error.message || "Unknown error", 400);
  }
}
