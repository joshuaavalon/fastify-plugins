import sessionPlugin from "@fastify/secure-session";
import { Duration } from "luxon";
import type { SecureSessionPluginOptions } from "@fastify/secure-session";
import type { FastifyInstance } from "fastify";

type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never;
type SessionOptions = { expiry?: Duration<true> } & DistributiveOmit<SecureSessionPluginOptions, "cookie" | "expiry" | "sessionName">;

export type InitSessionPluginOptions = {
  refreshSession: SessionOptions;
  session: SessionOptions;
} | false;

function createRefreshSessionOptions(opts: SessionOptions): Required<Pick<SecureSessionPluginOptions, "sessionName">> & SecureSessionPluginOptions {
  const { expiry = Duration.fromObject({ days: 30 }), ...others } = opts;
  const expiryTime = expiry.as("seconds");
  return {
    ...others,
    cookie: {
      httpOnly: true,
      maxAge: expiryTime,
      path: "/",
      sameSite: "strict",
      secure: "auto"
    },
    sessionName: "refreshSession"
  };
}

function createSessionOptions(opts: SessionOptions): Required<Pick<SecureSessionPluginOptions, "sessionName">> & SecureSessionPluginOptions {
  const { expiry = Duration.fromObject({ minutes: 5 }), ...others } = opts;
  const expiryTime = expiry.as("seconds");
  return {
    ...others,
    cookie: {
      httpOnly: true,
      maxAge: expiryTime,
      path: "/",
      sameSite: "strict",
      secure: "auto"
    },
    sessionName: "session"
  };
}

export async function initSessionPlugin(app: FastifyInstance, opts: InitSessionPluginOptions): Promise<void> {
  if (!opts) {
    return;
  }
  const { refreshSession, session } = opts;
  await app.register(sessionPlugin, [
    createRefreshSessionOptions(refreshSession),
    createSessionOptions(session)
  ]);
}
