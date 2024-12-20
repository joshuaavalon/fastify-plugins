import { TransformEncode } from "@sinclair/typebox/value";
import { Value } from "@sinclair/typebox/value";
import { ValidationError } from "./error.js";
import type { TSchema } from "@sinclair/typebox";
import type { FastifyBaseLogger, FastifyInstance } from "fastify";
import type { FastifySerializerCompiler } from "fastify/types/schema.js";

export interface SerializerCompilerFactoryOptions {
  logger: FastifyBaseLogger;
  references: TSchema[];
  useDefault: boolean;
}

export function serializerCompilerFactory(opts: SerializerCompilerFactoryOptions): FastifySerializerCompiler<TSchema> {
  const { logger, references, useDefault } = opts;
  return function serializerCompiler(this: FastifyInstance, route) {
    const { schema } = route;
    return input => {
      const cleaned = Value.Clean(schema, references, Value.Clone(input));
      const encoded = TransformEncode(schema, references, cleaned);
      const value = useDefault ? Value.Default(schema, references, encoded) : encoded;
      logger.debug({ input, schema, useDefault, value }, "Serialize response");
      if (!Value.Check(schema, references, value)) {
        const errors = [...Value.Errors(schema, references, encoded)];
        throw new ValidationError(errors);
      }
      return JSON.stringify(value);
    };
  };
}
