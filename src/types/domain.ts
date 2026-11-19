import { z } from "zod";
import { LeadStatus, BookingStatus } from "@prisma/client";

export const roleSchema = z.enum(["super_admin", "editor"]);
export type RoleName = z.infer<typeof roleSchema>;
export const leadStatusSchema = z.enum(LeadStatus);
export const bookingStatusSchema = z.enum(BookingStatus);
export const statusUpdateSchema = z.object({ status: z.string().max(40) });
export const apiErrorSchema = z.object({
  success: z.literal(false),
  code: z.enum(["UNAUTHORIZED", "FORBIDDEN", "VALIDATION", "NOT_FOUND", "TIMEOUT", "NETWORK", "SERVER"]),
  message: z.string(),
  errors: z.record(z.string(), z.array(z.string())).optional(),
  requestId: z.string().optional(),
});
export const mutationResponseSchema = z.discriminatedUnion("success", [
  z.object({ success: z.literal(true), message: z.string() }), apiErrorSchema,
]);
export type ApiError = z.infer<typeof apiErrorSchema>;
