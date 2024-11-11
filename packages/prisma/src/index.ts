import { PrismaClient } from "@prisma/client";
import fp from "fastify-plugin";

import type { Prisma } from "@prisma/client";
import type { Bindings } from "pino";

export interface PrismaPluginOptions {

  /**
   * Log bindings for all logs emitted by this plugin.
   * Use boolean to enable or disable log bindings.
   * @defaultValue { plugin: {@link name} }
   */
  logBindings?: Bindings | false;

  /**
   * Database queries logging level.
   * Use boolean to enable or disable all logs.
   * @defaultValue Log `warn` and `error`.
   */
  logLevel?: boolean | Prisma.LogLevel[];

  /**
   * Database connection string.
   * @defaultValue `url` in generated client.
   */
  url?: string;
}

export const name = "@joshuaavalon/fastify-plugin-prisma";

export default fp<PrismaPluginOptions>(
  async (app, opts) => {
    const { logBindings = { plugin: name }, logLevel = ["warn", "error"], url } = opts;
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
      const { duration, params, query, target } = event;
      logger.debug({ duration, params, target }, query);
    });
    db.$on("info", event => {
      const { message, target } = event;
      logger.info({ target }, message);
    });
    db.$on("warn", event => {
      const { message, target } = event;
      logger.warn({ target }, message);
    });
    db.$on("error", event => {
      const { message, target } = event;
      logger.error({ target }, message);
    });

    app.decorate("db", db);
    app.addHook("onClose", async app => {
      await app.db.$disconnect();
    });
  },
  {
    decorators: {},
    dependencies: [],
    fastify: "4.x",
    name
  }
);

declare module "fastify" {
  interface FastifyInstance {
    db: PrismaClient;
  }
}
