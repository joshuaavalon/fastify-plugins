import fp from "fastify-plugin";
import { addAuthContext } from "./auth-context/index.js";
import type { RefreshSessionData, Session } from "@fastify/secure-session";
import type { FastifyInstance } from "fastify";
import type { DateTime, Duration } from "luxon";
import type { Bindings } from "pino";
import type { AuthContext, AuthContextOptions, AuthUser } from "./auth-context/index.js";

export type { AuthContextConfig } from "./auth-context/index.js";
export { AuthContext } from "./auth-context/index.js";

const name = "@joshuaavalon/fastify-plugin-auth";

export type RefreshTokenOptions = {

  /**
   * Generate a refresh token.
   * It should be persisted in database.
   */
  generate: (app: FastifyInstance, user: AuthUser, expiredAt: DateTime<true> | null) => Promise<string>;
};

export type AuthPluginOptions = {
  /**
   * It should be shorter than refresh token expire duration.
   *
   * Default to 5 minutes.
   */
  accessTokenExpiration?: Duration;

  /**
   * Log bindings for all logs emitted by this plugin.
   * Use boolean to enable or disable log bindings.
   * @defaultValue { plugin: {@link name} }
   */
  logBindings?: Bindings | false;

  /**
   * If it is set to `null`, it will never expire.
   *
   * Default to 30 days.
   */
  refreshTokenExpiration?: Duration | null;
} & AuthContextOptions;

export default fp<AuthPluginOptions>(
  async (app, opts) => {
    const { createAbility, createUserToken, findUser, logBindings = { plugin: name } } = opts;
    const logger = logBindings ? app.log.child(logBindings) : app.log;
    addAuthContext(app, { authContext: { createAbility, createUserToken, findUser }, logger });
  },
  {
    decorators: { request: ["session", "refreshSession"] },
    fastify: "5.x",
    name
  }
);

declare module "fastify" {
  interface FastifyRequest {
    readonly auth: AuthContext;
    refreshSession: Session<RefreshSessionData>;
  }
}

declare module "@fastify/secure-session" {
  interface SessionData {
    userToken?: string;
  }

  interface RefreshSessionData {
    userToken?: string;
  }
}
