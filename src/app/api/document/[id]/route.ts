import { NextRequest, NextResponse } from "next/server";
import Document from "@/database/documentSchema";
import mongoose from "mongoose";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/database/db"; // Import the connectDB function

type UpdateableDocumentFields = {
  documentType?: string;
  status?: "Completed" | "Pending" | "Not Submitted";
  checkList?: string[];
};

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB(); // Ensure database connection

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid document ID" }, { status: 400 });
    }

    const body: UpdateableDocumentFields = await req.json();

    // Find document and verify ownership
    const document = await Document.findOne({ _id: id, clerkId: userId });
    if (!document) {
      return NextResponse.json({ error: "Document not found or unauthorized" }, { status: 404 });
    }

    const updatedDocument = await Document.findByIdAndUpdate(id, { ...body }, { new: true, runValidators: true });

    return NextResponse.json(updatedDocument);
  } catch (error) {
    console.error("Error updating document:", error);
    return NextResponse.json({ error: "Error updating document" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB(); // Ensure database connection

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid document ID" }, { status: 400 });
    }

    // Find document and verify ownership
    const document = await Document.findOne({ _id: id, clerkId: userId });
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
