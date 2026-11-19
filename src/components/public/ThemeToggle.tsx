"use client";
import { useState } from "react";
import { Button } from "@/components/shared/ui/Button";
export interface ThemeToggleProps { initialTheme: "dark" | "light"; }
export function ThemeToggle({ initialTheme }: ThemeToggleProps) {
  const [theme, setTheme] = useState(initialTheme);
  return <Button aria-label="Ganti tema" aria-pressed={theme === "light"} onClick={() => {
    const next = theme === "dark" ? "light" : "dark"; setTheme(next); document.documentElement.dataset.theme = next;
    document.cookie = `theme=${next}; Path=/; SameSite=Lax; Max-Age=31536000`;
  }} className="text-xs">{theme === "dark" ? "Terang" : "Gelap"}</Button>;
}
