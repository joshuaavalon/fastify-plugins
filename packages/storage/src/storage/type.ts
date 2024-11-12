import type { Readable } from "node:stream";
import type { FastifyBaseLogger } from "fastify";

export interface Storage {
  read(key: string): Promise<StorageOutput>;
  readMetadata(key: string): Promise<StorageMetadataOutput>;
  write(key: string, input: StorageInput): Promise<void>;
}

export interface StorageInput {
  body: Buffer | Readable | string | Uint8Array;
  contentType?: string;
}

export interface StorageMetadataOutput {
  contentLength?: number;
  contentType?: string;
  eTag?: string;
  lastModified?: Date;
}

export interface StorageOutput extends StorageMetadataOutput {
  body: Uint8Array;
}

export interface StorageOptions {
  logger: FastifyBaseLogger;
}
