import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/types";
import { asset, SHOP_CONFIG } from "@/config";
import { getCategoryLabel } from "@/data/categories";
import { useI18n } from "@/i18n/I18nProvider";
import { useCartStore } from "@/store/cartStore";

export function ProductCard({ product }: { product: Product }) {
  const { lang, t } = useI18n();
  const addItem = useCartStore((s) => s.addItem);
  const setOpen = useCartStore((s) => s.setOpen);

  const onAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.isCustom) {
      window.location.href = "/customize";
      return;
    }
    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
    });
    setOpen(true);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] shadow-card transition hover:border-brand-500/30 hover:shadow-glow"
    >
      <Link to={`/product/${product.id}`} className="relative block aspect-[4/5] overflow-hidden bg-slate-900/50">
        {product.badge && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-brand-500/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            {product.badge}
          </span>
        )}
        <img
          src={asset(product.image)}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-brand-400/90">
          {getCategoryLabel(product.category, lang)}
        </p>
        <h3 className="line-clamp-2 font-display text-base font-semibold leading-snug text-white">
          <Link to={`/product/${product.id}`} className="hover:text-brand-300">
            {product.title}
          </Link>
        </h3>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div>
            <span className="text-lg font-bold text-white">
              {SHOP_CONFIG.currency}
              {product.price.toFixed(2)}
            </span>
            {product.oldPrice != null && (
              <span className="ml-2 text-sm text-slate-500 line-through">
                {SHOP_CONFIG.currency}
                {product.oldPrice.toFixed(2)}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-brand-500"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {t("add_cart")}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
