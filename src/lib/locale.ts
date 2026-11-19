import { cookies } from "next/headers";
export type Locale = "id" | "en";
const defaultLocale: Locale = "id";
export function resolveLocale(value?: string): Locale { return value === "en" ? "en" : defaultLocale; }
export async function getLocale(): Promise<Locale> { return resolveLocale((await cookies()).get("locale")?.value); }
