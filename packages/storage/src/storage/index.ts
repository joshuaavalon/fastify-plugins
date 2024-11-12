import { LocalStorage } from "./local/index.js";
import { S3Storage } from "./s3/index.js";
import type { FastifyBaseLogger } from "fastify";
import type { LocalStorageOptions } from "./local/index.js";
import type { S3StorageOptions } from "./s3/index.js";
import type { Storage } from "./type.js";

export type * from "./type.js";
export type StorageOptions =
  | ({ type: "local" } & LocalStorageOptions)
  | ({ type: "s3" } & S3StorageOptions);


export interface FastifyStorage {
}

type KeyOfType<T, V> = keyof { [ P in keyof T as T[P] extends V ? P : never ]: P };
type FastifyStorageName = KeyOfType<FastifyStorage, Storage>;

export type CreateStorageOptions = Record<FastifyStorageName, StorageOptions>;

function createStorage(opts: StorageOptions, logger: FastifyBaseLogger): Storage {
  const { type } = opts;
  switch (type) {
    case "local":
      return new LocalStorage({ ...opts, logger });
    case "s3":
      return new S3Storage({ ...opts, logger });
    default:
      throw new Error(`Unknown storage type (${type})`);
  }
}

export function createFastifyStorage(opts: CreateStorageOptions, logger: FastifyBaseLogger): FastifyStorage {
  const storage: Partial<FastifyStorage> = {};
  for (const [key, storageOpts] of Object.entries<StorageOptions>(opts)) {
    const name = key as FastifyStorageName;
    logger.info({ name, type: storageOpts.type }, "Initialize storage");
    storage[name] = createStorage(storageOpts, logger);
  }
  return storage as FastifyStorage;
}
