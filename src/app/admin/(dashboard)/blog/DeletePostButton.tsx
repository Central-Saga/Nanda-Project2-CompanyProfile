"use client";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deletePostAction } from "@/app/actions/post";
export interface DeletePostButtonProps { id: string; title: string; }
export function DeletePostButton({ id, title }: DeletePostButtonProps) {
  return <DeleteButton id={id} label={title} action={deletePostAction} />;
}
