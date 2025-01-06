import { Argon2PasswordHandler } from "./argon2-handler.js";
import type { FastifyInstance } from "fastify";
import type { PasswordHandler } from "./type.js";

const passwordHandlerSymbol = Symbol("passwordHandler");

export type PasswordAlgorithm = "Argon2";

export async function initPasswordHandler(app: FastifyInstance, algorithm: PasswordAlgorithm): Promise<void> {
  let passwordHandler: PasswordHandler;
  switch (algorithm) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    case "Argon2":
      passwordHandler = new Argon2PasswordHandler();
      break;
    default:
      throw new Error(`Unknown password algorithm (${algorithm})`);
  }
  app.decorate(passwordHandlerSymbol, passwordHandler);
  app.decorate("hashPassword", function (password) {
    return this[passwordHandlerSymbol].hashPassword(password);
  });
  app.decorate("verifyPassword", function (hash: Buffer, password: string) {
    return this[passwordHandlerSymbol].verifyPassword(hash, password);
  });
}


declare module "fastify" {
  interface FastifyInstance {
    [passwordHandlerSymbol]: PasswordHandler;
  }
}
