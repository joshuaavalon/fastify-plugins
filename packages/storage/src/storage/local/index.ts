import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { Readable } from "node:stream";
import { buffer } from "node:stream/consumers";
import { eTagOf } from "./etag.js";
import type { FastifyBaseLogger } from "fastify";
import type { Storage, StorageInput, StorageMetadataOutput, StorageOptions, StorageOutput } from "../type.js";

interface LocalMetadata {
  contentType?: string;
  eTag?: string;
  isString: boolean;
}

interface LocalStat {
  contentLength: number;
  lastModified: Date;
}

async function toUint8Array(body: StorageInput["body"]): Promise<Uint8Array> {
  if (body instanceof Uint8Array) {
    return body;
  }
  if (Buffer.isBuffer(body)) {
    return new Uint8Array(body);
  }
  if (typeof body === "string") {
    return new Uint8Array(Buffer.from(body, "utf8"));
  }
  if (Readable.isReadable(body)) {
    return new Uint8Array(await buffer(body));
  }
  throw new Error("body must be Buffer or Readable or string or Uint8Array");
}

export interface LocalStorageOptions {
  baseDir: string;
  metadataEncoding?: BufferEncoding;
}

export class LocalStorage implements Storage {
  private readonly baseDir: string;
  private readonly logger: FastifyBaseLogger;
  private readonly contentKey = "content";
  private readonly metadataKey = "metadataKey";
  private readonly metadataEncoding: BufferEncoding;

  public constructor(opts: LocalStorageOptions & StorageOptions) {
    const { baseDir, logger, metadataEncoding = "utf-8" } = opts;
    this.baseDir = baseDir;
    this.logger = logger;
    this.metadataEncoding = metadataEncoding;
  }

  private contentPath(key: string): string {
    return join(this.baseDir, key, this.contentKey);
  }

  private metadataPath(key: string): string {
    return join(this.baseDir, key, this.metadataKey);
  }

  private async readLocalMetadata(key: string): Promise<LocalMetadata> {
    const metadataPath = this.metadataPath(key);
    const metadataString = await readFile(metadataPath, { encoding: this.metadataEncoding });
    try {
      const { contentType, eTag, isString } = JSON.parse(metadataString);
      if (typeof eTag !== "string" && typeof contentType !== "undefined") {
        throw new Error("Invalid contentType");
      }
      if (typeof eTag !== "string" && typeof eTag !== "undefined") {
        throw new Error("Invalid eTag");
      }
      if (typeof isString !== "boolean") {
        throw new Error("Invalid isString");
      }
      return { contentType, eTag, isString };
    } catch {
      this.logger.warn({ key }, "Failed to parse metadata");
      return { isString: false };
    }
  }

  private async readLocalStat(key: string): Promise<LocalStat> {
    const contentPath = this.contentPath(key);
    const stats = await stat(contentPath);
    const lastModified = stats.mtime;
    const contentLength = stats.size;
    return { contentLength, lastModified };
  }

  public async write(key: string, input: StorageInput): Promise<void> {
    this.logger.debug({ key }, "Write file");
    const { body, contentType } = input;
    if (typeof contentType !== "string" && typeof contentType !== "undefined") {
      throw new Error("contentType must be string or undefined");
    }
    const content = await toUint8Array(body);
    const isString = typeof contentType === "string";
    const eTag = eTagOf(content);
    const metadata: LocalMetadata = {
      contentType,
      eTag,
      isString
    };
    const contentPath = this.contentPath(key);
    const metadataPath = this.metadataPath(key);
    await mkdir(dirname(contentPath), { recursive: true });
    await writeFile(contentPath, content, { mode: 0o644 });
    await writeFile(metadataPath, JSON.stringify(metadata), { encoding: this.metadataEncoding, mode: 0o644 });
  }

  public async read(key: string): Promise<StorageOutput> {
    this.logger.debug({ key }, "Read file");
    const contentPath = this.contentPath(key);
    const [body, stats, metadata] = await Promise.all([
      readFile(contentPath),
      this.readLocalStat(key),
      this.readLocalMetadata(key)
    ]);
    const eTag = metadata.eTag ?? eTagOf(body);
    return { ...metadata, ...stats, body, eTag };
  }

  public async readMetadata(key: string): Promise<StorageMetadataOutput> {
    this.logger.debug({ key }, "Read file metadata");
    const [metadata, stats] = await Promise.all([
      this.readLocalMetadata(key),
      this.readLocalStat(key)
    ]);
    return { ...metadata, ...stats };
  }
}
