import { createErrorResponse, createSuccessResponse } from "@/lib/response";
import { NextRequest } from "next/server";
import client, { generateUniqueS3Key } from "@/lib/aws-s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export async function DELETE(request: NextRequest) {
  try {
    // Pull data from the incoming request
    const body = await request.json();
    const { fileName, userId, eventId } = body;

    const s3Key = generateUniqueS3Key(userId, eventId, fileName);
    const command = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME as string,
      Key: s3Key,
    });
    await client.send(command);
    return createSuccessResponse({}, 200);
  } catch (error: any) {
    console.error("Error deleting document, error:", error);
    return createErrorResponse("Internal Server Error", error.message, 500);
  }
}
