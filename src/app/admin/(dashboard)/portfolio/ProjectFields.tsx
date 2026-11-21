import { Input } from "@/components/shared/ui/Input";
import { FormField } from "@/components/admin/FormField";
import type { ProjectFormData } from "@/types/forms";
export interface ProjectFieldsProps { initialData?: ProjectFormData; errors?: Record<string, string[]>; }
export function ProjectFields({ initialData, errors }: ProjectFieldsProps) {
  return (
      <div className="p-5 bg-zinc-950 border border-zinc-900 rounded-lg space-y-4">
        <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-zinc-300">
          Metadata & Tampilan
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Tanggal Mulai"
            name="startedAt"
            type="date"
            defaultValue={initialData?.startedAt || ""}
            errors={errors?.startedAt}
          />

          <FormField
            label="Tanggal Selesai"
            name="completedAt"
            type="date"
            defaultValue={initialData?.completedAt || ""}
            errors={errors?.completedAt}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Durasi (Bulan)"
            name="durationMonths"
            type="number"
            defaultValue={initialData?.durationMonths ? String(initialData.durationMonths) : ""}
            errors={errors?.durationMonths}
          />

          <FormField
            label="Ukuran Tim"
            name="teamSize"
            type="number"
            defaultValue={initialData?.teamSize ? String(initialData.teamSize) : ""}
            errors={errors?.teamSize}
          />

          <FormField
            label="Urutan Tampil"
            name="sortOrder"
            type="number"
            defaultValue={initialData ? String(initialData.sortOrder) : "0"}
            errors={errors?.sortOrder}
          />
        </div>

        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer" htmlFor="isPublished">
            <Input
              type="checkbox"
              name="isFeatured"
              defaultChecked={initialData ? initialData.isFeatured : false}
              className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-red-600 focus:ring-red-600"
            />
            <span className="text-xs font-mono uppercase text-zinc-300">
              Jadikan Unggulan (Featured)
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <Input
              type="checkbox"
              name="isPublished"
              defaultChecked={initialData ? initialData.isPublished : false}
              className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-red-600 focus:ring-red-600"
            />
            <span className="text-xs font-mono uppercase text-zinc-300">
              Publikasikan
            </span>
          </label>
        </div>
      </div>

  );
}
