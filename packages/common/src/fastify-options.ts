import fastifySymbols from "fastify/lib/symbols.js";
import type * as http from "http";
import type { FastifyHttpOptions, FastifyInstance } from "fastify";

export type FastifyOptions = FastifyHttpOptions<http.Server>;


export const fastifyOptions = {
  getter(this: FastifyInstance): FastifyOptions {
    // @ts-ignore Fastify hack
    return this[fastifySymbols.kOptions];
  }
};
