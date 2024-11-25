# @joshuaavalon/fastify-plugins

Fastify plugins repository.

Plugins:

- [@joshuaavalon/fastify-plugin-prisma](./packages/prisma)
- [@joshuaavalon/fastify-plugin-storage](./packages/storage)
- [@joshuaavalon/fastify-plugin-typebox](./packages/typebox)

## Design

The default export should be the Fastify plugin.
The plugin options should be exported as `<Name>PluginOptions` where `<Name>` should be the plugin name.
The plugin options should support `logBindings`.
The plugin name should be exported as `name`.
