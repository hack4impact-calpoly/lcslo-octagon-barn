import { S3Client } from "@aws-sdk/client-s3";

const client = new S3Client({
  region: process.env.S3_BUCKET_REGION as string,
  credentials: {
    accessKeyId: process.env.S3_BUCKET_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.S3_BUCKET_SECRET_ACCESS_KEY as string,
  },
});

export default client;
