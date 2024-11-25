import { PrismaClient } from "@prisma/client";
import fp from "fastify-plugin";
import { LogLevel, mapLogLevel } from "./log-level.js";
import type { Bindings } from "pino";
import type { LogLevels } from "./log-level.js";

export { LogLevel } from "./log-level.js";

export type PrismaPluginOptions = {

  /**
   * Log bindings for all logs emitted by this plugin.
   * Use boolean to enable or disable log bindings.
   * @defaultValue { plugin: {@link name} }
   */
  logBindings?: Bindings | false;

  /**
   * Database queries logging level.
   * Use `LogLevel` or `LogLevel[]`.
   *
   * `LogLevel` enable logging for log level equal or above.
   * For example, `LogLevel.warn` logs warn and error.
   *
   * `LogLevel[]` enable logging for log level equal.
   * For example, `[LogLevel.warn]` logs warn only.
   * @defaultValue {@link LogLevel.warn}.
   */
  logLevel?: LogLevels;

  /**
   * Database connection string.
   * @defaultValue `url` in generated client.
   */
  url?: string;
};

export const name = "@joshuaavalon/fastify-plugin-prisma";


export default fp<PrismaPluginOptions>(
  async (app, opts) => {
    const { logBindings = { plugin: name }, logLevel = LogLevel.warn, url } = opts;
    const logLevels = mapLogLevel(logLevel);
    const db = new PrismaClient({
      datasourceUrl: url,
      log: logLevels.map(level => ({ emit: "event", level }))
    });
    const logger = logBindings ? app.log.child(logBindings) : app.log;

    for (const logLevel of logLevels) {
      if (logLevel === "query") {
        db.$on("query", event => {
          const { duration, params, query, target } = event;
          logger.debug({ duration, params, target }, query);
        });
      }
      if (logLevel === "info") {
        db.$on("info", event => {
          const { message, target } = event;
          logger.info({ target }, message);
        });
      }
      if (logLevel === "warn") {
        db.$on("warn", event => {
          const { message, target } = event;
          logger.warn({ target }, message);
        });
      }
      if (logLevel === "error") {
        db.$on("error", event => {
          const { message, target } = event;
          logger.error({ target }, message);
        });
      }
    }

    app.decorate("db", db);
    app.addHook("onClose", async app => {
      await app.db.$disconnect();
    });
  },
  {
    decorators: {},
    dependencies: [],
    fastify: "5.x",
    name
  }
);

declare module "fastify" {
  interface FastifyInstance {
    db: PrismaClient;
  }
}
