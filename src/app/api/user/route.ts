import connectToDB from "@/database/db";
import clerkClient from "@clerk/clerk-sdk-node";
import { connect } from "http2";

export async function GET(req: Request) {
  try {
    await connectToDB();
    const response = await clerkClient.users.getUserList();
    if (!response || response.length === 0) {
      return new Response("No users found", { status: 404 });
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response("Internal server error" + error, { status: 500 });
  }
}
