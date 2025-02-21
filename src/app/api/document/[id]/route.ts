import { NextRequest, NextResponse } from "next/server";
import Document from "@/database/documentSchema";
import mongoose from "mongoose";
import connectDB from "@/database/db";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const { id } = params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid document ID" }, { status: 400 });
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
      return NextResponse.json({ error: "Document not found or unauthorized" }, { status: 404 });
    }

    // Update only the allowed fields
    const updatedDocument = await Document.findByIdAndUpdate(
      id,
      { ...updateFields },
      { new: true, runValidators: true },
    );

    return NextResponse.json(updatedDocument);
  } catch (error) {
    console.error("Error updating document:", error);
    return NextResponse.json({ error: "Error updating document" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const { id } = params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid document ID" }, { status: 400 });
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
      return NextResponse.json({ error: "Document not found or unauthorized" }, { status: 404 });
    }

    await Document.findByIdAndDelete(id);
    return NextResponse.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json({ error: "Error deleting document" }, { status: 500 });
  }
}
