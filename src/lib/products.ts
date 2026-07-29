import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { FALLBACK_CATALOG } from "@/data/catalog";
import { SUPABASE_CONFIG } from "@/config";
import type { Product } from "@/types";

let client: SupabaseClient | null = null;

function getClient(): SupabaseClient | null {
  if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) return null;
  if (!client) {
    client = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
  }
  return client;
}

function normalizeRow(row: Record<string, unknown>): Product {
  return {
    id: String(row.id),
    title: String(row.title ?? ""),
    category: String(row.category ?? "mobile-accessories"),
    price: Number(row.price ?? 0),
    oldPrice: row.old_price != null ? Number(row.old_price) : undefined,
    image: String(row.image_url ?? ""),
    description: String(row.description ?? ""),
    badge: row.badge as Product["badge"],
    options: Array.isArray(row.options) ? (row.options as string[]) : [],
    isCustom: Boolean(row.is_custom),
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const sb = getClient();
  if (!sb) return FALLBACK_CATALOG;

  try {
    const { data, error } = await sb
      .from(SUPABASE_CONFIG.productsTable)
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    if (!data?.length) return FALLBACK_CATALOG;

    const remote = data.map((row) => normalizeRow(row as Record<string, unknown>));
    const remoteIds = new Set(remote.map((p) => p.id));
    const localOnly = FALLBACK_CATALOG.filter((p) => !remoteIds.has(p.id));
    return [...remote, ...localOnly];
  } catch {
    return FALLBACK_CATALOG;
  }
}

export function getProductById(products: Product[], id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
