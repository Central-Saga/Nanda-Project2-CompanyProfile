"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest, ApiRequestError } from "@/lib/api/client";
import { mutationResponseSchema } from "@/types/domain";
import { Button } from "@/components/shared/ui/Button";
export interface StatusSelectorProps { resource: "leads" | "bookings"; id: string; currentStatus: string; options: readonly string[]; }
export function StatusSelector({ resource, id, currentStatus, options }: StatusSelectorProps) {
  const [optimistic, setOptimistic] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const abort = useRef<AbortController | null>(null);
  const desired = useRef(currentStatus);
  const router = useRouter();
  useEffect(() => () => abort.current?.abort(), []);
  async function save(value: string) {
    if (pending) return;
    abort.current?.abort(); abort.current = new AbortController();
    desired.current = value; setOptimistic(value); setPending(true); setError("");
    try {
      const result = await apiRequest(`/${resource}/${id}`, mutationResponseSchema, { method: "PATCH", body: JSON.stringify({ status: value }), signal: abort.current.signal });
      if (!result.success) throw new Error(result.message);
      router.refresh();
    } catch (reason) {
      if (abort.current.signal.aborted) return;
      setOptimistic(null); setError(reason instanceof ApiRequestError ? reason.message : "Status belum tersimpan. Silakan coba lagi.");
    } finally { setPending(false); }
  }
  return <div><select aria-label={`Status ${resource}`} value={optimistic ?? currentStatus} disabled={pending} onChange={(e) => void save(e.target.value)} className="rounded border border-zinc-700 bg-zinc-900 px-2 text-xs">
    {options.map((value) => <option key={value} value={value}>{value.toUpperCase()}</option>)}</select>
    {pending && <span role="status" className="sr-only">Menyimpan status</span>}
    {error && <p role="alert" className="max-w-xs text-sm text-red-300">{error}<Button onClick={() => void save(desired.current)}>Coba lagi</Button></p>}</div>;
}
