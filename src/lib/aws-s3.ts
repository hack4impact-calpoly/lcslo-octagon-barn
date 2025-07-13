import { S3Client } from "@aws-sdk/client-s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import mime from "mime-types";

const client = new S3Client({
  region: process.env.S3_BUCKET_REGION as string,
  credentials: {
    accessKeyId: process.env.S3_BUCKET_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.S3_BUCKET_SECRET_ACCESS_KEY as string,
  },
});

/**
 * Generates a unique S3 key for a file based on event name, document name, and filename
 * Format: eventName/documentName/fileName_timestamp
 *
 * @param eventName - The name of the event (used as first folder)
 * @param documentName - The logical document name (used as second folder)
 * @returns A unique S3 key string
 */
export function generateUniqueS3Key(eventName: string, documentName: string): string {
  const timestamp = Date.now();
  return `${eventName}/${documentName}/${documentName}_${timestamp}`;
}

async function getDownloadFilename(s3Key: string): Promise<string> {
  const getCommand = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: s3Key,
  });

  const response = await client.send(getCommand);
  const contentType = response.ContentType;
  const extension = mime.extension(contentType || "") || "";

  const rawName = s3Key.split("/").pop()?.split("_").slice(0, -1).join("_") || "download";
  const filename = extension ? `${rawName}.${extension}` : rawName;
  return filename;
}

export default client;
export { getDownloadFilename };
