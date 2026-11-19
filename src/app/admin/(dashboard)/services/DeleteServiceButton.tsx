"use client";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteServiceAction } from "@/app/actions/service";
export interface DeleteServiceButtonProps { id: string; name: string; }
export function DeleteServiceButton({ id, name }: DeleteServiceButtonProps) {
  return <DeleteButton id={id} label={name} action={deleteServiceAction} />;
}
