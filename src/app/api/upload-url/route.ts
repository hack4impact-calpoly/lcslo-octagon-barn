import { NextRequest } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import client, { generateUniqueS3Key } from "@/lib/aws-s3";
import { createErrorResponse, createSuccessResponse } from "@/lib/response";
import connectDB from "@/database/db";

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const eventName = searchParams.get("eventName");
    const documentName = searchParams.get("documentName");

    if (!eventName) {
      return createErrorResponse("Bad Request", "eventId is required", 400);
    }

    if (!documentName) {
      return createErrorResponse("Bad Request", "documentName is required", 400);
    }

    const sanitize = (name: string) => name.replace(/[\/\\]/g, "_");
    const sanitizedEventName = sanitize(eventName);
    const sanitizedDocumentName = sanitize(documentName);

    console.log(sanitizedEventName + "999" + sanitizedDocumentName);

    // Generate a unique S3 key using eventName and documentName
    const s3Key = generateUniqueS3Key(sanitizedEventName, sanitizedDocumentName);
    console.log(s3Key);

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
