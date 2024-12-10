import { initCookiePlugin } from "./init-cookie-plugin.js";
import { initSessionPlugin } from "./init-session-plugin.js";
import type { FastifyInstance } from "fastify";
import type { InitCookiePluginOptions } from "./init-cookie-plugin.js";
import type { InitSessionPluginOptions } from "./init-session-plugin.js";

export type InitPluginsOptions = {
  initCookieOpts?: InitCookiePluginOptions;
  initSessionOpts?: InitSessionPluginOptions;
};

export async function initPlugins(app: FastifyInstance, opts: InitPluginsOptions): Promise<void> {
  const { initCookieOpts = false, initSessionOpts = false } = opts;
  await initCookiePlugin(app, initCookieOpts);
  await initSessionPlugin(app, initSessionOpts);
}
