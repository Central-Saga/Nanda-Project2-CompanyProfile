"use client";
import { ContactFields } from "@/components/public/ContactFields";
import { FormFeedback } from "@/components/public/FormFeedback";
import { Input } from "@/components/shared/ui/Input";

import { SmartForm } from "@/components/shared/SmartForm";

import { useActionState } from "react";
import { submitBriefAction } from "@/app/actions/public";
import { SubmitButton } from "@/components/admin/SubmitButton";

export function BriefForm() {
  const [state, formAction, isPending] = useActionState(submitBriefAction, null);

  return (
    <SmartForm action={formAction} pending={isPending} success={state?.success} className="space-y-6 max-w-2xl">
      <FormFeedback state={state} />

      <Input
        type="text"
        name="websiteUrl"
        hidden
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="p-5 bg-zinc-950 border border-zinc-900 rounded-lg space-y-4">
        <h2 className="text-xs font-bold font-sans uppercase tracking-wider text-zinc-300">
          1. Profil Pemrakarsa Proyek
        </h2>

        <ContactFields errors={state?.errors} />
      </div>

      <div className="p-5 bg-zinc-950 border border-zinc-900 rounded-lg space-y-4">
        <h2 className="text-xs font-bold font-sans uppercase tracking-wider text-zinc-300">
          2. Spesifikasi Kebutuhan Proyek
        </h2>

        <div>
          <label className="block text-xs font-sans uppercase tracking-wider text-zinc-400 mb-1" htmlFor="projectType">
            Kategori / Tipe Solusi <span className="text-red-500">*</span>
          </label>
          <select
            id="projectType" name="projectType"
            required
            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-zinc-100 rounded text-sm focus:outline-none focus:border-red-600 font-sans text-xs"
          >
            <option value="enterprise">Aplikasi Web Skala Enterprise</option>
            <option value="web">Platform Web Kustom</option>
            <option value="mobile">Aplikasi Mobile (iOS & Android)</option>
            <option value="ai">Integrasi AI & Infrastruktur Data</option>
            <option value="uiux">Perancangan UI/UX Desain</option>
            <option value="other">Lainnya</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-sans uppercase tracking-wider text-zinc-400 mb-1" htmlFor="budgetRange">
              Ekspektasi Anggaran
            </label>
            <Input
              type="text"
              name="budgetRange"
              placeholder="Contoh: 100jt - 300jt"
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-zinc-100 rounded text-sm focus:outline-none focus:border-red-600 font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-sans uppercase tracking-wider text-zinc-400 mb-1" htmlFor="targetTimeline">
              Target Waktu Penyelesaian
            </label>
            <Input
              type="text"
              name="targetTimeline"
              placeholder="Contoh: 3-6 Bulan"
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-zinc-100 rounded text-sm focus:outline-none focus:border-red-600 font-sans"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-sans uppercase tracking-wider text-zinc-400 mb-1" htmlFor="overview">
            Uraian Singkat / Deskripsi Proyek <span className="text-red-500">*</span>
          </label>
          <textarea
            id="overview" name="overview"
            required
            rows={4}
            placeholder="Jelaskan gambaran umum sistem yang ingin dibangun, masalah operasional saat ini, atau kebutuhan integrasi..."
            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-zinc-100 rounded text-sm focus:outline-none focus:border-red-600 font-sans"
          />
          {state?.errors?.overview && (
            <p className="text-xs text-red-400 mt-1">{state.errors.overview[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-sans uppercase tracking-wider text-zinc-400 mb-1">
            Target Keberhasilan (Goals)
          </label>
          <textarea
            id="goals" name="goals"
            rows={2}
            placeholder="Hasil spesifik yang ingin dicapai (misal: otomatisasi settlement, latensi < 100ms)..."
            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-zinc-100 rounded text-sm focus:outline-none focus:border-red-600 font-sans"
          />
        </div>
      </div>

      <div>
        <label className="flex items-start gap-2 cursor-pointer">
          <Input
            type="checkbox"
            name="consentPrivacy"
            required
            className="mt-1 rounded bg-zinc-900 border-zinc-800 text-red-600 focus:ring-0"
          />
          <span className="text-xs text-zinc-400 font-sans">
            Saya menyetujui ringkasan kebutuhan ini disimpan di database sistem untuk dipelajari oleh Solution Architect.
          </span>
        </label>
        {state?.errors?.consentPrivacy && (
          <p className="text-xs text-red-400 mt-1">{state.errors.consentPrivacy[0]}</p>
        )}
      </div>

      <div>
        <SubmitButton pending={isPending} label="Kirimkan Brief Proyek" />
      </div>
    </SmartForm>
  );
}
