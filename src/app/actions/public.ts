"use server";

import { findOrCreateLead } from "@/lib/public-lead";
import { prisma } from "@/lib/prisma";
import {
  publicContactSchema,
  publicBriefSchema,
  publicBookingSchema,
} from "@/lib/validations/public";
import { revalidatePath } from "next/cache";

export type FormActionResult = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

// 1. Submit Contact Form (/kontak)
export async function submitContactAction(
  _prevState: FormActionResult | null,
  formData: FormData
): Promise<FormActionResult> {
  const rawData = {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone") || "",
    companyName: formData.get("companyName") || "",
    subject: formData.get("subject"),
    message: formData.get("message"),
    consentPrivacy: formData.get("consentPrivacy") === "on",
    websiteUrl: formData.get("websiteUrl") || "", // Honeypot
  };

  const validated = publicContactSchema.safeParse(rawData);
  if (!validated.success) {
    return {
      success: false,
      message: "Validasi gagal. Silakan periksa kembali isian formulir.",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  // Honeypot check
  if (validated.data.websiteUrl) {
    return { success: true, message: "Pesan Anda telah berhasil dikirim." };
  }

  const { fullName, email, phone, companyName, subject, message, consentPrivacy } =
    validated.data;

  try {
    await prisma.$transaction(async (tx) => {
      // Find or create lead
      const lead = await findOrCreateLead(tx, { fullName, email, phone, companyName, consentPrivacy }, "contact_form");


      // Record message in contactMessages
      await tx.contactMessage.create({
        data: {
          leadId: lead.id,
          subject,
          message,
        },
      });
    });

    revalidatePath("/admin/leads");
    return {
      success: true,
      message: "Terima kasih! Pesan dan permohonan informasi Anda telah kami terima di database.",
    };
  } catch {
    console.error("submitContactAction failed");
    return {
      success: false,
      message: "Gagal menyimpan pesan. Silakan coba kembali sesaat lagi.",
    };
  }
}

// 2. Submit Project Brief (/mulai-proyek)
export async function submitBriefAction(
  _prevState: FormActionResult | null,
  formData: FormData
): Promise<FormActionResult> {
  const rawData = {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone") || "",
    companyName: formData.get("companyName") || "",
    projectType: formData.get("projectType"),
    budgetRange: formData.get("budgetRange") || "",
    targetTimeline: formData.get("targetTimeline") || "",
    overview: formData.get("overview"),
    goals: formData.get("goals") || "",
    targetAudience: formData.get("targetAudience") || "",
    consentPrivacy: formData.get("consentPrivacy") === "on",
    websiteUrl: formData.get("websiteUrl") || "", // Honeypot
  };

  const validated = publicBriefSchema.safeParse(rawData);
  if (!validated.success) {
    return {
      success: false,
      message: "Validasi gagal. Silakan periksa formulir brief Anda.",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  if (validated.data.websiteUrl) {
    return { success: true, message: "Brief proyek Anda telah tersimpan." };
  }

  const {
    fullName,
    email,
    phone,
    companyName,
    projectType,
    budgetRange,
    targetTimeline,
    overview,
    goals,
    targetAudience,
    consentPrivacy,
  } = validated.data;

  try {
    await prisma.$transaction(async (tx) => {
      const lead = await findOrCreateLead(tx, { fullName, email, phone, companyName, consentPrivacy }, "project_brief");


      await tx.projectBrief.create({
        data: {
          leadId: lead.id,
          projectType,
          budgetRange: budgetRange || null,
          timelineRange: targetTimeline || null,
          description: overview,
          features: goals || targetAudience ? { goals, targetAudience } : undefined,
        },
      });
    });

    revalidatePath("/admin/leads");
    return {
      success: true,
      message: "Brief spesifikasi kebutuhan Anda telah tersimpan langsung di database kami.",
    };
  } catch {
    console.error("submitBriefAction failed");
    return {
      success: false,
      message: "Gagal menyimpan brief proyek. Silakan coba kembali.",
    };
  }
}

// 3. Submit Consultation Booking (/booking)
export async function submitBookingAction(
  _prevState: FormActionResult | null,
  formData: FormData
): Promise<FormActionResult> {
  const rawData = {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone") || "",
    companyName: formData.get("companyName") || "",
    preferredDate: formData.get("preferredDate"),
    preferredTimeSlot: formData.get("preferredTimeSlot"),
    topic: formData.get("topic"),
    consentPrivacy: formData.get("consentPrivacy") === "on",
    websiteUrl: formData.get("websiteUrl") || "", // Honeypot
  };

  const validated = publicBookingSchema.safeParse(rawData);
  if (!validated.success) {
    return {
      success: false,
      message: "Validasi gagal. Pastikan tanggal dan isian lainnya sesuai.",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  if (validated.data.websiteUrl) {
    return { success: true, message: "Permintaan konsultasi telah tercatat." };
  }

  const {
    fullName,
    email,
    phone,
    companyName,
    preferredDate,
    preferredTimeSlot,
    topic,
    consentPrivacy,
  } = validated.data;

  try {
    await prisma.$transaction(async (tx) => {
      const lead = await findOrCreateLead(tx, { fullName, email, phone, companyName, consentPrivacy }, "contact_form");


      await tx.consultationBooking.create({
        data: {
          leadId: lead.id,
          preferredDate: new Date(preferredDate),
          preferredTimeSlot,
          topic,
          status: "pending",
        },
      });
    });

    revalidatePath("/admin/bookings");
    return {
      success: true,
      message: "Jadwal konsultasi teknis berhasil didaftarkan ke sistem.",
    };
  } catch {
    console.error("submitBookingAction failed");
    return {
      success: false,
      message: "Gagal mendaftarkan jadwal konsultasi. Silakan periksa kembali.",
    };
  }
}
