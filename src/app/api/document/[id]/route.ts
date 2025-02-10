import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/database/db";
import Document from "@/database/documentSchema";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const { id } = params;
    const doc = await Document.findById(id);
    if (!doc) {
      return NextResponse.json({ message: "Not Found" }, { status: 404 });
    }
    return NextResponse.json(doc);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
