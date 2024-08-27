import type { ValueError } from "@sinclair/typebox/compiler";

export class ValidationError extends Error {
  public readonly fields: ValueError[];

  public constructor(errors: ValueError[]) {
    super("Value does not match schema");
    this.fields = errors;
  }
}
