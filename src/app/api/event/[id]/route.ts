import { NextRequest } from "next/server";
import connectToDB from "@/database/db";
import Event from "@/database/eventSchema";
import { createSuccessResponse, createErrorResponse } from "@/lib/response";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDB();
    const event = await Event.findById(params.id);
    if (!event) {
      return createErrorResponse("NotFound", "Event not found", 404);
    }
    return createSuccessResponse(event, 200);
  } catch (error) {
    return createErrorResponse("ServerError", "Failed to fetch event", 500);
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDB();
    const body = await req.json();
    const { clerkId, ...updateData } = body;

    const updatedEvent = await Event.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return createErrorResponse("NotFound", "Event not found", 404);
    }

    return createSuccessResponse(updatedEvent, 200);
  } catch (error) {
    return createErrorResponse("ServerError", "Failed to update event", 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDB();
    const deletedEvent = await Event.findByIdAndDelete(params.id);
    if (!deletedEvent) {
      return createErrorResponse("NotFound", "Event not found", 404);
    }
    return createSuccessResponse({ message: "Event deleted successfully" }, 200);
  } catch (error) {
    return createErrorResponse("ServerError", "Failed to delete event", 500);
  }
}