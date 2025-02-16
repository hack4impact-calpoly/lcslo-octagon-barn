import { NextRequest } from "next/server";
import connectToDB from "@/database/db";
import Event from "@/database/eventSchema";
import { createSuccessResponse, createErrorResponse } from "@/lib/response";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDB();

  try {
    const event = await Event.findById(params.id);
    if (!event) {
      return createErrorResponse("NotFound", "Event not found", 404);
    }
    return createSuccessResponse(event, 200);
  } catch (error) {
    return createErrorResponse("ServerError", "Failed to fetch event", 500);
  }
}
