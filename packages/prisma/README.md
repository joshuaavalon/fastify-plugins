# @joshuaavalon/fastify-plugin-prisma

## Getting Started

```sh
npm i @joshuaavalon/fastify-plugin-prisma
```

## Usage

```typescript
import prismaPlugin from "@joshuaavalon/fastify-plugin-prisma";

// See PrismaPluginOptions
const opts = {};
await fastify.register(prismaPlugin, opts);

const user = await fastify.db.user.findFirst();
```
