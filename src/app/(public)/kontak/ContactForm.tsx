"use client";
import { ContactFields } from "@/components/public/ContactFields";
import { PublicFormIntro } from "@/components/public/PublicFormIntro";
import { PrivacyConsent } from "@/components/public/PrivacyConsent";
import { Input } from "@/components/shared/ui/Input";

import { SmartForm } from "@/components/shared/SmartForm";

import { useActionState } from "react";
import { submitContactAction } from "@/app/actions/public";
import { SubmitButton } from "@/components/admin/SubmitButton";

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactAction, null);

  return (
    <SmartForm action={formAction} pending={isPending} success={state?.success} className="space-y-4 max-w-xl">
      <PublicFormIntro state={state} />

      <ContactFields errors={state?.errors} />

      <div>
        <label className="block text-xs font-sans uppercase tracking-wider text-zinc-400 mb-1" htmlFor="subject">
          Subjek Pesan <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          name="subject"
          required
          placeholder="Pertanyaan Implementasi Cloud Native"
          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-zinc-100 rounded text-sm focus:outline-none focus:border-red-600 font-sans"
        />
        {state?.errors?.subject && (
          <p className="text-xs text-red-400 mt-1">{state.errors.subject[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-sans uppercase tracking-wider text-zinc-400 mb-1" htmlFor="message">
          Pesan <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message" name="message"
          required
          rows={4}
          placeholder="Tuliskan pertanyaan atau deskripsi kebutuhan Anda di sini..."
          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-zinc-100 rounded text-sm focus:outline-none focus:border-red-600 font-sans"
        />
        {state?.errors?.message && (
          <p className="text-xs text-red-400 mt-1">{state.errors.message[0]}</p>
        )}
      </div>

      <PrivacyConsent errors={state?.errors?.consentPrivacy} text="Saya menyetujui bahwa data kontak ini disimpan di database internal untuk keperluan komunikasi teknis dan profesional." />

      <div className="pt-2">
        <SubmitButton pending={isPending} label="Kirim Pesan Kontak" />
      </div>
    </SmartForm>
  );
}
