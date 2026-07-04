export const SECTIONS = [
  { id: "hero", label: "Inicio" },
  { id: "manifiesto", label: "Manifiesto" },
  { id: "menu", label: "Menú" },
  { id: "origen", label: "Origen" },
  { id: "contacto", label: "Reservas" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];
