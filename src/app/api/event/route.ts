import connectToDB from "@/database/db";
import { NextRequest } from "next/server";
import Event from "@/database/eventSchema";
import { createSuccessResponse, createErrorResponse } from "@/lib/response";

export async function GET() {
  try {
    await connectToDB();
    const events = await Event.find();
    return createSuccessResponse(events, 200);
  } catch {
    return createErrorResponse("Server Error", "Failed to fetch events", 500);
  }
}

export async function POST(req: NextRequest) {
  await connectToDB();

  try {
    const body = await req.json();
    if (!body.clerkId || !body.eventName || !body.eventType || !body.eventDate) {
      return createErrorResponse("BadRequest", "Missing required fields", 400);
    }
    const newEvent = new Event(body);
    await newEvent.save();

    return createSuccessResponse(newEvent, 201);
  } catch (error) {
    return createErrorResponse("ServerError", "Failed to create event", 500);
  }
}
