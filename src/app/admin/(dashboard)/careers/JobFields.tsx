import { FormField } from "@/components/admin/FormField";
import type { JobFormData } from "@/types/forms";
export interface JobFieldsProps { initialData?: JobFormData; errors?: Record<string, string[]>; }
export function JobFields({ initialData, errors }: JobFieldsProps) {
  return (
      <div className="p-5 bg-zinc-950 border border-zinc-900 rounded-lg space-y-4">
        <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-zinc-300">
          Uraian Pekerjaan
        </h2>

        <FormField
          label="Deskripsi Umum"
          name="description"
          multiline
          rows={3}
          defaultValue={initialData?.description || ""}
          errors={errors?.description}
        />

        <FormField
          label="Tanggung Jawab (Responsibilities)"
          name="responsibilities"
          multiline
          rows={4}
          defaultValue={initialData?.responsibilities || ""}
          errors={errors?.responsibilities}
        />

        <FormField
          label="Kualifikasi / Persyaratan (Requirements)"
          name="requirements"
          multiline
          rows={4}
          defaultValue={initialData?.requirements || ""}
          errors={errors?.requirements}
        />

        <FormField
          label="Benefit & Fasilitas"
          name="benefits"
          multiline
          rows={3}
          defaultValue={initialData?.benefits || ""}
          errors={errors?.benefits}
        />
      </div>

  );
}
