# @joshuaavalon/fastify-plugin-storage

## Getting Started

```sh
npm i @joshuaavalon/fastify-plugin-storage
```

## Usage

```typescript
import storagePlugin from "@joshuaavalon/fastify-plugin-storage";
await fastify.register(storagePlugin, opts);

await fastify.storage.write({ body: buffer, contentType: mime });
```

## Options
