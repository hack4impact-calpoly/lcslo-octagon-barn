import { NextRequest } from "next/server";
import dbConnect from "@/database/db";
import Document from "@/database/documentSchema";
import { createErrorResponse, createSuccessResponse } from "@/lib/response";

export async function GET() {
  try {
    await dbConnect();
    const documents = await Document.find({});
    return createSuccessResponse(documents, 200);
  } catch (error: any) {
    return createErrorResponse("Internal Server Error", error.message, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { clerkId, eventId, s3DocId, documentName, documentType, createdAt, status, checkList } = body;

    const newDoc = await Document.create({
      clerkId,
      eventId,
      s3DocId,
      documentName,
      documentType,
      createdAt,
      status,
      checkList,
    });

    return createSuccessResponse(newDoc, 201);
  } catch (error: any) {
    return createErrorResponse("Internal Server Error", error.message, 500);
  }
}
