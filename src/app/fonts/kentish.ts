import localFont from "next/font/local";

// Only Vol 1 ships: Vol 1 and Vol 2 render visually identical, so loading
// both would just double the font payload for no visual gain.
export const kentishVol1 = localFont({
  src: [
    { path: "./files/kentish-vol1.woff2" },
    { path: "./files/kentish-vol1.ttf" },
  ],
  variable: "--font-kentish-1",
  display: "swap",
});
