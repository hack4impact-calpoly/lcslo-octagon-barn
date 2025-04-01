import connectDB from "@/database/db";
import Event from "@/database/eventSchema";
import { createSuccessResponse, createErrorResponse } from "@/lib/response";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id: clerkId } = params;
    const events = await Event.find({ clerkId });

    if (!events.length) {
      return createErrorResponse("NotFound", "No events found for this user", 404);
    }

    return createSuccessResponse(events, 200);
  } catch (error) {
    return createErrorResponse("ServerError", "Failed to fetch events", 500);
  }
}
