"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "@/lib/gsap/gsapConfig";
import { useMotionPrefs } from "@/lib/motion-prefs";

const MAX_PULL = 16;

export function useMagneticButton(ref: RefObject<HTMLElement | null>) {
  const reducedMotion = useMotionPrefs();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

    function handleMove(e: PointerEvent) {
      const rect = el!.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      xTo((relX / rect.width) * MAX_PULL);
      yTo((relY / rect.height) * MAX_PULL);
    }

    function handleLeave() {
      gsap.to(el!, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: "elastic.out(1, 0.35)",
      });
    }

    el.addEventListener("pointermove", handleMove);
    el.addEventListener("pointerleave", handleLeave);
    return () => {
      el.removeEventListener("pointermove", handleMove);
      el.removeEventListener("pointerleave", handleLeave);
    };
  }, [ref, reducedMotion]);
}
