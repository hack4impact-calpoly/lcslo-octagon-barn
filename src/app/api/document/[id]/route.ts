import { NextRequest, NextResponse } from "next/server";
import Document from "@/database/documentSchema";
import mongoose from "mongoose";
import connectDB from "@/database/db";

// Standardized API response format based off https://medium.com/@bojanmajed/standard-json-api-response-format-c6c1aabcaa6d
type ApiResponse<T> = {
  error?: string;
  success: boolean;
  message?: string;
  data?: T;
};

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json<ApiResponse<null>>(
        {
          error: "Invalid document ID",
          success: false,
          message: undefined,
          data: undefined,
        },
        { status: 400 },
      );
    }

    const body = await req.json();
    const { clerkId, eventId, s3DocId, ...updateFields } = body;

    // Find document and verify ownership
    const document = await Document.findOne({
      _id: id,
      clerkId: clerkId,
      eventId: eventId,
      s3DocId: s3DocId,
    });

    if (!document) {
      return NextResponse.json<ApiResponse<null>>(
        {
          error: "Document not found or unauthorized",
          success: false,
          message: undefined,
          data: undefined,
        },
        { status: 404 },
      );
    }

    // Update only the allowed fields
    const updatedDocument = await Document.findByIdAndUpdate(
      id,
      { ...updateFields },
      { new: true, runValidators: true },
    );

    return NextResponse.json<ApiResponse<typeof updatedDocument>>({
      error: undefined,
      success: true,
      message: "Document updated successfully",
      data: updatedDocument,
    });
  } catch (error) {
    console.error("Error updating document:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        error: "Error updating document",
        success: false,
        message: undefined,
        data: undefined,
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json<ApiResponse<null>>(
        {
          error: "Invalid document ID",
          success: false,
          message: undefined,
          data: undefined,
        },
        { status: 400 },
      );
    }

    const body = await req.json();
    const { clerkId, eventId, s3DocId } = body;

    // Find document and verify ownership
    const document = await Document.findOne({
      _id: id,
      clerkId: clerkId,
      eventId: eventId,
      s3DocId: s3DocId,
    });

    if (!document) {
      return NextResponse.json<ApiResponse<null>>(
        {
          error: "Document not found or unauthorized",
          success: false,
          message: undefined,
          data: undefined,
        },
        { status: 404 },
      );
    }

    await Document.findByIdAndDelete(id);

    return NextResponse.json<ApiResponse<null>>({
      error: undefined,
      success: true,
      message: "Document deleted successfully",
      data: undefined,
    });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        error: "Error updating document",
        success: false,
        message: undefined,
        data: undefined,
      },
      { status: 500 },
    );
  }
}
