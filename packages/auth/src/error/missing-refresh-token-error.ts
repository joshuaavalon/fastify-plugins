export class MissingRefreshTokenError extends Error {
  public constructor() {
    super("Required refresh token but it is missing from request");
  }
}
