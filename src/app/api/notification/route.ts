import connectToDB from "@/database/db";
import { NextRequest } from "next/server";
import Alert from "@/database/alertSchema";
import { createSuccessResponse, createErrorResponse } from "@/lib/response";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const alertTo = searchParams.get("alertTo");

  if (!alertTo) {
    return createErrorResponse("BadRequest", "Missing alertTo", 400);
  }

  try {
    await connectToDB();
    const alerts = await Alert.find({ alertTo });
    return createSuccessResponse(alerts, 200);
  } catch (error) {
    console.error("Failed to fetch alerts", error);
    return createErrorResponse("ServerError", "Could not fetch alerts", 500);
  }
}
