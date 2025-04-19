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
 * Generates a unique S3 key for a file based on user ID, event ID, document ID and filename
 * Format: hashedUserId/eventId/documentId/filename/timestamp_filename
 *
 * @param userId - The user ID (Clerk ID) that will be hashed
 * @param eventId - The event ID associated with the file
 * @param documentId - The document ID associated with the file
 * @param fileName - Original filename
 * @returns A unique S3 key string
 */
const SALT = process.env.S3_HASH_SALT || "fallback_salt";

export function generateUniqueS3Key(userId: string, eventId: string, documentId: string, fileName: string): string {
  const hashedUserId = crypto
    .createHash("sha256")
    .update(SALT + userId)
    .digest("hex")
    .substring(0, 16);
  const timestamp = Date.now();
  return `${hashedUserId}/${eventId}/${documentId}/${fileName}/${timestamp}`;
}

export default client;
