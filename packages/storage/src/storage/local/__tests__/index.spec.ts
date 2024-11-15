import { randomBytes, randomUUID } from "node:crypto";
import { tmpdir } from "node:os";
import { assert } from "chai";
import { fastify } from "fastify";
import { LocalStorage } from "../index.js";

describe("Test @joshuaavalon/fastify-plugin-storage", async () => {
  describe("Test LocalStorage", async () => {
    let storage: LocalStorage;

    before(async () => {
      const app = fastify();
      storage = new LocalStorage({
        baseDir: process.env.RUNNER_TEMP ?? tmpdir(),
        logger: app.log
      });
    });

    it("should write and read equals", async () => {
      const expected = new Uint8Array(randomBytes(32));
      const key = randomUUID();
      await storage.write(key, { body: expected });
      const result = await storage.read(key);
      assert.deepEqual(result.body, expected);
    });

    it("should write and read metadata equals", async () => {
      const body = new Uint8Array(randomBytes(32));
      const key = randomUUID();
      const expected = "image/jpeg";
      await storage.write(key, { body, contentType: expected });
      const result = await storage.readMetadata(key);
      assert.equal(result.contentType, expected);
    });
  });
});
