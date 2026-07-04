"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap/gsapConfig";
import { useMotionPrefs } from "@/lib/motion-prefs";
import { useTransition } from "@/components/transitions/TransitionProvider";
import { Magnetic } from "@/components/ui/Magnetic";
import { SECTIONS } from "@/lib/constants";

export function OverlayMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { coverOverlay, revealOverlay } = useTransition();
  const listRef = useRef<HTMLUListElement>(null);
  const reducedMotion = useMotionPrefs();

  async function handleClose() {
    if (listRef.current) {
      gsap.to(listRef.current.children, {
        opacity: 0,
        y: reducedMotion ? 0 : 12,
        duration: reducedMotion ? 0.05 : 0.3,
        stagger: reducedMotion ? 0 : 0.03,
        ease: "power2.in",
      });
    }
    await revealOverlay();
    onClose();
  }

  function handleOpenAnimation(node: HTMLUListElement | null) {
    if (!node) return;
    coverOverlay().then(() => {
      gsap.fromTo(
        node.children,
        { opacity: 0, y: reducedMotion ? 0 : 24 },
        {
          opacity: 1,
          y: 0,
          duration: reducedMotion ? 0.05 : 0.6,
          stagger: reducedMotion ? 0 : 0.06,
          ease: "expo.out",
        },
      );
    });
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex flex-col items-center justify-center">
      <Magnetic>
        <button
          type="button"
          onClick={handleClose}
          className="text-sand absolute top-4 right-4 flex min-h-11 min-w-11 items-center justify-center px-3 text-sm tracking-widest uppercase"
        >
          Cerrar
        </button>
      </Magnetic>
      <ul
        ref={(node) => {
          listRef.current = node;
          handleOpenAnimation(node);
        }}
        className="flex flex-col items-center gap-6"
      >
        {SECTIONS.map((section) => (
          <li key={section.id}>
            <Magnetic>
              <a
                href={`#${section.id}`}
                onClick={handleClose}
                className="font-display text-sand hover:text-latte text-4xl transition-colors md:text-6xl"
              >
                {section.label}
              </a>
            </Magnetic>
          </li>
        ))}
      </ul>
    </div>
  );
}
