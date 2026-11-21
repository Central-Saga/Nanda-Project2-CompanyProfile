"use client";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ActionState } from "@/app/actions/auth";
export function useContentForm(action: (state: ActionState | null, data: FormData) => Promise<ActionState>) {
  const [state, formAction, isPending] = useActionState(action, null);
  const router = useRouter();
  useEffect(() => { if (state?.success && state.redirectUrl) router.push(state.redirectUrl); }, [state, router]);
  return { state, formAction, isPending };
}
