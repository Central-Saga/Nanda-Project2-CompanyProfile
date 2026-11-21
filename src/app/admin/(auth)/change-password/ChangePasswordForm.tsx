"use client";
import { Input } from "@/components/shared/ui/Input";

import { Button } from "@/components/shared/ui/Button";

import { SmartForm } from "@/components/shared/SmartForm";

import { useContentForm } from "@/lib/use-content-form";
import { changePasswordAction } from "@/app/actions/auth";

export function ChangePasswordForm() {
  const { state, formAction, isPending } = useContentForm(changePasswordAction);


  return (
    <SmartForm action={formAction} pending={isPending} success={state?.success} className="space-y-4">
      {state?.message && !state?.success && (
        <div className="p-3 bg-red-950/50 border border-red-700/50 text-red-300 text-sm rounded">
          {state.message}
        </div>
      )}

      {state?.success && (
        <div className="p-3 bg-green-950/50 border border-green-700/50 text-green-300 text-sm rounded">
          Password berhasil diperbarui. Mengalihkan...
        </div>
      )}

      <div>
        <label
          className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1"
          htmlFor="currentPassword"
        >
          Password Saat Ini
        </label>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-zinc-100 rounded focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 font-sans text-sm"
        />
        {state?.errors?.currentPassword && (
          <p className="mt-1 text-xs text-red-400">{state.errors.currentPassword[0]}</p>
        )}
      </div>

      <div>
        <label
          className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1"
          htmlFor="newPassword"
        >
          Password Baru
        </label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          required
          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-zinc-100 rounded focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 font-sans text-sm"
          placeholder="Min. 8 karakter (besar, kecil, angka)"
        />
        {state?.errors?.newPassword && (
          <p className="mt-1 text-xs text-red-400">{state.errors.newPassword[0]}</p>
        )}
      </div>

      <div>
        <label
          className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1"
          htmlFor="confirmPassword"
        >
          Konfirmasi Password Baru
        </label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-zinc-100 rounded focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 font-sans text-sm"
        />
        {state?.errors?.confirmPassword && (
          <p className="mt-1 text-xs text-red-400">{state.errors.confirmPassword[0]}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium text-sm rounded transition focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        {isPending ? "Menyimpan..." : "Perbarui Password"}
      </Button>
    </SmartForm>
  );
}
