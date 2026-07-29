import { useEffect, useState } from "react";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore, buildWhatsAppOrderUrl } from "@/store/cartStore";
import { useI18n } from "@/i18n/I18nProvider";
import { asset, SHOP_CONFIG } from "@/config";

export function CartDrawer() {
  const { t } = useI18n();
  const isOpen = useCartStore((s) => s.isOpen);
  const setOpen = useCartStore((s) => s.setOpen);
  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.subtotal());
  const shipping = useCartStore((s) => s.shipping());
  const total = useCartStore((s) => s.total());

  const [pickup, setPickup] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const checkout = () => {
    if (!name.trim() || !phone.trim()) return;
    const url = buildWhatsAppOrderUrl({
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      pickup,
      items,
      subtotal,
      shipping,
      total,
    });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Close cart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-white/10 bg-surface-raised shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <h2 className="font-display text-lg font-semibold">{t("cart_title")}</h2>
              <button type="button" onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-white/5">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <p className="py-12 text-center text-slate-400">{t("cart_empty")}</p>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-3">
                      <img src={asset(item.image)} alt="" className="h-16 w-16 rounded-lg object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">{item.title}</p>
                        {item.variant && <p className="text-xs text-slate-500">{item.variant}</p>}
                        <p className="mt-1 text-sm font-semibold text-brand-400">
                          {SHOP_CONFIG.currency}
                          {(item.price * item.quantity).toFixed(2)}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            type="button"
                            className="rounded-lg border border-white/10 p-1"
                            onClick={() => updateQty(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="min-w-[1.5rem] text-center text-sm">{item.quantity}</span>
                          <button
                            type="button"
                            className="rounded-lg border border-white/10 p-1"
                            onClick={() => updateQty(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            className="ml-auto text-slate-500 hover:text-red-400"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-white/10 px-5 py-4">
                <div className="mb-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPickup(true)}
                    className={`flex-1 rounded-xl py-2 text-xs font-semibold ${pickup ? "bg-brand-600 text-white" : "bg-white/5 text-slate-400"}`}
                  >
                    {t("pickup")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPickup(false)}
                    className={`flex-1 rounded-xl py-2 text-xs font-semibold ${!pickup ? "bg-brand-600 text-white" : "bg-white/5 text-slate-400"}`}
                  >
                    {t("delivery")}
                  </button>
                </div>
                <div className="space-y-2">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("name")}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm"
                  />
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t("phone")}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm"
                  />
                  {!pickup && (
                    <input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={t("address")}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm"
                    />
                  )}
                </div>
                <div className="mt-4 space-y-1 text-sm text-slate-400">
                  <div className="flex justify-between">
                    <span>{t("subtotal")}</span>
                    <span>
                      {SHOP_CONFIG.currency}
                      {subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("shipping")}</span>
                    <span>
                      {shipping === 0 && subtotal > 0 ? t("free_shipping") : `${SHOP_CONFIG.currency}${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-semibold text-white">
                    <span>{t("total")}</span>
                    <span>
                      {SHOP_CONFIG.currency}
                      {total.toFixed(2)}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={checkout}
                  disabled={!name.trim() || !phone.trim()}
                  className="mt-4 w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white transition hover:bg-emerald-500 disabled:opacity-40"
                >
                  {t("checkout")}
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
