"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap/gsapConfig";
import { useMotionPrefs } from "@/lib/motion-prefs";
import { onPreloadComplete } from "@/lib/preloadEvents";
import { KineticTitle } from "./KineticTitle";
import { HeroCanvas } from "./HeroCanvas";

export function Hero() {
  const sloganRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useMotionPrefs();

  useEffect(() => {
    const targets = [sloganRef.current, titleRef.current, subRef.current];
    gsap.set(targets, { opacity: 0, y: reducedMotion ? 0 : 28 });
    if (canvasWrapRef.current) gsap.set(canvasWrapRef.current, { opacity: 0 });

    const play = () => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.to(targets, {
        opacity: 1,
        y: 0,
        duration: reducedMotion ? 0.05 : 1,
        stagger: reducedMotion ? 0 : 0.12,
      });
      if (canvasWrapRef.current) {
        tl.to(
          canvasWrapRef.current,
          { opacity: 1, duration: reducedMotion ? 0.05 : 1.2 },
          "-=0.6",
        );
      }
    };

    return onPreloadComplete(play);
  }, [reducedMotion]);

  return (
    <section
      id="hero"
      className="bg-nomada-dark relative flex min-h-screen flex-col justify-center gap-8 overflow-hidden px-6 py-32 md:px-16"
    >
      <div ref={canvasWrapRef} className="absolute inset-0">
        <HeroCanvas />
      </div>
      <p
        ref={sloganRef}
        className="font-serif-italic text-latte relative z-10 text-lg italic md:text-xl"
      >
        Procesos lentos, tecnología fluida.
      </p>
      <KineticTitle>
        <h1
          ref={titleRef}
          className="font-display relative z-10 -tracking-[0.02em] leading-[0.9] text-[length:var(--font-size-display-lg)] text-sand"
        >
          NÓMADA
        </h1>
      </KineticTitle>
      <p
        ref={subRef}
        className="font-serif-italic text-latte relative z-10 max-w-md text-lg italic"
      >
        Café de Origen — Valdivia, sur de Chile.
      </p>
    </section>
  );
}
