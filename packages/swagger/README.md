# @joshuaavalon/fastify-plugin-typebox

It uses `@sinclair/typebox` to handle validation and serialization.

## Getting Started

> This is a ESM only module. You must be using ESM in order to use this.

```sh
npm install @joshuaavalon/fastify-plugin-typebox
```

The payload of the request and response (JSON) are considered as encoded type in terms of Typebox transform.
This means the based types should be JSON type instead internal type.

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
