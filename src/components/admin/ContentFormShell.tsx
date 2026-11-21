"use client";
import type { ReactNode } from "react";
import type { ActionState } from "@/app/actions/auth";
import { SmartForm } from "@/components/shared/SmartForm";
import { Input } from "@/components/shared/ui/Input";
export interface ContentFormShellProps { action: (data: FormData) => void; pending: boolean; state: ActionState | null; id?: string; children: ReactNode; className?: string; }
export function ContentFormShell({ action, pending, state, id, children, className }: ContentFormShellProps) {
  return <SmartForm action={action} pending={pending} success={state?.success} className={className || "max-w-3xl space-y-6"}>
    {id && <Input type="hidden" name="id" value={id} />}
    {state?.message && <p role={state.success ? "status" : "alert"} className="rounded border border-zinc-700 p-3 text-sm">{state.message}</p>}
    {children}
  </SmartForm>;
}
