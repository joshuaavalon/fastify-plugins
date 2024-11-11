import fp from "fastify-plugin";
import { serializerCompilerFactory } from "./serializer-compiler.js";
import { validatorCompilerFactory } from "./validator-compiler.js";

import type { StaticDecode, TSchema } from "@sinclair/typebox";

const name = "@joshuaavalon/fastify-plugin-typebox";

interface Options {
  references?: TSchema[] | undefined;

  /**
   * Enable serializerCompiler.
   *
   * Default to `true`.
   */
  serializerCompiler?: boolean;

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
}

export default fp<Readonly<Options>>(
  async (app, opts) => {
    const { references = [], serializerCompiler = true, useDefault = true, validatorCompiler = true } = opts;
    if (validatorCompiler) {
      app.setValidatorCompiler(validatorCompilerFactory({ references, useDefault }));
    }
    if (serializerCompiler) {
      app.setSerializerCompiler(serializerCompilerFactory({ references, useDefault }));
    }
  },
  {
    dependencies: [],
    fastify: "4.x",
    name
  }
);

export * from "./error.js";

declare module "fastify" {
  interface FastifyTypeProviderDefault {
    output: this["input"] extends TSchema ? StaticDecode<this["input"]> : unknown;
  }
}
