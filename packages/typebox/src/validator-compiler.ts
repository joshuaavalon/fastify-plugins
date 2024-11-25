import { Value } from "@sinclair/typebox/value";
import { ValidationError } from "./error.js";
import type { TSchema } from "@sinclair/typebox";
import type { FastifyBaseLogger } from "fastify";
import type { FastifyInstance, FastifySchemaCompiler } from "fastify";


export interface ValidatorCompilerFactoryOptions {
  logger: FastifyBaseLogger;
  references: TSchema[];
  useDefault: boolean;
}

export function validatorCompilerFactory(opts: ValidatorCompilerFactoryOptions): FastifySchemaCompiler<TSchema> {
  const { logger, references, useDefault } = opts;
  return function validatorCompiler(this: FastifyInstance, route) {
    const { schema } = route;
    return input => {
      const value = useDefault ? Value.Default(schema, references, input) : input;
      logger.debug({ input, schema, useDefault, value }, "Validate request");
      try {
        return { value: Value.Decode(schema, references, value) };
      } catch (_e) {
        const errors = [...Value.Errors(schema, references, value)];
        return { error: new ValidationError(errors) };
      }
    };
  };
}
