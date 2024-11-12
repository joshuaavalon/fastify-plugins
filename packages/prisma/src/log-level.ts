import type { Prisma } from "@prisma/client";

export type LogLevels = LogLevel | LogLevel[];

export enum LogLevel {
  query = 0,
  info = 10,
  warn = 20,
  error = 30
}

function mapPrismaLogLevel(logLevel: LogLevel): Prisma.LogLevel {
  switch (logLevel) {
    case LogLevel.error:
      return "error";
    case LogLevel.info:
      return "info";
    case LogLevel.query:
      return "query";
    case LogLevel.warn:
      return "warn";
  }
}

export function mapLogLevel(logLevel: LogLevels): Prisma.LogLevel[] {
  return Array.isArray(logLevel)
    ? logLevel.map(mapPrismaLogLevel)
    : Object.values(LogLevel)
      .filter(v => typeof v !== "string")
      .filter(v => v >= logLevel)
      .map(mapPrismaLogLevel);
}
