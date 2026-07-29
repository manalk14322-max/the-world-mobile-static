import { Link, useNavigate, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useProducts } from "@/context/ProductsProvider";
import { getCategoryLabel } from "@/data/categories";
import { useI18n } from "@/i18n/I18nProvider";
import { asset, SHOP_CONFIG } from "@/config";
import { useCartStore } from "@/store/cartStore";

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lang, t } = useI18n();
  const { products, loading } = useProducts();
  const addItem = useCartStore((s) => s.addItem);
  const setOpen = useCartStore((s) => s.setOpen);

  const product = useMemo(() => products.find((p) => p.id === id), [products, id]);
  const [variant, setVariant] = useState("");

  if (loading) {
    return <div className="mx-auto max-w-7xl px-4 py-20 text-center text-slate-400">Loading…</div>;
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-slate-400">Product not found.</p>
        <Link to="/shop" className="mt-4 inline-block text-brand-400">
          Back to shop
        </Link>
      </div>
    );
  }

  const options = product.options ?? [];
  const selected = variant || options[0] || "";

  const onAdd = () => {
    if (product.isCustom) {
      navigate("/customize");
      return;
    }
    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      variant: selected || undefined,
    });
    setOpen(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <nav className="mb-6 text-sm text-slate-500">
        <Link to="/" className="hover:text-white">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link to="/shop" className="hover:text-white">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-300">{product.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40">
          <img src={asset(product.image)} alt="" className="aspect-square w-full object-cover" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-400">
            {getCategoryLabel(product.category, lang)}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">{product.title}</h1>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-white">
              {SHOP_CONFIG.currency}
              {product.price.toFixed(2)}
            </span>
            {product.oldPrice != null && (
              <span className="text-lg text-slate-500 line-through">
                {SHOP_CONFIG.currency}
                {product.oldPrice.toFixed(2)}
              </span>
            )}
          </div>
          <p className="mt-6 leading-relaxed text-slate-400">{product.description}</p>

          {options.length > 0 && (
            <div className="mt-8">
              <p className="mb-2 text-sm font-medium text-slate-300">Model / option</p>
              <div className="flex flex-wrap gap-2">
                {options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setVariant(opt)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold ${
                      selected === opt ? "bg-brand-600 text-white" : "bg-white/5 text-slate-400"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={onAdd}
            className="mt-10 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 py-4 text-base font-bold text-white hover:bg-brand-500 sm:w-auto sm:px-10"
          >
            <ShoppingCart className="h-5 w-5" />
            {product.isCustom ? t("hero_cta_custom") : t("add_cart")}
          </button>
        </div>
      </div>
    </div>
  );
}
