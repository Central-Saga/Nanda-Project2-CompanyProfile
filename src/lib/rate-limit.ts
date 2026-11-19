import { createHash } from "node:crypto";
import { prisma } from "./prisma";

export async function consumeLoginAttempt(address: string): Promise<boolean> {
  const key = createHash("sha256").update(address).digest("hex");
  return prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT 1 AS locked FROM (SELECT pg_advisory_xact_lock(hashtext(${key}))) AS lock`;
    const attempts = await tx.auditLog.count({ where: { entityType: "LoginAttempt", entityId: key, createdAt: { gte: new Date(Date.now() - 900_000) } } });
    if (attempts >= 20) return false;
    await tx.auditLog.create({ data: { action: "CREATE", entityType: "LoginAttempt", entityId: key } });
    return true;
  });
}
