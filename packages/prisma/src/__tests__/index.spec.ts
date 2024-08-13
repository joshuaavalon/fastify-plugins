import { assert } from "chai";
import { fastify } from "fastify";
import plugin from "../index.js";

describe("Test @joshuaavalon/fastify-plugin-prisma", async () => {
  it("should able to use db", async () => {
    const app = fastify();
    await app.register(plugin);
    app.get("/test", async function (req, res) {
      const data = await this.db.user.findMany();
      res.send(data);
    });
    const res = await app.inject({ path: "/test", method: "get" });
    console.log(res.body);
    assert.deepEqual(res.json(), []);
  });
});
