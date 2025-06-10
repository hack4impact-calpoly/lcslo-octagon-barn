import connectToDB from "@/database/db";
import { NextRequest } from "next/server";
import Alert from "@/database/alertSchema";
import { createSuccessResponse, createErrorResponse } from "@/lib/response";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDB();
    const body = await req.json();
    const { isRead, ...rest } = body;

    const updateData: Record<string, any> = {
      ...(isRead !== undefined && { isRead }),
      ...rest,
    };

    const updatedAlert = await Alert.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    if (!updatedAlert) {
      return createErrorResponse("NotFound", "Alert not found", 404);
    }

    return createSuccessResponse(updatedAlert, 200);
  } catch (error) {
    console.error("Failed to update alert", error);
    return createErrorResponse("ServerError", "Could not update alert", 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDB();
    const deletedAlert = await Alert.findByIdAndDelete(params.id);
    if (!deletedAlert) {
      return createErrorResponse("NotFound", "Alert not found", 404);
    }
    return createSuccessResponse({ message: "Alert deleted successfully" }, 200);
  } catch (error) {
    console.error("Failed to delete alert", error);
    return createErrorResponse("ServerError", "Could not delete alert", 500);
  }
}
