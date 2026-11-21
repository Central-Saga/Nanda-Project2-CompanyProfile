"use client";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteProjectAction } from "@/app/actions/project";
export interface DeleteProjectButtonProps { id: string; title: string; }
export function DeleteProjectButton({ id, title }: DeleteProjectButtonProps) {
  return <DeleteButton id={id} label={title} action={deleteProjectAction} />;
}
