import { createErrorResponse, createSuccessResponse } from "@/lib/response";
import { NextRequest } from "next/server";
import { IncomingForm } from "formidable";
import { IncomingMessage } from "http";

export async function PUT(request: NextRequest) {
  try {
    // Pull data from the incoming request
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const uploadUrl = formData.get("upload-url") as string | null;

    // Cgeck if the file and upload URL were provided
    if (file === null || file === undefined) {
      return createErrorResponse("No file was provided", "No file was provided", 400);
    } else if (uploadUrl === null || uploadUrl === undefined) {
      return createErrorResponse("No upload URL was provided", "No upload URL was provided", 400);
    }

    // Upload the file to the S3 bucket
    const response = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });
    if (!response.ok) {
      return createErrorResponse("Failed to upload document", "Failed to upload document", 500);
    }
    return createSuccessResponse("Document uploaded successfully", 200);
  } catch (error: any) {
    console.error("Error uploading document, error:", error);
    return createErrorResponse("Internal Server Error", error.message, 500);
  }
}
