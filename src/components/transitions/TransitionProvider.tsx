"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
} from "react";
import { gsap } from "@/lib/gsap/gsapConfig";
import { useMotionPrefs } from "@/lib/motion-prefs";
import { CurtainOverlay } from "./CurtainOverlay";

/**
 * Single shared curtain overlay driving every "page-like" transition in the
 * app (overlay menu today, routed page changes in Phase 2). Keeping one DOM
 * overlay avoids stacking-context bugs from multiple ad hoc panels, and
 * keeps the choreography (easing, timing) consistent everywhere.
 */
type TransitionContextValue = {
  coverOverlay: () => Promise<void>;
  revealOverlay: () => Promise<void>;
  runTransition: (onMidpoint?: () => void | Promise<void>) => Promise<void>;
};

const TransitionContext = createContext<TransitionContextValue | null>(null);

export function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useMotionPrefs();

  const ease = reducedMotion ? "none" : "expo.inOut";
  const duration = reducedMotion ? 0.001 : 0.9;

  const coverOverlay = useCallback(() => {
    return new Promise<void>((resolve) => {
      if (!overlayRef.current) return resolve();
      gsap.to(overlayRef.current, {
        scaleY: 1,
        duration,
        ease,
        transformOrigin: "top",
        onComplete: () => resolve(),
      });
    });
  }, [duration, ease]);

  const revealOverlay = useCallback(() => {
    return new Promise<void>((resolve) => {
      if (!overlayRef.current) return resolve();
      gsap.to(overlayRef.current, {
        scaleY: 0,
        duration,
        ease,
        transformOrigin: "bottom",
        onComplete: () => resolve(),
      });
    });
  }, [duration, ease]);

  const runTransition = useCallback(
    async (onMidpoint?: () => void | Promise<void>) => {
      await coverOverlay();
      if (onMidpoint) await onMidpoint();
      await revealOverlay();
    },
    [coverOverlay, revealOverlay],
  );

  return (
    <TransitionContext.Provider
      value={{ coverOverlay, revealOverlay, runTransition }}
    >
      {children}
      <CurtainOverlay ref={overlayRef} />
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const ctx = useContext(TransitionContext);
  if (!ctx) {
    throw new Error("useTransition must be used within a TransitionProvider");
  }
  return ctx;
}
