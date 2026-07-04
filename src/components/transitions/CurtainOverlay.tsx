"use client";

import { forwardRef } from "react";

export const CurtainOverlay = forwardRef<HTMLDivElement>(function CurtainOverlay(
  _props,
  ref,
) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="bg-forest pointer-events-none fixed inset-0 z-[80] origin-top"
      style={{ transform: "scaleY(0)" }}
    />
  );
});
