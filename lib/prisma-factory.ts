import { PrismaClient } from "./generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Builds a PrismaClient for whichever database DATABASE_URL points at.
 *
 * - `prisma+postgres://...`  → Prisma Postgres / Accelerate (hosted proxy).
 * - `postgres://` / `postgresql://` → a plain PostgreSQL server (e.g. the
 *   Postgres container on the Hostinger VPS) via the `pg` driver adapter.
 *
 * Prisma 7 ships without the Rust query engine, so a direct connection MUST go
 * through a driver adapter — passing a postgres:// URL as `accelerateUrl` fails.
 *
 * Uses relative imports only so it also works from `tsx prisma/seed.ts`.
 */
export function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }

  const log: ("query" | "error" | "warn")[] =
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"];

  if (url.startsWith("prisma+postgres://") || url.startsWith("prisma://")) {
    return new PrismaClient({ accelerateUrl: url, log });
  }

  const adapter = new PrismaPg({
    connectionString: url,
    // Keep the pool small: Next.js runs a single long-lived process on the VPS.
    max: Number(process.env.DATABASE_POOL_MAX ?? 10),
  });

  return new PrismaClient({ adapter, log });
}
