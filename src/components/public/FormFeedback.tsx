import type { FormActionResult } from "@/app/actions/public";
export interface FormFeedbackProps { state: FormActionResult | null; }
export function FormFeedback({ state }: FormFeedbackProps) {
  if (!state?.message) return null;
  return <p role={state.success ? "status" : "alert"} className={`rounded border p-4 text-sm ${state.success ? "border-green-700 text-green-300" : "border-red-700 text-red-300"}`}>{state.message}</p>;
}
