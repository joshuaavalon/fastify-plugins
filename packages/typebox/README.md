# @joshuaavalon/fastify-plugin-typebox

It uses `@sinclair/typebox` to handle validation and serialization.

## Getting Started

> This is a ESM only module. You must be using ESM in order to use this.

```sh
npm install @joshuaavalon/fastify-plugin-typebox
```

```ts
import fastify from "fastify";
import fileRoutesPlugin from "@joshuaavalon/fastify-plugin-typebox";

const app = await fastify();
await app.register(plugin);
app.post(
  "/",
  {
    schema: {
      body: Type.Object({
        a: Type.Transform(Type.String())
          .Decode((v) => Number.parseInt(v))
          .Encode((v) => v.toString())
      }),
      response: {
        200: Type.Object({
          success: Type.Boolean(),
          a: Type.Transform(Type.String())
            .Decode((v) => Number.parseInt(v))
            .Encode((v) => v.toString())
        })
      }
    }
  },
  async function handler(req, res) {
    const { a } = req.body;
    res.send({ success: Number.isInteger(a), a });
  }
);
```

```ts
import type { StaticDecode, TSchema } from "@sinclair/typebox";

declare module "fastify" {
  interface FastifyTypeProviderDefault {
    output: this["input"] extends TSchema
      ? StaticDecode<this["input"]>
      : unknown;
  }
}
```
