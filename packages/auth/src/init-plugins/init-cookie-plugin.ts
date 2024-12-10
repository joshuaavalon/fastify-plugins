import cookiePlugin from "@fastify/cookie";
import type { FastifyCookieOptions } from "@fastify/cookie";
import type { FastifyInstance } from "fastify";

export type InitCookiePluginOptions = boolean | FastifyCookieOptions;

export async function initCookiePlugin(app: FastifyInstance, opts: InitCookiePluginOptions): Promise<void> {
  if (!opts) {
    return;
  }
  if (opts === true) {
    await app.register(cookiePlugin);
  } else {
    await app.register(cookiePlugin, opts);
  }
}
