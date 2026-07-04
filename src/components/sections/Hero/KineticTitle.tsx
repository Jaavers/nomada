"use client";

import { useEffect, useId, useRef } from "react";
import { gsap } from "@/lib/gsap/gsapConfig";
import { useMotionPrefs } from "@/lib/motion-prefs";

/**
 * Liquid/distortion effect on the hero wordmark: an SVG feDisplacementMap
 * whose scale ramps up on pointer movement and springs back to rest (scale
 * 0) with an elastic ease once the pointer goes idle. Lightweight
 * alternative to a shader-text pass; upgrade candidate for Phase 2 if more
 * "liquidity" is wanted.
 */
export function KineticTitle({ children }: { children: React.ReactNode }) {
  const filterId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const displaceRef = useRef<SVGFEDisplacementMapElement>(null);
  const idleTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reducedMotion = useMotionPrefs();

  useEffect(() => {
    if (reducedMotion || !wrapRef.current || !displaceRef.current) return;

    const el = wrapRef.current;
    const displace = displaceRef.current;

    function handleMove() {
      gsap.to(displace, {
        attr: { scale: 70 },
        duration: 0.4,
        ease: "power3.out",
        overwrite: "auto",
      });
      if (idleTimeout.current) clearTimeout(idleTimeout.current);
      idleTimeout.current = setTimeout(() => {
        gsap.to(displace, {
          attr: { scale: 0 },
          duration: 1.1,
          ease: "elastic.out(1, 0.4)",
        });
      }, 120);
    }

    el.addEventListener("pointermove", handleMove);
    return () => {
      el.removeEventListener("pointermove", handleMove);
      if (idleTimeout.current) clearTimeout(idleTimeout.current);
    };
  }, [reducedMotion]);

  return (
    <div ref={wrapRef} style={{ filter: `url(#${filterId})` }}>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id={filterId}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008 0.02"
            numOctaves={2}
            seed={7}
            result="noise"
          />
          <feDisplacementMap
            ref={displaceRef}
            in="SourceGraphic"
            in2="noise"
            scale={0}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
      {children}
    </div>
  );
}
