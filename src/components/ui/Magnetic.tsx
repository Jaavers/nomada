"use client";

import { cloneElement, isValidElement, useRef } from "react";
import type { ReactElement, Ref } from "react";
import { useMagneticButton } from "@/hooks/useMagneticButton";

/**
 * Wraps a single interactive element (button/link) with the magnetic pull
 * hook and flags it for CustomCursor's ring scale-up, in one place instead
 * of repeating the ref + data attribute wiring at every call site.
 */
export function Magnetic({ children }: { children: ReactElement }) {
  const ref = useRef<HTMLElement>(null);
  useMagneticButton(ref);

  if (!isValidElement(children)) return children;

  return cloneElement(
    children as ReactElement<{ ref?: Ref<HTMLElement> }>,
    {
      ref,
      "data-cursor-magnet": true,
    } as Partial<{ ref: Ref<HTMLElement> }> & Record<string, unknown>,
  );
}
