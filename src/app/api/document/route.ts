import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/database/db";
import Document from "@/database/documentSchema";

export async function GET() {
  try {
    await dbConnect();
    const documents = await Document.find({});
    return NextResponse.json(documents);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { clerkId, eventId, s3DocId, documentType, createdAt, status, checkList } = body;

    const newDoc = await Document.create({
      clerkId,
      eventId,
      s3DocId,
      documentType,
      createdAt,
      status,
      checkList,
    });

    return NextResponse.json(newDoc, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
