# @joshuaavalon/fastify-plugin-swagger

It uses [@fastify/swagger] for generating OpenAPI 3.0 JSON and [@scalar/fastify-api-reference] for the web interface.

It is a wrapper for both plugins and allows to configure common values between plugins.

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

## Options

### title

Title of OpenAPI 3.0.

### version

Version of OpenAPI 3.0.

### description

Description of OpenAPI 3.0.

### logBindings

**Optional**

`logBindings` set the binding for all the log in this plugin.

Default to `{ plugin: "@joshuaavalon/fastify-plugin-swagger" }`.
Set to `false` to disable it.

### defaultOpenAllTags

**Optional**

Open all tags in scalar instead of relevant tag.
Default to `true`.

### routePrefix

**Optional**

Prefix path for Swagger.

[@fastify/swagger]: https://github.com/fastify/fastify-swagger
[@scalar/fastify-api-reference]: https://github.com/scalar/scalar/tree/main/packages/fastify-api-reference
