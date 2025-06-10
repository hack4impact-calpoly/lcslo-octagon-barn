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
 * Generates a unique S3 key for a file based on event name, document name, and filename
 * Format: eventName/documentName/fileName_timestamp
 *
 * @param eventName - The name of the event (used as first folder)
 * @param documentName - The logical document name (used as second folder)
 * @param fileName - Original filename
 * @returns A unique S3 key string
 */
export function generateUniqueS3Key(eventName: string, documentName: string, fileName: string): string {
  const timestamp = Date.now();
  return `${eventName}/${documentName}/${fileName}_${timestamp}`;
}

export default client;
