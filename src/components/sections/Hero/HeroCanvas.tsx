"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const HeroCanvasScene = dynamic(() => import("./HeroCanvasScene"), {
  ssr: false,
});

/**
 * Mobile gate: below 768px we skip mounting the R3F/WebGL bundle entirely
 * and show a lightweight CSS gradient instead, rather than cutting by a
 * binary device-detection heuristic.
 */
export function HeroCanvas() {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    setShouldRender(mql.matches);
    const listener = (e: MediaQueryListEvent) => setShouldRender(e.matches);
    mql.addEventListener("change", listener);
    return () => mql.removeEventListener("change", listener);
  }, []);

  if (!shouldRender) {
    return (
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 70% 30%, rgba(196,164,130,0.12), transparent 60%)",
        }}
      />
    );
  }

  return (
    <div className="absolute inset-0">
      <HeroCanvasScene />
    </div>
  );
}
