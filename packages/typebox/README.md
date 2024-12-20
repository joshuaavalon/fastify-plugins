# @joshuaavalon/fastify-plugin-typebox

It uses [@sinclair/typebox] to handle validation and serialization.
It adds support via [validatorCompiler] and [serializerCompiler].

Since [@sinclair/typebox] provides type-safe JSON schema, this plugin allows type-safe in request and response payload.

## Getting Started

> This is a ESM only module. You must be using ESM in order to use this.

Install the package via your package manager.

```sh
npm install @joshuaavalon/fastify-plugin-typebox
```

Register the plugin to fastify

```ts
import fastify from "fastify";
import typeboxPlugin from "@joshuaavalon/fastify-plugin-typebox";

const app = await fastify();
await app.register(typeboxPlugin);
```

## Options

### logBindings

**Optional**

`logBindings` set the binding for all the log in this plugin.

Default to `{ plugin: "@joshuaavalon/fastify-plugin-typebox" }`.
Set to `false` to disable it.

### references

**Optional**

`references` is referenced schemas (`$ref`).
It is not recommended to use because it does not support type-safe data.

### useDefault

**Optional**

`useDefault` is setting if `default` in JSON schema should be populated automatically.

Default to `true`.

## Serialization

The payload of the request and response payload (JSON) are considered as encoded type in terms of Typebox transform.
This means the based types should be JSON type instead internal type.

For example, if you want to create use ISO8601 as date time format for you JSON but parsed `DateTime` internally:

```ts
import { FormatRegistry, Type } from "@sinclair/typebox";
import { DateTime } from "luxon";

FormatRegistry.Set("date-time", (value) => DateTime.fromISO(value).isValid);

export const dateTimeSchema = Type.Transform(
  Type.String({
    description: "Date time in ISO8601 format",
    example: "2000-01-01T00:00:00+00:00",
    format: "date-time"
  })
)
  .Decode((value) => DateTime.fromISO(value, { zone: "UTC" }).toJSDate())
  .Encode((value) => value.toISOString());
```

## Usage

```ts
import fastify from "fastify";
import { DateTime } from "luxon";
import typeboxPlugin from "@joshuaavalon/fastify-plugin-typebox";
import { dateTimeSchema } from "#schema";

const app = await fastify();
await app.register(typeboxPlugin);

const payloadSchema = Type.Object({
  value: Type.Transform(Type.String())
    .Decode((v) => Number.parseInt(v))
    .Encode((v) => v.toString())
});

app.post(
  "/",
  {
    schema: {
      body: payloadSchema,
      response: {
        200: Type.Object({
          success: Type.Boolean(),
          createdAt: dateTimeSchema
        })
      }
    }
  },
  async function handler(req, res) {
    const { value } = req.body;
    res.send({
      success: Number.isInteger(value),
      createdAt: DateTime.now()
    });
  }
);
```

### Error

When validation failed, `ValidationError` is thrown.

[@sinclair/typebox]: https://github.com/sinclairzx81/typebox
[validatorCompiler]: https://fastify.dev/docs/latest/Reference/Server/#validatorcompiler
[serializerCompiler]: https://fastify.dev/docs/latest/Reference/Server/#serializercompiler
