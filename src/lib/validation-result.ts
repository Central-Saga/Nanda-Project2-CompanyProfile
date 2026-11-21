import type { ZodError } from "zod";
export function validationFailure(error: ZodError) {
  return { success: false as const, errors: error.flatten().fieldErrors };
}
