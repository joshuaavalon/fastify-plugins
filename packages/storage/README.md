# @joshuaavalon/fastify-plugin-storage

## Getting Started

```sh
npm i @joshuaavalon/fastify-plugin-storage
```

## Usage

```typescript
import storagePlugin from "@joshuaavalon/fastify-plugin-storage";
import type { Storage } from "@joshuaavalon/fastify-plugin-storage";

declare module "@joshuaavalon/fastify-plugin-storage" {
  interface FastifyStorage {
    name: Storage;
  }
}

await fastify.register(storagePlugin, {
  storage: {
    name: {
      type: "S3"
    }
  }
});

await fastify.storage.write({ body: buffer, contentType: mime });
```
