"use client";
import { dateInput } from "@/lib/format";

import { ContactFields } from "@/components/public/ContactFields";
import { PublicFormIntro } from "@/components/public/PublicFormIntro";
import { PrivacyConsent } from "@/components/public/PrivacyConsent";
import { Input } from "@/components/shared/ui/Input";

import { SmartForm } from "@/components/shared/SmartForm";

import { useActionState } from "react";
import { submitBookingAction } from "@/app/actions/public";
import { SubmitButton } from "@/components/admin/SubmitButton";

export function BookingForm() {
  const [state, formAction, isPending] = useActionState(submitBookingAction, null);

  const todayStr = dateInput();

  return (
    <SmartForm action={formAction} pending={isPending} success={state?.success} className="space-y-6 max-w-2xl">
      <PublicFormIntro state={state} />

      <div className="p-5 bg-zinc-950 border border-zinc-900 rounded-lg space-y-4">
        <h2 className="text-xs font-bold font-sans uppercase tracking-wider text-zinc-300">
          1. Data Pemohon
        </h2>

        <ContactFields errors={state?.errors} />
      </div>

      <div className="p-5 bg-zinc-950 border border-zinc-900 rounded-lg space-y-4">
        <h2 className="text-xs font-bold font-sans uppercase tracking-wider text-zinc-300">
          2. Waktu & Topik Konsultasi
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-sans uppercase tracking-wider text-zinc-400 mb-1" htmlFor="preferredDate">
              Pilihan Tanggal <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              name="preferredDate"
              required
              min={todayStr}
              defaultValue={todayStr}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-zinc-100 rounded text-sm focus:outline-none focus:border-red-600 font-sans text-xs"
            />
            {state?.errors?.preferredDate && (
              <p className="text-xs text-red-400 mt-1">{state.errors.preferredDate[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-sans uppercase tracking-wider text-zinc-400 mb-1" htmlFor="preferredTimeSlot">
              Slot Waktu (WIB) <span className="text-red-500">*</span>
            </label>
            <select
              id="preferredTimeSlot" name="preferredTimeSlot"
              required
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-zinc-100 rounded text-sm focus:outline-none focus:border-red-600 font-sans text-xs"
            >
              <option value="09:00 - 10:00 WIB">09:00 - 10:00 WIB</option>
              <option value="10:30 - 11:30 WIB">10:30 - 11:30 WIB</option>
              <option value="13:30 - 14:30 WIB">13:30 - 14:30 WIB</option>
              <option value="15:00 - 16:00 WIB">15:00 - 16:00 WIB</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-sans uppercase tracking-wider text-zinc-400 mb-1" htmlFor="topic">
            Topik Masalah atau Diskusi Arsitektur <span className="text-red-500">*</span>
          </label>
          <textarea
            id="topic" name="topic"
            required
            rows={3}
            placeholder="Jelaskan kendala teknis atau arsitektur yang ingin dibahas dalam sesi konsultasi..."
            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-zinc-100 rounded text-sm focus:outline-none focus:border-red-600 font-sans"
          />
          {state?.errors?.topic && (
            <p className="text-xs text-red-400 mt-1">{state.errors.topic[0]}</p>
          )}
        </div>
      </div>

      <PrivacyConsent errors={state?.errors?.consentPrivacy} text="Saya menyetujui jadwal konsultasi ini dicatat dalam sistem dan dihubungi oleh arsitek teknis terkait." />

      <div>
        <SubmitButton pending={isPending} label="Jadwalkan Sesi Konsultasi" />
      </div>
    </SmartForm>
  );
}
