import { NextRequest } from "next/server";
import dbConnect from "@/database/db";
import Document from "@/database/documentSchema";
import { createErrorResponse, createSuccessResponse } from "@/lib/response";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const { id } = params;
    const doc = await Document.findById(id);

    if (!doc) {
      return createErrorResponse("Not Found", `Document with ID ${id} not found`, 404);
    }

    return createSuccessResponse(doc, 200);
  } catch (error: any) {
    return createErrorResponse("Internal Server Error", error.message, 500);
  }
}
