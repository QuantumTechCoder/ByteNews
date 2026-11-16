import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Function to resolve Cloudflare D1 binding from context or global environment
function resolveD1Database(): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const g = globalThis as any;

  // Check candidate binding names (standard "DB" or custom project names)
  const candidateNames = ["DB", "bytenews-db", "bytenews_db", "bytenewsDb"];

  for (const name of candidateNames) {
    if (g[name] && typeof g[name].prepare === "function") {
      return g[name];
    }
    if (g.__env__?.[name] && typeof g.__env__[name].prepare === "function") {
      return g.__env__[name];
    }
    if (typeof process !== "undefined" && (process.env as any)?.[name]) {
      const envDb = (process.env as any)[name];
      if (typeof envDb.prepare === "function") {
        return envDb;
      }
    }
  }

  return null;
}

export function getPrisma(): PrismaClient {
  const d1 = resolveD1Database();

  if (d1) {
    const adapter = new PrismaD1(d1);
    return new PrismaClient({ adapter });
  }

  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
  }

  return global.prisma;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrisma();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const val = (client as any)[prop];
    return typeof val === "function" ? val.bind(client) : val;
  },
});
