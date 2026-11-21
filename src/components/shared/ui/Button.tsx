import type { ButtonHTMLAttributes } from "react";
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;
export function Button({ className = "", type = "button", ...props }: ButtonProps) {
  return <button type={type} className={`relative min-h-11 min-w-11 rounded px-3 py-2 focus-visible:outline-2 disabled:cursor-wait disabled:opacity-50 ${className}`} {...props} />;
}
