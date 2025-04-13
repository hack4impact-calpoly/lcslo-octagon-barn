import connectToDB from "@/database/db";
import { NextRequest } from "next/server";
import Event from "@/database/eventSchema";
import { createSuccessResponse, createErrorResponse } from "@/lib/response";

export async function GET() {
  try {
    await connectToDB();
    const events = await Event.find();
    const sanitizedEvents = events.map((event) => ({
      id: event._id,
      clerkId: event.clerkId,
      docIds: event.docIds,
      venue: event.venue,
      eventName: event.eventName,
      eventType: event.eventType,
      eventDateStart: event.eventDateStart,
      eventDateEnd: event.eventDateEnd,
      status: event.status,
      createdAt: event.createdAt,
      docsTotal: event.docsTotal,
      docsCompleted: event.docsCompleted,
      numPeople: event.numPeople,
    }));
    return createSuccessResponse(sanitizedEvents, 200);
  } catch {
    return createErrorResponse("Server Error", "Failed to fetch events", 500);
  }
}

export async function POST(req: NextRequest) {
  await connectToDB();

  try {
    const body = await req.json();
    if (!body.clerkId || !body.eventName || !body.eventType || !body.eventDateStart || !body.eventDateEnd) {
      return createErrorResponse("BadRequest", "Missing required fields", 400);
    }
    const {
      clerkId,
      eventName,
      eventType,
      eventDateStart,
      eventDateEnd,
      docsTotal,
      docsCompleted,
      numPeople,
      ...rest
    } = body;
    const newEvent = new Event({
      ...rest,
      clerkId,
      eventName,
      eventType,
      eventDateStart: new Date(eventDateStart),
      eventDateEnd: new Date(eventDateEnd),
      docsTotal,
      docsCompleted,
      numPeople,
    });
    await newEvent.save();

    return createSuccessResponse(newEvent, 201);
  } catch (error) {
    return createErrorResponse("ServerError", "Failed to create event", 500);
  }
}
