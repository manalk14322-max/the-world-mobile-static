export const CATEGORIES = [
  { key: "all", nameEn: "All products", nameEs: "Todos", icon: "grid" },
  { key: "photo-cover", nameEn: "Custom photo covers", nameEs: "Fundas personalizadas", icon: "palette" },
  { key: "iphone-covers", nameEn: "iPhone covers", nameEs: "Fundas iPhone", icon: "smartphone" },
  { key: "samsung-covers", nameEn: "Samsung covers", nameEs: "Fundas Samsung", icon: "smartphone" },
  { key: "screen-protectors", nameEn: "Screen protectors", nameEs: "Protectores", icon: "shield" },
  { key: "mobile-accessories", nameEn: "Accessories", nameEs: "Accesorios", icon: "plug" },
  { key: "offers", nameEn: "Offers", nameEs: "Ofertas", icon: "percent" },
] as const;

export type CategoryKey = (typeof CATEGORIES)[number]["key"];

export function getCategoryLabel(key: string, lang: "en" | "es"): string {
  const cat = CATEGORIES.find((c) => c.key === key);
  if (!cat) return key;
  return lang === "es" ? cat.nameEs : cat.nameEn;
}
