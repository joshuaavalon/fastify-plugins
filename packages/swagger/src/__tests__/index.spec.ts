import fastify from "fastify";
import plugin from "../index.js";
import type { FastifyInstance } from "fastify";

describe("Test @joshuaavalon/fastify-plugin-swagger", () => {
  let app: FastifyInstance;

  before(async () => {
    app = await fastify();
    await app.register(plugin, { description: "", title: "API", version: "1.0.0" });
  });
});
