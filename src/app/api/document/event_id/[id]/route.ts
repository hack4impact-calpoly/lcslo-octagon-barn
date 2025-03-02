import connectDB from "@/database/db";
import Document from "@/database/documentSchema";
import { createSuccessResponse, createErrorResponse } from "@/lib/response";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id: eventId } = params;

    if (!eventId) {
      return createErrorResponse("BadRequest", "Missing event ID", 400);
    }

    const documents = await Document.find({ eventId });

    return createSuccessResponse(documents, 200);
  } catch (error) {
    return createErrorResponse("ServerError", "Failed to fetch documents", 500);
  }
}
