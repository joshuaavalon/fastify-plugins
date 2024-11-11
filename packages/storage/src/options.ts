import type { LocalStorageOptions } from "./local/index.js";
import type { S3StorageOptions } from "./s3/index.js";

export type StoragePluginOptions =
  | ({ type: "local" } & LocalStorageOptions)
  | ({ type: "s3" } & S3StorageOptions);
