export class MissingUserError extends Error {
  public constructor() {
    super("Required user but it is missing from request");
  }
}
