import { TransformEncode } from "@sinclair/typebox/value";
import { Value } from "@sinclair/typebox/value";
import { ValidationError } from "./error.js";

import type { FastifyInstance } from "fastify";
import type { FastifySerializerCompiler } from "fastify/types/schema.js";
import type { TSchema } from "@sinclair/typebox";

export interface SerializerCompilerFactoryOptions {
  references: TSchema[];
  useDefault: boolean;
}

export function serializerCompilerFactory(opts: SerializerCompilerFactoryOptions): FastifySerializerCompiler<TSchema> {
  const { references, useDefault } = opts;
  return function serializerCompiler(this: FastifyInstance, route) {
    const { schema } = route;
    return input => {
      const cleaned = Value.Clean(schema, references, Value.Clone(input));
      const encoded = TransformEncode(schema, references, cleaned);
      const value = useDefault ? Value.Default(schema, references, encoded) : encoded;
      if (!Value.Check(schema, references, value)) {
        const errors = [...Value.Errors(schema, references, encoded)];
        throw new ValidationError(errors);
      }
      return JSON.stringify(value);
    };
  };
}
