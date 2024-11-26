import { assert } from "chai";
import fastify from "fastify";
import plugin from "../index.js";
import type { FastifyInstance } from "fastify";

describe("Test @joshuaavalon/fastify-plugin-common", () => {
  let app: FastifyInstance;

  before(async () => {
    app = await fastify({ trustProxy: true });
    await app.register(plugin, { realIpHeader: "custom-header" });
    app.get(
      "/",
      async (req, res) => {
        res.send({ ip: req.ip, ips: req.ips, opts: req.server.fastifyOptions });
      }
    );
  });

  it("should return custom ip header", async () => {
    const res = await app.inject({
      headers: { "custom-header": "1.1.1.1" },
      method: "get",
      path: "/"
    });
    const { ip } = res.json();
    assert.equal(ip, "1.1.1.1");
  });

  it("should return custom ip header ignore case", async () => {
    const res = await app.inject({
      headers: { "CustoM-header": "1.1.1.1" },
      method: "get",
      path: "/"
    });
    const { ip } = res.json();
    assert.equal(ip, "1.1.1.1");
  });

  it("should return fastifyOptions", async () => {
    const res = await app.inject({
      method: "get",
      path: "/"
    });
    const { opts } = res.json();
    assert.isTrue(opts.trustProxy);
  });
});
