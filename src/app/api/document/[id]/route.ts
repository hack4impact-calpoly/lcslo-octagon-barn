import { NextRequest } from "next/server";
import Document from "@/database/documentSchema";
import mongoose from "mongoose";
import connectDB from "@/database/db";
import { createSuccessResponse, createErrorResponse } from "@/lib/response";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = params;

    if (!mongoose.isValidObjectId(id)) {
      return createErrorResponse("Invalid document ID", "Invalid document ID", 400);
    }

    const doc = await Document.findById(id);

    if (!doc) {
      return createErrorResponse("Not Found", `Document with ID ${id} not found`, 404);
    }

    return createSuccessResponse(doc, 200);
  } catch (error: any) {
    return createErrorResponse("Internal Server Error", error.message, 500);
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = params;

    if (!mongoose.isValidObjectId(id)) {
      return createErrorResponse("Invalid document ID", "Invalid document ID", 400);
    }

    const body = await req.json();

    // Update only the allowed fields
    const updatedDocument = await Document.findByIdAndUpdate(id, body, { new: true, runValidators: true });

    return createSuccessResponse(updatedDocument, 200);
  } catch (error) {
    console.error("Error updating document:", error);
    return createErrorResponse("Error updating document", "Error updating document", 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = params;

    if (!mongoose.isValidObjectId(id)) {
      return createErrorResponse("Invalid document ID", "Invalid document ID", 400);
    }

    // Find document and verify ownership
    const document = await Document.findById(id);

    if (!document) {
      return createErrorResponse("Document not found or unauthorized", "Document not found or unauthorized", 404);
    }

    await Document.findByIdAndDelete(id);
    return createSuccessResponse({}, 200);
  } catch (error) {
    console.error("Error deleting document:", error);
    return createErrorResponse("Error deleting document", "Error deleting document", 500);
  }
}
