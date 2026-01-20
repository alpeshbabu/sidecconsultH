// Prisma configuration file
// See: https://pris.ly/d/config
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    // Database URL from environment variable
    url: process.env.DATABASE_URL!,
  },
});
