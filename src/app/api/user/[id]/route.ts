import { Clerk } from "@clerk/clerk-sdk-node";
import { createSuccessResponse, createErrorResponse } from "@/lib/response";
import { NextRequest, NextResponse } from "next/server";

const clerkClient = Clerk({ secretKey: process.env.CLERK_SECRET_KEY! });

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id;
    const user = await clerkClient.users.getUser(userId);

    if (!user) {
      return createErrorResponse("Not Found", "User not found", 404);
    }

    return createSuccessResponse(user, 200);
  } catch (error) {
    return createErrorResponse("Server Error", "Failed to fetch user", 500);
  }
}
