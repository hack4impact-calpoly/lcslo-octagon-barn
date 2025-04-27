import connectDB from "@/database/db";
import Event from "@/database/eventSchema";
import { createSuccessResponse, createErrorResponse } from "@/lib/response";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id: clerkId } = params;
    const events = await Event.find({ clerkId });

    const sanitizedEvents = events.map((event) => ({
      id: event._id,
      clerkId: event.clerkId,
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

    if (!sanitizedEvents.length) {
      return createErrorResponse("NotFound", "No events found for this user", 404);
    }

    return createSuccessResponse(sanitizedEvents, 200);
  } catch (error) {
    return createErrorResponse("ServerError", "Failed to fetch events", 500);
  }
}
