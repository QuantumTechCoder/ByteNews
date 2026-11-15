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

  // 1. Direct Cloudflare runtime global binding (D1 binding "DB")
  if (g.DB && typeof g.DB.prepare === "function") {
    return g.DB;
  }

  // 2. Cloudflare env wrapper or Next.js environment mapping
  if (g.__env__?.DB && typeof g.__env__.DB.prepare === "function") {
    return g.__env__.DB;
  }

  // 3. Process environment (when injected via Next.js Cloudflare adapter)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof process !== "undefined" && (process.env as any)?.DB) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const envDb = (process.env as any).DB;
    if (typeof envDb.prepare === "function") {
      return envDb;
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
