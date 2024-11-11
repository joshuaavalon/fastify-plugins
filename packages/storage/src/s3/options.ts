import type { S3Client } from "@aws-sdk/client-s3";

export type S3StorageOptions =
  {
    accessKey: string;
    bucket: string;
    endpoint?: string;
    region?: string;
    secretKey: string;
  } | {
    bucket: string;
    client: S3Client;
  };
