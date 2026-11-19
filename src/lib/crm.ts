import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";
import { leadStatusSchema, bookingStatusSchema } from "@/types/domain";
export async function updateCrmStatus(kind: "leads" | "bookings", id: string, status: string, userId: string) {
  if (kind === "leads") {
    const value = leadStatusSchema.parse(status);
    await prisma.$transaction(async (tx) => {
      const lead = await tx.lead.findUniqueOrThrow({ where: { id } });
      await tx.lead.update({ where: { id }, data: { status: value } });
      await tx.leadStatusHistory.create({ data: { leadId: id, fromStatus: lead.status, toStatus: value, changedBy: userId } });
    });
  } else {
    await prisma.consultationBooking.update({ where: { id }, data: { status: bookingStatusSchema.parse(status), handledBy: userId } });
  }
  revalidatePath(`/admin/${kind}`);
  revalidatePath("/admin/dashboard");
}
