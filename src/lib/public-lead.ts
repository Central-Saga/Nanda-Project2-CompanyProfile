import type { Prisma, LeadSourceType } from "@prisma/client";
export interface PublicLeadInput { fullName: string; email: string; phone?: string; companyName?: string; consentPrivacy: boolean; }
export async function findOrCreateLead(tx: Prisma.TransactionClient, input: PublicLeadInput, sourceType: LeadSourceType) {
  const existing = await tx.lead.findFirst({ where: { email: input.email } });
  if (existing) return existing;
  return tx.lead.create({ data: { sourceType, fullName: input.fullName, email: input.email, phone: input.phone || null, companyName: input.companyName || null, consentPrivacy: input.consentPrivacy, consentAt: new Date() } });
}
