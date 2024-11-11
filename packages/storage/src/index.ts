import fp from "fastify-plugin";
import { LocalStorage } from "./local/index.js";
import { S3Storage } from "./s3/index.js";

import type { StoragePluginOptions } from "./options.js";
import type { Storage } from "./type.js";

export type { StoragePluginOptions } from "./options.js";

const name = "@joshuaavalon/fastify-plugin-storage";
export default fp<StoragePluginOptions>(
  async (app, opts) => {
    const { type } = opts;
    let storage: Storage;
    switch (type) {
      case "local":
        storage = new LocalStorage(opts);
        break;
      case "s3":
        storage = new S3Storage(opts);
        break;
      default:
        throw new Error(`Unknown storage type (${type})`);
    }
    app.decorate("storage", storage);
  },
  {
    decorators: {},
    dependencies: [],
    fastify: "4.x",
    name
  }
);

declare module "fastify" {
  interface FastifyInstance {
    storage: Storage;
  }
}
