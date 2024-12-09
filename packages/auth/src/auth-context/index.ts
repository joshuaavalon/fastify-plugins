import { AuthContext } from "./context.js";
import type { FastifyBaseLogger, FastifyInstance } from "fastify";
import type { AuthContextOptions } from "./context.js";

export * from "./context.js";

const authSymbol = Symbol("authContext");


export type AddAuthContextOptions = {
  authContext: AuthContextOptions;
  logger: FastifyBaseLogger;
};

export function addAuthContext(app: FastifyInstance, opts: AddAuthContextOptions): void {
  const { authContext } = opts;
  app.decorateRequest("auth", {
    getter() {
      return this[authSymbol];
    }
  });
  app.addHook("onRequest", async req => {
    req[authSymbol] = new AuthContext(req, authContext);
  });
}

declare module "fastify" {
  interface FastifyRequest {
    [authSymbol]: AuthContext;
  }
}
