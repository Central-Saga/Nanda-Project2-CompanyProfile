import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createClient() {
  const pool = new Pool({ options: "-c timezone=UTC", connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 5000, query_timeout: 10000, statement_timeout: 10000 });
  return new PrismaClient({ adapter: new PrismaPg(pool), log: [] });
}

export const prisma =
  globalForPrisma.prisma ??
  createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
