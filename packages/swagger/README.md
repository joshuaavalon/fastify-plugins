# @joshuaavalon/fastify-plugin-swagger

## Getting Started

> This is a ESM only module. You must be using ESM in order to use this.

```sh
npm install @joshuaavalon/fastify-plugin-swagger
```

The payload of the request and response (JSON) are considered as encoded type in terms of Typebox transform.
This means the based types should be JSON type instead internal type.

```ts
import fastify from "fastify";
import swaggerPlugin from "@joshuaavalon/fastify-plugin-swagger";

const app = await fastify();
await app.register(swaggerPlugin, {
  description: "",
  title: "API",
  version: "1.0.0",
  routePrefix: "/api"
});
```
