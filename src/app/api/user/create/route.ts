import { Clerk } from "@clerk/clerk-sdk-node";
import { createSuccessResponse, createErrorResponse } from "@/lib/response";

const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY! });

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, phone, password } = await req.json();

    const existingUsers = await clerk.users.getUserList({ emailAddress: email });

    if (existingUsers.length > 0) {
      return createErrorResponse("User exists", "User already exists", 409);
    }

    const user = await clerk.users.createUser({
      firstName,
      lastName,
      emailAddress: [email],
      password,
      publicMetadata: { isAdmin: false, phonNumber: phone },
    });

    return createSuccessResponse({ success: true, userId: user.id }, 200);
  } catch (err: any) {
    console.error("Clerk User Creation Error:", err);

    if (err && typeof err === "object" && Array.isArray((err as any).errors) && (err as any).errors.length > 0) {
      for (const error of (err as any).errors) {
        console.error("Clerk Error Details:", error);
        if (error.code === "form_password_pwned") {
          return createErrorResponse("Password Weak", "Password is too weak.", 400);
        }
      }
    }

    // Fallback for any other error
    const fallback = err instanceof Error ? err.message : "Unknown error";
    return createErrorResponse("Error", fallback, 400);
  }
}
