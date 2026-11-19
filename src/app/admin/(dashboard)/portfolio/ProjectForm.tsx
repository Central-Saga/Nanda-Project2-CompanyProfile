"use client";
import type { ProjectFormData } from "@/types/forms";

import { ContentFormShell } from "@/components/admin/ContentFormShell";
import { useContentForm } from "@/lib/use-content-form";

import { createProjectAction, updateProjectAction } from "@/app/actions/project";
import { FormField } from "@/components/admin/FormField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import Link from "next/link";

import { ProjectFields } from "./ProjectFields";

export interface ProjectFormProps {
  initialData?: ProjectFormData;
}

export function ProjectForm({ initialData }: ProjectFormProps) {
  const isEditing = Boolean(initialData);
  const action = isEditing ? updateProjectAction : createProjectAction;
  const { state, formAction, isPending } = useContentForm(action);


  return (
    <ContentFormShell action={formAction} pending={isPending} state={state} id={initialData?.id} className="space-y-6 max-w-3xl">


      <div className="p-5 bg-zinc-950 border border-zinc-900 rounded-lg space-y-4">
        <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-zinc-300">
          Informasi Utama
        </h2>

        <FormField
          label="Judul Proyek"
          name="title"
          required
          defaultValue={initialData?.title}
          errors={state?.errors?.title}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Slug (URL)"
            name="slug"
            required
            placeholder="sistem-erp-manufaktur"
            defaultValue={initialData?.slug}
            errors={state?.errors?.slug}
          />

          <FormField
            label="URL Proyek (Opsional)"
            name="projectUrl"
            type="url"
            placeholder="https://..."
            defaultValue={initialData?.projectUrl || ""}
            errors={state?.errors?.projectUrl}
          />
        </div>

        <FormField
          label="Ringkasan Singkat"
          name="summary"
          multiline
          rows={2}
          defaultValue={initialData?.summary || ""}
          errors={state?.errors?.summary}
        />
      </div>

      <div className="p-5 bg-zinc-950 border border-zinc-900 rounded-lg space-y-4">
        <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-zinc-300">
          Studi Kasus (Case Study)
        </h2>

        <FormField
          label="Tantangan (Challenge)"
          name="challenge"
          multiline
          rows={3}
          defaultValue={initialData?.challenge || ""}
          errors={state?.errors?.challenge}
        />

        <FormField
          label="Solusi (Solution)"
          name="solution"
          multiline
          rows={3}
          defaultValue={initialData?.solution || ""}
          errors={state?.errors?.solution}
        />

        <FormField
          label="Dampak & Hasil (Result)"
          name="result"
          multiline
          rows={3}
          defaultValue={initialData?.result || ""}
          errors={state?.errors?.result}
        />

        <FormField
          label="Konten Lengkap (Markdown / Text)"
          name="content"
          multiline
          rows={6}
          defaultValue={initialData?.content || ""}
          errors={state?.errors?.content}
        />
      </div>

      <ProjectFields initialData={initialData} errors={state?.errors} />

      <div className="flex items-center gap-3">
        <SubmitButton
          pending={isPending}
          label={isEditing ? "Perbarui Proyek" : "Simpan Proyek"}
        />
        <Link
          href="/admin/portfolio"
          className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 transition"
        >
          Batal
        </Link>
      </div>
    </ContentFormShell>
  );
}
