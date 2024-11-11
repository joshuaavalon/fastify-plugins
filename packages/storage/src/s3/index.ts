import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client
} from "@aws-sdk/client-s3";

import type {
  Storage,
  StorageInput,
  StorageMetadataOutput,
  StorageOutput
} from "../type.js";
import type { S3StorageOptions } from "./options.js";

export type * from "./options.js";
export class S3Storage implements Storage {
  private readonly client: S3Client;
  private readonly bucket: string;

  public constructor(opts: S3StorageOptions) {
    const { bucket } = opts;
    this.bucket = bucket;
    if ("client" in opts) {
      this.client = opts.client;
    } else {
      const {
        accessKey: accessKeyId,
        endpoint,
        region,
        secretKey: secretAccessKey
      } = opts;
      this.client = new S3Client({
        credentials: {
          accessKeyId,
          secretAccessKey
        },
        endpoint,
        forcePathStyle: true,
        region
      });
    }
  }

  public async write(key: string, input: StorageInput): Promise<void> {
    const { body, contentType } = input;
    const cmd = new PutObjectCommand({
      Body: body,
      Bucket: this.bucket,
      ContentType: contentType,
      Key: key
    });
    await this.client.send(cmd);
  }

  public async read(key: string): Promise<StorageOutput> {
    const cmd = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key
    });
    const res = await this.client.send(cmd);
    const body = await res.Body?.transformToByteArray() ?? new Uint8Array();
    return {
      body,
      contentLength: res.ContentLength,
      contentType: res.ContentType,
      eTag: res.ETag,
      lastModified: res.LastModified
    };
  }

  public async readMetadata(key: string): Promise<StorageMetadataOutput> {
    const cmd = new HeadObjectCommand({
      Bucket: this.bucket,
      Key: key
    });
    const res = await this.client.send(cmd);
    return {
      contentLength: res.ContentLength,
      contentType: res.ContentType,
      eTag: res.ETag,
      lastModified: res.LastModified
    };
  }
}
