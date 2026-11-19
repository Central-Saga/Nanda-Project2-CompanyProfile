"use client";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteMediaAction } from "@/app/actions/media";
export interface DeleteMediaButtonProps { id: string; name: string; }
export function DeleteMediaButton({ id, name }: DeleteMediaButtonProps) {
  return <DeleteButton id={id} label={name} action={deleteMediaAction} />;
}
