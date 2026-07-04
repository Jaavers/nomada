"use client";

import { createContext, useContext, useEffect, useState } from "react";

const MotionPrefsContext = createContext(false);

export function useReducedMotionValue() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mql.matches);
    const listener = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener("change", listener);
    return () => mql.removeEventListener("change", listener);
  }, []);

  return reduced;
}

export const MotionPrefsProvider = MotionPrefsContext.Provider;

export function useMotionPrefs() {
  return useContext(MotionPrefsContext);
}
