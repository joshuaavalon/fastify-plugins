import { assert } from "chai";
import fastify from "fastify";
import { Type } from "@sinclair/typebox";
import plugin from "../index.js";

import type { FastifyInstance } from "fastify";

describe("Test plugin", () => {
  let app: FastifyInstance;

  before(async () => {
    app = await fastify();
    await app.register(plugin);
    app.post(
      "/",
      {
        schema: {
          body: Type.Object({
            a: Type.Transform(Type.String()).Decode(v => Number.parseInt(v))
              .Encode(v => v.toString())
          }),
          response: {
            200: Type.Object({
              success: Type.Boolean(),
              a: Type.Transform(Type.String()).Decode(v => Number.parseInt(v))
                .Encode(v => v.toString())
            })
          }
        }
      },
      async (req, res) => {
        const { a } = req.body;
        res.send({ success: Number.isInteger(a), a, b: "a" } as any);
      }
    );
  });

  it("should work", async () => {
    const res = await app.inject({ path: "/", method: "post", payload: { a: "1" } });
    const { success, a, b } = res.json();
    assert.isTrue(success);
    assert.equal(a, "1");
    assert.notExists(b);
  });

  it("should not work", async () => {
    const res = await app.inject({ path: "/", method: "post", payload: { a: 1 } });
    assert.equal(res.statusCode, 400);
  });
});
