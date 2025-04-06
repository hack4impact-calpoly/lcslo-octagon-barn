import { S3Client } from "@aws-sdk/client-s3";
import crypto from "crypto";

const client = new S3Client({
  region: process.env.S3_BUCKET_REGION as string,
  credentials: {
    accessKeyId: process.env.S3_BUCKET_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.S3_BUCKET_SECRET_ACCESS_KEY as string,
  },
});

/**
 * Generates a unique S3 key for a file based on event ID, user ID, and filename
 * Format: eventId/hashedUserId/timestamp_filename
 *
 * @param eventId - The event ID associated with the file
 * @param userId - The user ID (Clerk ID) that will be hashed
 * @param fileName - Original filename
 * @returns A unique S3 key string
 */
export function generateUniqueS3Key(eventId: string, userId: string, fileName: string): string {
  const hashedUserId = crypto.createHash("sha256").update(userId).digest("hex").substring(0, 4); // just use the first 4 characters

  const timestamp = Date.now();
  return `${eventId}/${hashedUserId}/${timestamp}_${fileName}`;
}

export default client;
