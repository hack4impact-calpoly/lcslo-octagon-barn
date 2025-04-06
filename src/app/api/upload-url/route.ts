import { NextRequest } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import client, { generateUniqueS3Key } from "@/lib/aws-s3";
import { createErrorResponse, createSuccessResponse } from "@/lib/response";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const file = searchParams.get("file");
    const eventId = searchParams.get("eventId");
    const userId = searchParams.get("userId");

    if (!file) {
      return createErrorResponse("Bad Request", "fileName is required", 400);
    }

    if (!eventId) {
      return createErrorResponse("Bad Request", "eventId is required", 400);
    }

    if (!userId) {
      return createErrorResponse("Bad Request", "userId is required", 400);
    }

    // Generate a unique S3 key
    const s3Key = generateUniqueS3Key(eventId, userId, file);

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME as string,
      Key: s3Key,
    });

    const uploadUrl = await getSignedUrl(client, command, {
      expiresIn: 3600, // URL expires in 1 hour
    });

    return createSuccessResponse({ uploadUrl }, 200);
  } catch (error) {
    console.error("Error generating upload URL:", error);
    return createErrorResponse("Internal Server Error", "Failed to generate upload URL", 500);
  }
}
