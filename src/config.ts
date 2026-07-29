export const SHOP_CONFIG = {
  whatsappNumber: "34674002687",
  baseShippingFee: 4.99,
  freeShippingThreshold: 50,
  currency: "€",
} as const;

export const SUPABASE_CONFIG = {
  url: import.meta.env.VITE_SUPABASE_URL ?? "",
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ?? "",
  productsTable: "products",
} as const;

export function asset(path: string): string {
  if (path.startsWith("http") || path.startsWith("/")) return path;
  return `/${path.replace(/^\//, "")}`;
}
