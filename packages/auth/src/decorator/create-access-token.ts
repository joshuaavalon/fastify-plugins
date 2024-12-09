import { MissingRefreshTokenError } from "#error";
import type { FastifyReply } from "fastify";

export async function createAccessToken(this: FastifyReply): Promise<string> {
  const req = this.request;
  const userToken = req.refreshSession.userToken;
  if (!userToken) {
    throw new MissingRefreshTokenError();
  }
  req.session.set("userToken", userToken);
  return userToken;
}
