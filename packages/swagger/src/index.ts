import swaggerPlugin from "@fastify/swagger";
import scalarPlugin from "@scalar/fastify-api-reference";
import fp from "fastify-plugin";
import type { Bindings } from "pino";

const name = "@joshuaavalon/fastify-plugin-swagger";

export type SwaggerPluginOptions = {
  defaultOpenAllTags?: boolean;
  description: string;

  /**
   * Log bindings for all logs emitted by this plugin.
   * Use boolean to enable or disable log bindings.
   * @defaultValue { plugin: {@link name} }
   */
  logBindings?: Bindings | false;
  routePrefix?: string;
  title: string;
  version: string;
};

export default fp<SwaggerPluginOptions>(
  async (app, opts) => {
    const {
      defaultOpenAllTags = true,
      description,
      routePrefix,
      title,
      version
    } = opts;
    await app.register(swaggerPlugin, {
      openapi: {
        info: { description, title, version },
        openapi: "3.0.0"
      }
    });
    await app.register(scalarPlugin, {
      configuration: {
        defaultOpenAllTags,
        metaData: { title }
      },
      routePrefix
    });
  },
  {
    dependencies: [],
    fastify: "5.x",
    name
  }
);
