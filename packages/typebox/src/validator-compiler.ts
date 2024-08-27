import { Value } from "@sinclair/typebox/value";
import { ValidationError } from "./error.js";

import type { FastifyInstance, FastifySchemaCompiler } from "fastify";
import type { TSchema } from "@sinclair/typebox";


export interface ValidatorCompilerFactoryOptions {
  references: TSchema[];
  useDefault: boolean;
}

export function validatorCompilerFactory(opts: ValidatorCompilerFactoryOptions): FastifySchemaCompiler<TSchema> {
  const { references, useDefault } = opts;
  return function validatorCompiler(this: FastifyInstance, route) {
    const { schema } = route;
    return input => {
      const value = useDefault ? Value.Default(schema, references, input) : input;
      try {
        return { value: Value.Decode(schema, references, value) };
      } catch (_e) {
        const errors = [...Value.Errors(schema, references, value)];
        return { error: new ValidationError(errors) };
      }
    };
  };
}
