import fp from "fastify-plugin";
import { PrismaClient } from "@prisma/client";

import type { Bindings } from "pino";
import type { Prisma } from "@prisma/client";

export interface PrismaPluginOptions {

  /**
   * Database connection string.
   * @defaultValue `url` in generated client.
   */
  url?: string;

  /**
   * Database queries logging level.
   * Use boolean to enable or disable all logs.
   * @defaultValue Log `warn` and `error`.
   */
  logLevel?: Prisma.LogLevel[] | boolean;

  /**
   * Log bindings for all logs emitted by this plugin.
   * Use boolean to enable or disable log bindings.
   * @defaultValue { plugin: {@link name} }
   */
  logBindings?: Bindings | false;
}

export const name = "@joshuaavalon/fastify-plugin-prisma";

export default fp<PrismaPluginOptions>(
  async (app, opts) => {
    const { url, logLevel = ["warn", "error"], logBindings = { plugin: name } } = opts;
    const logLevels: Prisma.LogLevel[] = Array.isArray(logLevel)
      ? logLevel
      : logLevel
        ? ["query", "info", "warn", "error"]
        : [];
    const db = new PrismaClient({
      datasourceUrl: url,
      log: logLevels.map(level => ({ emit: "event", level }))
    });
    const logger = logBindings ? app.log.child(logBindings) : app.log;

    db.$on("query", event => {
      const { target, query, params, duration } = event;
      logger.debug({ target, params, duration }, query);
    });
    db.$on("info", event => {
      const { target, message } = event;
      logger.info({ target }, message);
    });
    db.$on("warn", event => {
      const { target, message } = event;
      logger.warn({ target }, message);
    });
    db.$on("error", event => {
      const { target, message } = event;
      logger.error({ target }, message);
    });

    app.decorate("db", db);
    app.addHook("onClose", async app => {
      await app.db.$disconnect();
    });
  },
  {
    name,
    fastify: "4.x",
    dependencies: [],
    decorators: {}
  }
);

declare module "fastify" {
  interface FastifyInstance {
    db: PrismaClient;
  }
}
