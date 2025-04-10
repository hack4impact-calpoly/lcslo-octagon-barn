import { createErrorResponse, createSuccessResponse } from "@/lib/response";
import { NextRequest } from "next/server";
import client from "@/lib/aws-s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { s3Key } = body;

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
