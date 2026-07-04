"use client";

import { createContext, useContext } from "react";

export type SoundName = "menuOpen" | "menuClose" | "cta";

export type SoundContextValue = {
  play: (name: SoundName) => void;
  muted: boolean;
  toggleMuted: () => void;
};

export const SoundContext = createContext<SoundContextValue | null>(null);

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used within a SoundProvider");
  return ctx;
}
