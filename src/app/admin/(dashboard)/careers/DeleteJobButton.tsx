"use client";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteJobAction } from "@/app/actions/job";
export interface DeleteJobButtonProps { id: string; title: string; }
export function DeleteJobButton({ id, title }: DeleteJobButtonProps) {
  return <DeleteButton id={id} label={title} action={deleteJobAction} />;
}
