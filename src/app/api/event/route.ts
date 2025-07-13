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
      clientName: event.clientName,
      docIds: event.docIds,
      venue: event.venue,
      eventName: event.eventName,
      eventDateStart: event.eventDateStart,
      eventDateEnd: event.eventDateEnd,
      status: event.status,
      eventDetails: event.eventDetails,
      vendorList: event.vendorList,
      createdAt: event.createdAt,
      docsTotal: event.docsTotal,
      docsCompleted: event.docsCompleted,
      numGuests: event.numGuests,
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
    if (
      !body.clerkId ||
      !body.clientName ||
      !body.eventName ||
      !body.venue ||
      !body.eventDateStart ||
      !body.eventDateEnd ||
      !body.status
    ) {
      return createErrorResponse("BadRequest", "Missing required fields", 400);
    }

    const { clerkId, clientName, venue, eventName, eventDateStart, eventDateEnd, status, ...rest } = body;
    const newEvent = new Event({
      clerkId,
      clientName,
      venue,
      eventName,
      eventDateStart: new Date(eventDateStart),
      eventDateEnd: new Date(eventDateEnd),
      status,
      ...rest,
    });
    await newEvent.save();

    return createSuccessResponse(newEvent, 201);
  } catch (error) {
    return createErrorResponse("ServerError", "Failed to create event", 500);
  }
}
