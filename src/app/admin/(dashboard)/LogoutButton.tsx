"use client";
import { Button } from "@/components/shared/ui/Button";


import { logoutAction } from "@/app/actions/auth";
import { useState } from "react";

export function LogoutButton() {
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    if (pending) return;
    setPending(true);
    const res = await logoutAction();
    if (res.redirectUrl) {
      window.location.replace(res.redirectUrl);
    }
  }

  return (
    <Button
      disabled={pending}
      onClick={handleLogout}
      className="text-xs font-mono text-zinc-400 hover:text-red-400 transition flex items-center gap-1.5"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
      Keluar
    </Button>
  );
}
