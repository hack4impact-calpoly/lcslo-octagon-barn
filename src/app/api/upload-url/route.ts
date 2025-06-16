import { NextRequest } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import client, { generateUniqueS3Key } from "@/lib/aws-s3";
import { createErrorResponse, createSuccessResponse } from "@/lib/response";
import connectDB from "@/database/db";
import Event from "@/database/eventSchema";
import Document from "@/database/documentSchema";

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const eventId = searchParams.get("eventId");
    const documentId = searchParams.get("documentId");

    if (!eventId) {
      return createErrorResponse("Bad Request", "eventId is required", 400);
    }

    if (!documentId) {
      return createErrorResponse("Bad Request", "documentId is required", 400);
    }

    // Lookup eventName and documentName from the database
    const event = await Event.findById(eventId);
    if (!event) {
      return createErrorResponse("Not Found", "Event not found", 404);
    }
    const document = await Document.findById(documentId);
    if (!document) {
      return createErrorResponse("Not Found", "Document not found", 404);
    }
    const eventName = event.eventName.replace(/\s+/g, "_");
    const documentName = document.documentName.replace(/\s+/g, "_");

    // Generate a unique S3 key using eventName and documentName
    const s3Key = generateUniqueS3Key(eventName, documentName);

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME as string,
      Key: s3Key,
    });

    const uploadUrl = await getSignedUrl(client, command, {
      expiresIn: 900, // URL expires in 15 minutes
    });

    return createSuccessResponse({ uploadUrl, s3Key }, 200);
  } catch (error) {
    console.error("Error generating upload URL:", error);
    return createErrorResponse("Internal Server Error", "Failed to generate upload URL", 500);
  }
}
