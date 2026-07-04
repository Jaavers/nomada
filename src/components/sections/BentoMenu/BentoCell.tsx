"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap/gsapConfig";
import { useMotionPrefs } from "@/lib/motion-prefs";
import type { Product } from "@/types/product";

export function BentoCell({ product }: { product: Product }) {
  const cellRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useMotionPrefs();

  function handleEnter() {
    if (reducedMotion || !cellRef.current) return;
    gsap.to(cellRef.current, {
      y: -6,
      scale: 1.015,
      duration: 0.4,
      ease: "power3.out",
    });
  }

  function handleLeave() {
    if (reducedMotion || !cellRef.current) return;
    gsap.to(cellRef.current, {
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: "power3.out",
    });
  }

  const secondaryLabel = product.category === "cafe" ? "Origen" : "Detalle";
  const secondaryText =
    product.category === "cafe" ? product.origin : product.detail;

  return (
    <div
      ref={cellRef}
      data-product-id={product.id}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
      className="border-absolute/10 flex flex-col justify-between gap-4 rounded-2xl border bg-white/60 p-6 shadow-sm"
    >
      <div className="flex flex-col gap-2">
        <h3 className="font-display text-xl leading-tight text-absolute">
          {product.name}
        </h3>
        {secondaryText && (
          <p className="text-xs tracking-wide text-forest">
            {secondaryLabel}: {secondaryText}
          </p>
        )}
        {product.notes && (
          <p className="font-serif-italic text-sm text-absolute/70 italic">
            {product.notes}
          </p>
        )}
      </div>
      <p className="text-latte text-lg font-medium">
        ${product.price.toFixed(2)}
      </p>
    </div>
  );
}
