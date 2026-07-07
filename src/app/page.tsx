import { Hero } from "@/components/sections/Hero/Hero";
import { Manifiesto } from "@/components/sections/Manifiesto/Manifiesto";
import { BentoMenu } from "@/components/sections/BentoMenu/BentoMenu";
import { OrigenGrano } from "@/components/sections/OrigenGrano/OrigenGrano";
import { ContactoReservas } from "@/components/sections/ContactoReservas/ContactoReservas";
import { Footer } from "@/components/sections/Footer/Footer";

export const dynamic = "force-dynamic";


export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <Manifiesto />
      <BentoMenu />
      <OrigenGrano />
      <ContactoReservas />
      <Footer />
    </main>
  );
}
