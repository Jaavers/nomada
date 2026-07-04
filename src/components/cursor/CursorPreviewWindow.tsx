"use client";

import { forwardRef } from "react";

export const CursorPreviewWindow = forwardRef<
  HTMLDivElement,
  { src: string | null }
>(function CursorPreviewWindow({ src }, ref) {
  return (
    <div
      ref={ref}
      className="border-latte/40 pointer-events-none fixed top-0 left-0 z-[65] h-24 w-32 overflow-hidden rounded-lg border bg-cover bg-center opacity-0"
      style={{ backgroundImage: src ? `url(${src})` : undefined }}
    />
  );
});
