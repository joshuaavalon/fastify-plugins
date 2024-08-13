import { dirname, join } from "node:path";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { eTagOf } from "./etag.js";

import type { LocalStorageOptions } from "./options.js";
import type {
  Storage,
  StorageInput,
  StorageMetadataOutput,
  StorageOutput
} from "../type.js";

export * from "./options.js";
export class LocalStorage implements Storage {
  private readonly baseDir: string;

  public constructor(opts: LocalStorageOptions) {
    const { baseDir } = opts;
    this.baseDir = baseDir;
  }

  public async write(key: string, input: StorageInput): Promise<void> {
    const { body } = input;
    const filePath = join(this.baseDir, key);
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, body);
  }

  public async read(key: string): Promise<StorageOutput> {
    const path = join(this.baseDir, key);
    const [body, stats] = await Promise.all([readFile(path), stat(path)]);
    const lastModified = stats.mtime;
    const contentLength = stats.size;
    const eTag = eTagOf(body);
    return { body, contentLength, eTag, lastModified };
  }

  public async readMetadata(key: string): Promise<StorageMetadataOutput> {
    const path = join(this.baseDir, key);
    const [body, stats] = await Promise.all([readFile(path), stat(path)]);
    const lastModified = stats.mtime;
    const contentLength = stats.size;
    const eTag = eTagOf(body);
    return { contentLength, eTag, lastModified };
  }
}
