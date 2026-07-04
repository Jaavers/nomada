"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap/gsapConfig";
import { useMotionPrefs } from "@/lib/motion-prefs";
import { dispatchPreloadComplete } from "@/lib/preloadEvents";

export function Preloader() {
  const [visible, setVisible] = useState(true);
  const [count, setCount] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useMotionPrefs();

  useEffect(() => {
    const counter = { value: 0 };

    // Estimated progress while real assets (fonts, in this phase) load.
    const estimatedProgress = new Promise<void>((resolve) => {
      gsap.to(counter, {
        value: 92,
        duration: reducedMotion ? 0.05 : 1.4,
        ease: "power2.out",
        onUpdate: () => setCount(Math.round(counter.value)),
        onComplete: () => resolve(),
      });
    });

    const fontsReady =
      typeof document !== "undefined" && "fonts" in document
        ? document.fonts.ready
        : Promise.resolve();

    Promise.all([fontsReady, estimatedProgress]).finally(() => {
      gsap.to(counter, {
        value: 100,
        duration: reducedMotion ? 0.05 : 0.4,
        ease: "power1.out",
        onUpdate: () => setCount(Math.round(counter.value)),
        onComplete: () => runExit(),
      });
    });

    function runExit() {
      if (!panelRef.current) {
        finish();
        return;
      }
      gsap.to(panelRef.current, {
        yPercent: -100,
        duration: reducedMotion ? 0.05 : 0.9,
        ease: "expo.inOut",
        delay: reducedMotion ? 0 : 0.2,
        onComplete: finish,
      });
    }

    function finish() {
      setVisible(false);
      dispatchPreloadComplete();
    }

    return () => {
      gsap.killTweensOf(counter);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={panelRef}
      className="bg-absolute fixed inset-0 z-[100] flex flex-col items-center justify-center"
    >
      <span className="font-display text-sand text-6xl md:text-8xl">
        {count}
      </span>
      <span className="font-serif-italic text-latte mt-4 text-sm italic md:text-base">
        Procesos lentos, tecnología fluida.
      </span>
    </div>
  );
}
