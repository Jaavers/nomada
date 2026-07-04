import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Product } from "@/types/product";

export async function getProducts(): Promise<Product[]> {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    console.warn("[BentoMenu] Supabase client is not initialized (missing environment variables).");
    return [];
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("category", { ascending: true })
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[BentoMenu] failed to load products:", error.message);
    return [];
  }

  return data as Product[];
}
