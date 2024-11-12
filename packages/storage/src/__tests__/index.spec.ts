import { fastify } from "fastify";
import plugin from "../index.js";
import type { Storage } from "../storage/index.js";

describe("Test @joshuaavalon/fastify-plugin-storage", async () => {
  it("should register", async () => {
    const app = fastify();
    await app.register(plugin, { storage: { name: { baseDir: "", type: "local" } } });
  });
});

declare module "@joshuaavalon/fastify-plugin-storage" {
  interface FastifyStorage {
    name: Storage;
  }
}
