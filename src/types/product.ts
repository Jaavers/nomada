export type ProductCategory = "cafe" | "pasteleria" | "sandwich" | "dulce";

export type Product = {
  id: string;
  category: ProductCategory;
  name: string;
  origin: string | null;
  detail: string | null;
  notes: string | null;
  price: number;
  display_order: number;
  is_available: boolean;
};

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  cafe: "Cafés",
  pasteleria: "Pastelería",
  sandwich: "Sándwiches",
  dulce: "Dulces",
};
