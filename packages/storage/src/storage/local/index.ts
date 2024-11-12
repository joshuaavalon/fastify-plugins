import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { eTagOf } from "./etag.js";
import type { FastifyBaseLogger } from "fastify";
import type { Storage, StorageInput, StorageMetadataOutput, StorageOptions, StorageOutput } from "../type.js";

export interface LocalStorageOptions {
  baseDir: string;
}

export class LocalStorage implements Storage {
  private readonly baseDir: string;
  private readonly logger: FastifyBaseLogger;

  public constructor(opts: LocalStorageOptions & StorageOptions) {
    const { baseDir, logger } = opts;
    this.baseDir = baseDir;
    this.logger = logger;
  }

  public async write(key: string, input: StorageInput): Promise<void> {
    this.logger.debug({ key }, "Write file");
    const { body } = input;
    const filePath = join(this.baseDir, key);
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, body);
  }

  public async read(key: string): Promise<StorageOutput> {
    this.logger.debug({ key }, "Read file");
    const path = join(this.baseDir, key);
    const [body, stats] = await Promise.all([readFile(path), stat(path)]);
    const lastModified = stats.mtime;
    const contentLength = stats.size;
    const eTag = eTagOf(body);
    return { body, contentLength, eTag, lastModified };
  }

  public async readMetadata(key: string): Promise<StorageMetadataOutput> {
    this.logger.debug({ key }, "Read file metadata");
    const path = join(this.baseDir, key);
    const [body, stats] = await Promise.all([readFile(path), stat(path)]);
    const lastModified = stats.mtime;
    const contentLength = stats.size;
    const eTag = eTagOf(body);
    return { contentLength, eTag, lastModified };
  }
}
