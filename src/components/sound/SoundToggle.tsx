"use client";

import { useSound } from "@/hooks/useSound";

export function SoundToggle() {
  const { muted, toggleMuted } = useSound();

  return (
    <button
      type="button"
      onClick={toggleMuted}
      aria-label={muted ? "Activar sonido" : "Silenciar sonido"}
      aria-pressed={!muted}
      className="text-sand flex min-h-11 min-w-11 items-center justify-center text-xs tracking-widest"
    >
      {muted ? "◯" : "●"}
    </button>
  );
}
