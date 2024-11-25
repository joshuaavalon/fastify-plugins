import { Type } from "@sinclair/typebox";
import { assert } from "chai";
import fastify from "fastify";
import plugin from "../index.js";

import type { FastifyInstance } from "fastify";

describe("Test @joshuaavalon/fastify-plugin-typebox", () => {
  let app: FastifyInstance;

  before(async () => {
    app = await fastify();
    await app.register(plugin);
    app.post(
      "/",
      {
        schema: {
          body: Type.Object({
            a: Type.Transform(Type.String())
              .Decode(v => Number.parseInt(v))
              .Encode(v => v.toString())
          }),
          response: {
            200: Type.Object({
              a: Type.Transform(Type.String())
                .Decode(v => Number.parseInt(v))
                .Encode(v => v.toString()),
              success: Type.Boolean()
            })
          }
        }
      },
      async (req, res) => {
        const { a } = req.body;
        res.send({ a, b: "a", success: Number.isInteger(a) } as any);
      }
    );
  });

  it("should work", async () => {
    const res = await app.inject({ method: "post", path: "/", payload: { a: "1" } });
    const { a, b, success } = res.json();
    assert.isTrue(success);
    assert.equal(a, "1");
    assert.notExists(b);
  });

  it("should not work", async () => {
    const res = await app.inject({ method: "post", path: "/", payload: { a: 1 } });
    assert.equal(res.statusCode, 400);
  });
});
