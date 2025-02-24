import { NextRequest } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import client from "@/lib/aws-s3";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const file = searchParams.get("file");

    if (!file) {
      return Response.json({ error: "fileName is required" }, { status: 400 });
    }

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME as string,
      Key: file,
    });

    const uploadUrl = await getSignedUrl(client, command, {
      expiresIn: 3600, // URL expires in 1 hour
    });

    return Response.json({ uploadUrl });
  } catch (error) {
    console.error("Error generating upload URL:", error);
    return Response.json({ error: "Failed to generate upload URL" }, { status: 500 });
  }
}
