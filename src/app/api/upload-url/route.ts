import { NextRequest } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import client from "@/lib/aws-s3";
import { createErrorResponse, createSuccessResponse } from "@/lib/response";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const file = searchParams.get("file");

    if (!file) {
      return createErrorResponse("Bad Request", "fileName is required", 400);
    }

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME as string,
      Key: file,
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
