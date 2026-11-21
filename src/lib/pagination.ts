export const PAGE_SIZE = 10;
export type PageSearchParams = Promise<Record<string, string | string[] | undefined>>;
export async function readPage(params?: PageSearchParams) {
  const values = await params || {};
  const raw = Array.isArray(values.page) ? values.page[0] : values.page;
  const parsed = Number(raw || 1);
  const page = Number.isSafeInteger(parsed) && parsed > 0 ? Math.min(parsed, 10000) : 1;
  return { page, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE + 1 };
}
