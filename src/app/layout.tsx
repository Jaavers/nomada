import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import { kentishVol1, kentishVol2 } from "./fonts/kentish";
import { AppProviders } from "@/components/AppProviders";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["italic", "normal"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "NÓMADA · Café de Origen",
  description: "Procesos lentos, tecnología fluida. Café de especialidad en Valdivia, sur de Chile.",
  openGraph: {
    title: "NÓMADA · Café de Origen",
    description: "Procesos lentos, tecnología fluida. Café de especialidad en Valdivia, sur de Chile.",
    locale: "es_CL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${kentishVol1.variable} ${kentishVol2.variable} ${cormorant.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-absolute text-sand">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
