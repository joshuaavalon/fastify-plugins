import { randomBytes, randomUUID } from "node:crypto";
import { assert } from "chai";
import { fastify } from "fastify";
import { S3Storage } from "../index.js";

describe("Test @joshuaavalon/fastify-plugin-storage", async () => {
  describe("Test S3Storage", async () => {
    let storage: S3Storage;

    before(async () => {
      const app = fastify();
      storage = new S3Storage({
        accessKey: "minioadmin",
        bucket: "bucket",
        endpoint: "http://127.0.0.1:9000",
        logger: app.log,
        secretKey: "minioadmin"
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
