"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap/gsapConfig";
import { CursorPreviewWindow } from "./CursorPreviewWindow";

/**
 * Global custom cursor: a lagging ring + tight dot following the pointer via
 * quickTo interpolation, a magnetic scale-up over [data-cursor-magnet]
 * elements, and a preview-window mode that shows a thumbnail sourced from
 * [data-preview-src] on menu/catalog items. Bails out entirely on touch
 * devices (native tap targets take over, per the mobile-first requirement).
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(!window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (!enabled || !dotRef.current || !ringRef.current || !previewRef.current)
      return;

    // xPercent/yPercent center the elements on the pointer independently of
    // the x/y translate driven by quickTo below (GSAP composites both into
    // one transform, unlike a Tailwind translate utility which x/y would
    // simply overwrite).
    gsap.set([dotRef.current, ringRef.current, previewRef.current], {
      xPercent: -50,
      yPercent: -50,
    });
    gsap.set(previewRef.current, { scale: 0.85 });

    const dotTo = { x: gsap.quickTo(dotRef.current, "x", { duration: 0.08 }), y: gsap.quickTo(dotRef.current, "y", { duration: 0.08 }) };
    const ringTo = { x: gsap.quickTo(ringRef.current, "x", { duration: 0.35, ease: "power3.out" }), y: gsap.quickTo(ringRef.current, "y", { duration: 0.35, ease: "power3.out" }) };
    const previewTo = { x: gsap.quickTo(previewRef.current, "x", { duration: 0.35, ease: "power3.out" }), y: gsap.quickTo(previewRef.current, "y", { duration: 0.35, ease: "power3.out" }) };

    function handleMove(e: PointerEvent) {
      dotTo.x(e.clientX);
      dotTo.y(e.clientY);
      ringTo.x(e.clientX);
      ringTo.y(e.clientY);
      previewTo.x(e.clientX);
      previewTo.y(e.clientY);
    }

    function handleOver(e: PointerEvent) {
      const target = (e.target as HTMLElement)?.closest(
        "[data-cursor-magnet], [data-preview-src]",
      );
      if (!target || !ringRef.current) return;

      if (target.hasAttribute("data-cursor-magnet")) {
        gsap.to(ringRef.current, { scale: 1.8, duration: 0.3, ease: "power2.out" });
      }
      const src = target.getAttribute("data-preview-src");
      if (src) {
        setPreviewSrc(src);
        gsap.to(previewRef.current, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" });
        gsap.to(ringRef.current, { opacity: 0, duration: 0.2 });
      }
    }

    function handleOut(e: PointerEvent) {
      const target = (e.target as HTMLElement)?.closest(
        "[data-cursor-magnet], [data-preview-src]",
      );
      if (!target || !ringRef.current || !previewRef.current) return;
      gsap.to(ringRef.current, { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" });
      gsap.to(previewRef.current, { opacity: 0, scale: 0.85, duration: 0.25, ease: "power2.in" });
    }

    window.addEventListener("pointermove", handleMove);
    document.addEventListener("pointerover", handleOver);
    document.addEventListener("pointerout", handleOut);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerover", handleOver);
      document.removeEventListener("pointerout", handleOut);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        className="border-latte pointer-events-none fixed top-0 left-0 z-[65] h-9 w-9 rounded-full border mix-blend-difference"
      />
      <div
        ref={dotRef}
        className="bg-sand pointer-events-none fixed top-0 left-0 z-[65] h-1.5 w-1.5 rounded-full mix-blend-difference"
      />
      <CursorPreviewWindow ref={previewRef} src={previewSrc} />
    </>
  );
}
