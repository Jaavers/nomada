"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap/gsapConfig";
import { useMotionPrefs } from "@/lib/motion-prefs";
import grano from "../../../../public/images/grano.png";

export function OrigenGrano() {
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useMotionPrefs();

  useEffect(() => {
    if (reducedMotion || !imageRef.current || !textRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, scale: 1.05, y: 24 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: imageRef.current, start: "top 85%" },
        },
      );
      gsap.fromTo(
        textRef.current!.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: textRef.current, start: "top 85%" },
        },
      );
    });

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="origen"
      className="flex min-h-[80vh] flex-col justify-center gap-10 bg-sand px-6 py-32 text-absolute md:flex-row md:items-center md:gap-16 md:px-16"
    >
      <div ref={textRef} className="flex flex-col gap-6 md:w-1/2">
        <h2 className="font-display text-4xl md:text-6xl">Origen del grano</h2>
        <p className="font-serif-italic max-w-xl text-xl text-forest italic">
          Del valle a la taza: una secuencia de proceso, tueste y extracción.
        </p>
        <p className="text-absolute/70 max-w-md text-sm leading-relaxed">
          Seleccionamos lotes de origen único y controlamos cada variable del
          tueste — tiempo, temperatura, curva — antes de que el grano llegue a
          nuestros métodos de filtrado de alta precisión.
        </p>
      </div>
      <div
        ref={imageRef}
        className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl md:w-1/2"
      >
        <Image
          src={grano}
          alt="Granos de café tostado sobre madera oscura, junto a un dripper de filtrado."
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}
