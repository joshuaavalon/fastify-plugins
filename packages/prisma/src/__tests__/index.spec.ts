import { assert } from "chai";
import { fastify } from "fastify";
import plugin from "../index.js";

describe("Test @joshuaavalon/fastify-plugin-prisma", async () => {
  it("should able to use db", async () => {
    const app = fastify();
    await app.register(plugin);
    app.get("/test", async function (_req, res) {
      const data = await this.db.user.findMany();
      res.send(data);
    });
    const res = await app.inject({ method: "get", path: "/test" });
    assert.deepEqual(res.json(), []);
  });
});
