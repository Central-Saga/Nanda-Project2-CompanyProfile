const APP_TIME_ZONE = "Asia/Makassar";
export function formatDate(value: Date | string, locale = "id-ID") {
  return new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: APP_TIME_ZONE }).format(new Date(value));
}
export function formatDateTime(value: Date | string, locale = "id-ID") {
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short", timeZone: APP_TIME_ZONE }).format(new Date(value)) + " WITA";
}
export function formatNumber(value: number, locale = "id-ID") { return new Intl.NumberFormat(locale).format(value); }
export function dateInput(value: Date | string = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: APP_TIME_ZONE }).formatToParts(new Date(value));
  const get = (type: string) => parts.find((p) => p.type === type)?.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}
