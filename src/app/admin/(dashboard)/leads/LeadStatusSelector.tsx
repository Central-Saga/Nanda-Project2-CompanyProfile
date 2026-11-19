"use client";
import { StatusSelector } from "@/components/admin/StatusSelector";
import { leadStatusSchema } from "@/types/domain";
import type { LeadStatus } from "@prisma/client";
export interface LeadStatusSelectorProps { leadId: string; currentStatus: LeadStatus; }
export function LeadStatusSelector({ leadId, currentStatus }: LeadStatusSelectorProps) {
  return <StatusSelector resource="leads" id={leadId} currentStatus={currentStatus} options={leadStatusSchema.options} />;
}
