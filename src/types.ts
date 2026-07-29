export type Product = {
  id: string;
  title: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  description: string;
  badge?: "new" | "sale" | "trending";
  options?: string[];
  isCustom?: boolean;
};

export type CartItem = {
  id: string;
  productId: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  variant?: string;
  note?: string;
};

export type Lang = "en" | "es";
