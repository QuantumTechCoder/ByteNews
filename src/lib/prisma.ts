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

  // 1. Check Cloudflare internal request context Symbol (used by @cloudflare/next-on-pages)
  try {
    const symbolKey = Symbol.for("__cloudflare-request-context__");
    const cfCtx = g[symbolKey];
    if (cfCtx?.env) {
      // Check known binding names
      const candidateNames = ["DB", "bytenews-db", "bytenews_db", "bytenewsDb", "DATABASE"];
      for (const name of candidateNames) {
        if (cfCtx.env[name] && typeof cfCtx.env[name].prepare === "function") {
          return cfCtx.env[name];
        }
      }
      // Auto-discover any D1 database binding on env
      for (const key of Object.keys(cfCtx.env)) {
        const val = cfCtx.env[key];
        if (val && typeof val.prepare === "function") {
          return val;
        }
      }
    }
  } catch (err) {
    console.warn("[ByteNews] Context symbol lookup warning:", err);
  }

  // 2. Check direct global bindings and candidate binding names
  const candidateNames = ["DB", "bytenews-db", "bytenews_db", "bytenewsDb", "DATABASE"];
  for (const name of candidateNames) {
    if (g[name] && typeof g[name].prepare === "function") return g[name];
    if (g.__env__?.[name] && typeof g.__env__[name].prepare === "function") return g.__env__[name];
    if (typeof process !== "undefined" && (process.env as any)?.[name]) {
      const envDb = (process.env as any)[name];
      if (typeof envDb.prepare === "function") return envDb;
    }
  }

  // Check all global keys for a D1 instance
  try {
    for (const key of Object.keys(g)) {
      if (g[key] && typeof g[key].prepare === "function") {
        return g[key];
      }
    }
  } catch {
    // ignore
  }

  return null;
}

let cachedPrismaClient: PrismaClient | null = null;
let lastD1Ref: any = null;

export function getPrisma(): PrismaClient {
  const d1 = resolveD1Database();

  if (d1) {
    if (!cachedPrismaClient || lastD1Ref !== d1) {
      const adapter = new PrismaD1(d1);
      cachedPrismaClient = new PrismaClient({ adapter });
      lastD1Ref = d1;
    }
    return cachedPrismaClient;
  }

  // In local development or node runtime, use standard PrismaClient
  if (!global.prisma) {
    try {
      global.prisma = new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
      });
    } catch (err) {
      console.error("[ByteNews] Failed to initialize PrismaClient:", err);
    }
  }

  return global.prisma!;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrisma();
    if (!client) {
      console.error("[ByteNews] Prisma client is undefined. Check D1 binding in Cloudflare dashboard.");
      return () => Promise.resolve(null);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const val = (client as any)[prop];
    return typeof val === "function" ? val.bind(client) : val;
  },
});
