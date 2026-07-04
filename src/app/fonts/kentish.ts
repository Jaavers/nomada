import localFont from "next/font/local";

export const kentishVol1 = localFont({
  src: [
    { path: "./files/kentish-vol1.woff2", format: "woff2" },
    { path: "./files/kentish-vol1.ttf", format: "truetype" },
  ],
  variable: "--font-kentish-1",
  display: "swap",
});

export const kentishVol2 = localFont({
  src: [
    { path: "./files/kentish-vol2.woff2", format: "woff2" },
    { path: "./files/kentish-vol2.ttf", format: "truetype" },
  ],
  variable: "--font-kentish-2",
  display: "swap",
});
