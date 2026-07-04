"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Howl } from "howler";
import { SoundContext, type SoundName } from "@/hooks/useSound";

const SOURCES: Record<SoundName, string> = {
  menuOpen: "/audio/menu-open.wav",
  menuClose: "/audio/menu-close.wav",
  cta: "/audio/cta.wav",
};

const STORAGE_KEY = "nomada:sound-muted";

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMuted] = useState(true);
  const howlsRef = useRef<Partial<Record<SoundName, Howl>>>({});

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    // Default muted-until-first-interaction to respect autoplay policies;
    // only unmute automatically if the user explicitly unmuted before.
    if (stored === "false") setMuted(false);

    howlsRef.current = Object.fromEntries(
      Object.entries(SOURCES).map(([name, src]) => [
        name,
        new Howl({ src: [src], volume: 0.35, preload: true }),
      ]),
    ) as Record<SoundName, Howl>;

    return () => {
      Object.values(howlsRef.current).forEach((h) => h?.unload());
    };
  }, []);

  const value = useMemo(
    () => ({
      muted,
      toggleMuted: () => {
        setMuted((prev) => {
          const next = !prev;
          window.localStorage.setItem(STORAGE_KEY, String(next));
          return next;
        });
      },
      play: (name: SoundName) => {
        if (muted) return;
        howlsRef.current[name]?.play();
      },
    }),
    [muted],
  );

  return (
    <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
  );
}
