import { dateInput } from "@/lib/format";
import { z } from "zod";

const identityFields = {
  fullName: z
    .string()
    .min(2, "Nama lengkap minimal 2 karakter")
    .max(100, "Nama lengkap maksimal 100 karakter"),
  email: z.string().email("Format email tidak valid"),
  phone: z
    .string()
    .max(20, "Nomor telepon maksimal 20 digit")
    .optional()
    .or(z.literal("")),
  companyName: z
    .string()
    .max(100, "Nama perusahaan maksimal 100 karakter")
    .optional()
    .or(z.literal("")),
};

const consentFields = {
  consentPrivacy: z
    .boolean()
    .refine((val) => val === true, "Anda wajib menyetujui kebijakan privasi"),
  // Honeypot field - must be empty
  websiteUrl: z.string().max(0, "Bot detected").optional().or(z.literal("")),
};

// 1. Contact Form Schema (/kontak)
export const publicContactSchema = z.object({
  ...identityFields,
  subject: z
    .string()
    .min(3, "Subjek minimal 3 karakter")
    .max(200, "Subjek maksimal 200 karakter"),
  message: z
    .string()
    .min(10, "Pesan minimal 10 karakter")
    .max(5000, "Pesan maksimal 5000 karakter"),
  ...consentFields,
});

// 2. Project Brief Schema (/mulai-proyek)
export const publicBriefSchema = z.object({
  ...identityFields,
  projectType: z
    .enum(["web", "mobile", "enterprise", "uiux", "ai", "other"])
    .default("web"),
  budgetRange: z
    .string()
    .max(100, "Rentang anggaran maksimal 100 karakter")
    .optional()
    .or(z.literal("")),
  targetTimeline: z
    .string()
    .max(100, "Target waktu maksimal 100 karakter")
    .optional()
    .or(z.literal("")),
  overview: z
    .string()
    .min(20, "Uraian brief proyek minimal 20 karakter")
    .max(5000, "Uraian brief proyek maksimal 5000 karakter"),
  goals: z
    .string()
    .max(2000, "Target keberhasilan maksimal 2000 karakter")
    .optional()
    .or(z.literal("")),
  targetAudience: z
    .string()
    .max(2000, "Pengguna target maksimal 2000 karakter")
    .optional()
    .or(z.literal("")),
  ...consentFields,
});

// 3. Consultation Booking Schema (/booking)
export const publicBookingSchema = z.object({
  ...identityFields,
  preferredDate: z
    .string()
    .refine((date) => /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(Date.parse(date)) && new Date(date).toISOString().slice(0, 10) === date, "Tanggal tidak valid")
    .refine(
      (date) => date >= dateInput(),
      "Tanggal konsultasi harus hari ini atau di masa mendatang"
    ),
  preferredTimeSlot: z
    .string()
    .min(3, "Slot waktu wajib dipilih")
    .max(50, "Slot waktu maksimal 50 karakter"),
  topic: z
    .string()
    .min(10, "Topik konsultasi minimal 10 karakter")
    .max(1000, "Topik konsultasi maksimal 1000 karakter"),
  ...consentFields,
});
