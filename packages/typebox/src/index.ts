import fp from "fastify-plugin";
import { validatorCompilerFactory } from "./validator-compiler.js";
import { serializerCompilerFactory } from "./serializer-compiler.js";

import type { StaticDecode, TSchema } from "@sinclair/typebox";

const name = "@joshuaavalon/fastify-plugin-typebox";

interface Options {
  references?: TSchema[] | undefined;

  /**
   * Use `default` in schema.
   *
   * Default to `true`.
   */
  useDefault?: boolean;

  /**
   * Enable validatorCompiler.
   *
   * Default to `true`.
   */
  validatorCompiler?: boolean;

  /**
   * Enable serializerCompiler.
   *
   * Default to `true`.
   */
  serializerCompiler?: boolean;
}

export default fp<Readonly<Options>>(
  async (app, opts) => {
    const { serializerCompiler = true, validatorCompiler = true, references = [], useDefault = true } = opts;
    if (validatorCompiler) {
      app.setValidatorCompiler(validatorCompilerFactory({ references, useDefault }));
    }
    if (serializerCompiler) {
      app.setSerializerCompiler(serializerCompilerFactory({ references, useDefault }));
    }
  },
  {
    name,
    fastify: "4.x",
    dependencies: []
  }
);

export * from "./error.js";

declare module "fastify" {
  interface FastifyTypeProviderDefault {
    output: this["input"] extends TSchema ? StaticDecode<this["input"]> : unknown;
  }
}
