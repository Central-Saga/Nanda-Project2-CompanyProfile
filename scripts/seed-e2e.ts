import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { serviceFactory } from "../tests/factories";
const url = process.env.DATABASE_URL;
if (!url || !new URL(url).pathname.includes("audit")) throw new Error("E2E seeding requires a dedicated *audit* database.");
const pool = new Pool({ options: "-c timezone=UTC", connectionString: url });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });
async function main() {
try {
  const role = await prisma.role.upsert({ where: { name: "super_admin" }, create: { name: "super_admin" }, update: {} });
  for (const email of ["admin-a@example.test", "admin-b@example.test"]) {
    await prisma.user.upsert({ where: { email }, create: { email, fullName: email.startsWith("admin-a") ? "Audit Admin A" : "Audit Admin B", passwordHash: await bcrypt.hash("AuditPassword123!", 4), roleId: role.id, mustChangePassword: false }, update: { passwordHash: await bcrypt.hash("AuditPassword123!", 4), failedLoginCount: 0, lockedUntil: null, mustChangePassword: false } });
  }
  for (let i = 1; i <= 23; i++) { const data = serviceFactory(i); await prisma.service.upsert({ where: { slug: data.slug }, create: data, update: { deletedAt: null } }); }
  await prisma.companyProfile.deleteMany();
  await prisma.companyProfile.create({ data: { companyName: "PT Rekasaya Digital International", tagline: "Rekayasa Digital", aboutShort: "Enterprise software and cloud engineering" } });
  const lead = await prisma.lead.findFirst({ where: { email: "lead@example.test" } });
  if (!lead) await prisma.lead.create({ data: { sourceType: "contact_form", fullName: "Audit Lead", email: "lead@example.test", consentPrivacy: true } });
  await prisma.auditLog.deleteMany({ where: { entityType: "LoginAttempt" } });
} finally { await prisma.$disconnect(); await pool.end(); }

}
void main();
