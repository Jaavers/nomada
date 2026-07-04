"use client";

import { useEffect } from "react";
import {
  MotionPrefsProvider,
  useReducedMotionValue,
} from "@/lib/motion-prefs";
import { registerGsap } from "@/lib/gsap/gsapConfig";
import { useLenis } from "@/lib/lenis/useLenis";
import { TransitionProvider } from "@/components/transitions/TransitionProvider";
import { Preloader } from "@/components/preloader/Preloader";
import { Navbar } from "@/components/navigation/Navbar";
import { SoundProvider } from "@/components/sound/SoundProvider";
import { CustomCursor } from "@/components/cursor/CustomCursor";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotionValue();

  useEffect(() => {
    registerGsap();
  }, []);

  useLenis(reducedMotion);

  return (
    <MotionPrefsProvider value={reducedMotion}>
      <SoundProvider>
        <TransitionProvider>
          <Preloader />
          <Navbar />
          {children}
          <CustomCursor />
        </TransitionProvider>
      </SoundProvider>
    </MotionPrefsProvider>
  );
}
