import { MissingRefreshTokenError, MissingUserError } from "#error";
import type { FastifyInstance, FastifyRequest } from "fastify";

export interface AuthContextConfig {

}

export interface AuthUser {
}

export interface CreateUserTokenOptions {

}

export type AuthContextOptions = {
  createAbility: (user: AuthUser | null) => Promise<AuthContextConfig["ability"]>;
  createUserToken: (app: FastifyInstance, user: AuthUser, opts: CreateUserTokenOptions) => Promise<string>;
  findUser: (app: FastifyInstance, userToken: string) => Promise<AuthUser | null>;
};

export class AuthContext {
  private readonly req: FastifyRequest;
  private readonly app: FastifyInstance;
  private readonly opts: AuthContextOptions;
  private user?: AuthUser | null;

  public constructor(req: FastifyRequest, opts: AuthContextOptions) {
    this.req = req;
    this.app = req.server;
    this.opts = opts;
  }

  public async getUser(): Promise<AuthUser | null> {
    if (this.user || this.user === null) {
      return this.user;
    }
    const userToken = this.req.session.userToken;
    if (!userToken) {
      return null;
    }
    const user = await this.opts.findUser(this.app, userToken);
    this.user = user;
    return user;
  }

  public setUser(user: AuthUser): void {
    this.user = user;
  }

  public async getAbility(): Promise<AuthContextConfig["ability"]> {
    const user = await this.getUser();
    return await this.opts.createAbility(user);
  }

  public async setRefreshToken(opts: CreateUserTokenOptions): Promise<void> {
    const user = await this.getUser();
    if (!user) {
      throw new MissingUserError();
    }
    const userToken = await this.opts.createUserToken(this.app, user, opts);
    this.req.refreshSession.set("userToken", userToken);
  }

  public async setAccessToken(): Promise<void> {
    const req = this.req;
    const userToken = req.refreshSession.userToken;
    if (!userToken) {
      throw new MissingRefreshTokenError();
    }
    req.session.set("userToken", userToken);
  }
}
