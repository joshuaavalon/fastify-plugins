import fp from "fastify-plugin";
import { fastifyOptions } from "./fastify-options.js";
import { addParseIp } from "./parse-ip.js";
import type { Bindings } from "pino";
import type { FastifyOptions } from "./fastify-options.js";

const name = "@joshuaavalon/fastify-plugin-common";

export type CommonPluginOptions = {
  /**
   * Log bindings for all logs emitted by this plugin.
   * Use boolean to enable or disable log bindings.
   * @defaultValue { plugin: {@link name} }
   */
  logBindings?: Bindings | false;

  /**
   * Determine IP by custom header.
   * `fastify.trustProxy` is required to be `true`.
   */
  realIpHeader?: string;
};

export default fp<CommonPluginOptions>(
  async (app, opts) => {
    const { realIpHeader } = opts;
    app.decorate("fastifyOptions", fastifyOptions);
    addParseIp(app, { realIpHeader });
  },
  {
    dependencies: [],
    fastify: "5.x",
    name
  }
);

declare module "fastify" {
  interface FastifyInstance {
    fastifyOptions: FastifyOptions;
  }
}
