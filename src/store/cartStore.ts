import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";
import { SHOP_CONFIG } from "@/config";

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "id" | "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, quantity: number) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
  subtotal: () => number;
  shipping: () => number;
  total: () => number;
  itemCount: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (item) => {
        const lineId = `${item.productId}-${item.variant ?? "default"}`;
        set((state) => {
          const existing = state.items.find((i) => i.id === lineId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === lineId ? { ...i, quantity: i.quantity + (item.quantity ?? 1) } : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                id: lineId,
                productId: item.productId,
                title: item.title,
                price: item.price,
                image: item.image,
                quantity: item.quantity ?? 1,
                variant: item.variant,
                note: item.note,
              },
            ],
          };
        });
      },
      removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      updateQty: (id, quantity) =>
        set((s) => ({
          items: s.items
            .map((i) => (i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i))
            .filter((i) => i.quantity > 0),
        })),
      clear: () => set({ items: [] }),
      setOpen: (open) => set({ isOpen: open }),
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      shipping: () => {
        const sub = get().subtotal();
        if (sub === 0) return 0;
        return sub >= SHOP_CONFIG.freeShippingThreshold ? 0 : SHOP_CONFIG.baseShippingFee;
      },
      total: () => get().subtotal() + get().shipping(),
      itemCount: () => get().items.reduce((n, i) => n + i.quantity, 0),
    }),
    { name: "twm-cart-v2" }
  )
);

export function buildWhatsAppOrderUrl(params: {
  name: string;
  phone: string;
  address?: string;
  pickup: boolean;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}): string {
  const lines = [
    "🛒 *New order — The World Mobile*",
    "",
    ...params.items.map(
      (i) =>
        `• ${i.title}${i.variant ? ` (${i.variant})` : ""} x${i.quantity} — €${(i.price * i.quantity).toFixed(2)}`
    ),
    "",
    `Subtotal: €${params.subtotal.toFixed(2)}`,
    `Shipping: €${params.shipping.toFixed(2)}`,
    `*Total: €${params.total.toFixed(2)}*`,
    "",
    `Name: ${params.name}`,
    `Phone: ${params.phone}`,
    params.pickup ? "Delivery: Store pickup" : `Address: ${params.address ?? ""}`,
  ];
  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${text}`;
}
