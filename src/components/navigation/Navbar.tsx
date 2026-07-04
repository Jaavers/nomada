"use client";

import { useState } from "react";
import { OverlayMenu } from "./OverlayMenu";
import { SoundToggle } from "@/components/sound/SoundToggle";
import { Magnetic } from "@/components/ui/Magnetic";
import { useSound } from "@/hooks/useSound";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { play } = useSound();

  function handleOpen() {
    play("menuOpen");
    setOpen(true);
  }

  function handleClose() {
    play("menuClose");
    setOpen(false);
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[70] flex items-center justify-between px-6 py-5 md:px-10">
        <Magnetic>
          <a href="#hero" className="font-display text-sand text-lg tracking-wide">
            NÓMADA
          </a>
        </Magnetic>
        <div className="flex items-center gap-4">
          <SoundToggle />
          <Magnetic>
            <button
              type="button"
              onClick={handleOpen}
              className="text-sand flex min-h-11 min-w-11 items-center justify-center px-3 text-sm tracking-widest uppercase"
              aria-label="Abrir menú"
              aria-expanded={open}
            >
              Menú
            </button>
          </Magnetic>
        </div>
      </header>
      <OverlayMenu open={open} onClose={handleClose} />
    </>
  );
}
