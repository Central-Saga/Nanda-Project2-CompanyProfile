import type { InputHTMLAttributes } from "react";
export type InputProps = InputHTMLAttributes<HTMLInputElement>;
export function Input({ id, name, className = "", ...props }: InputProps) {
  return <input id={id || name} name={name} className={`rounded border border-zinc-700 bg-zinc-900 px-3 text-zinc-100 ${className}`} {...props} />;
}
