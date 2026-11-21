import { cache } from "react";
import { getLocale } from "./locale";
export const publicTranslations = cache(async () => ({ where: { locale: { in: [await getLocale(), "id"] } }, orderBy: { locale: "asc" as const } }));
export const adminTranslations = { translations: { where: { locale: "id" } } };
