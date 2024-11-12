import { GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import type { FastifyBaseLogger } from "fastify";
import type { Storage, StorageInput, StorageMetadataOutput, StorageOptions, StorageOutput } from "../type.js";

export interface S3StorageConfigOptions {
  accessKey: string;
  bucket: string;
  endpoint?: string;
  region?: string;
  secretKey: string;
}

export interface S3StorageInstanceOptions {
  bucket: string;
  client: S3Client;
}

export type S3StorageOptions = S3StorageConfigOptions | S3StorageInstanceOptions;


export class S3Storage implements Storage {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly logger: FastifyBaseLogger;

  public constructor(opts: S3StorageOptions & StorageOptions) {
    const { bucket, logger } = opts;
    this.bucket = bucket;
    this.logger = logger;
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
    this.logger.debug({ key }, "Write file");
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
    this.logger.debug({ key }, "Read file");
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
    this.logger.debug({ key }, "Read file metadata");
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
