import { NextResponse } from "next/server";

export function createSuccessResponse<T>(data: T, status: number) {
  return NextResponse.json(data, { status });
}

export function createErrorResponse(error: string, message: string, status: number) {
  return NextResponse.json({ error, message }, { status });
}
