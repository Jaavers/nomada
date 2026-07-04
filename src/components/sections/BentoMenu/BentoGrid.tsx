"use client";

import { useMemo, useRef, useState } from "react";
import { gsap } from "@/lib/gsap/gsapConfig";
import { Flip } from "gsap/Flip";
import { useMotionPrefs } from "@/lib/motion-prefs";
import { CATEGORY_LABELS, type Product, type ProductCategory } from "@/types/product";
import { BentoCell } from "./BentoCell";

gsap.registerPlugin(Flip);

const CATEGORIES: Array<ProductCategory | "todos"> = [
  "todos",
  "cafe",
  "pasteleria",
  "sandwich",
  "dulce",
];

export function BentoGrid({ products }: { products: Product[] }) {
  const [category, setCategory] = useState<ProductCategory | "todos">("todos");
  const [query, setQuery] = useState("");
  const gridRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useMotionPrefs();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCategory = category === "todos" || p.category === category;
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.notes?.toLowerCase().includes(q) ||
        p.detail?.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [products, category, query]);

  function applyFilter(next: { category?: typeof category; query?: string }) {
    if (!gridRef.current || reducedMotion) {
      if (next.category !== undefined) setCategory(next.category);
      if (next.query !== undefined) setQuery(next.query);
      return;
    }
    const state = Flip.getState(gridRef.current.children);
    if (next.category !== undefined) setCategory(next.category);
    if (next.query !== undefined) setQuery(next.query);
    requestAnimationFrame(() => {
      Flip.from(state, {
        duration: 0.5,
        ease: "power3.inOut",
        scale: true,
        absolute: true,
      });
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              data-cursor-magnet
              onClick={() => applyFilter({ category: c })}
              className={`rounded-full px-4 py-2 text-sm tracking-wide transition-colors ${
                category === c
                  ? "bg-forest text-sand"
                  : "text-absolute/70 border-absolute/20 border"
              }`}
            >
              {c === "todos" ? "Todos" : CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>
        <input
          type="text"
          aria-label="Buscar en el menú por nombre o notas"
          value={query}
          onChange={(e) => applyFilter({ query: e.target.value })}
          placeholder="Buscar por nombre o notas…"
          className="border-absolute/20 focus:border-forest w-full max-w-xs rounded-full border bg-white/60 px-4 py-2 text-sm outline-none md:w-64"
        />
      </div>

      <div
        ref={gridRef}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {filtered.map((product) => (
          <BentoCell key={product.id} product={product} />
        ))}
        {filtered.length === 0 && (
          <p className="text-absolute/60 col-span-full py-12 text-center">
            Sin resultados para este filtro.
          </p>
        )}
      </div>
    </div>
  );
}
