import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES, getCategoryLabel } from "@/data/categories";
import { useProducts } from "@/context/ProductsProvider";
import { useI18n } from "@/i18n/I18nProvider";

export function ShopPage() {
  const { lang } = useI18n();
  const { products, loading } = useProducts();
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "all";
  const q = (params.get("q") || "").trim().toLowerCase();

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = category === "all" || p.category === category;
      const matchQ =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [products, category, q]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
        {category === "all" ? "Catalog" : getCategoryLabel(category, lang)}
      </h1>
      {q && <p className="mt-2 text-slate-400">Results for “{params.get("q")}”</p>}

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {CATEGORIES.map((cat) => {
          const active = category === cat.key;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => {
                const next = new URLSearchParams(params);
                if (cat.key === "all") next.delete("category");
                else next.set("category", cat.key);
                setParams(next);
              }}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                active ? "bg-brand-600 text-white" : "bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              {lang === "es" ? cat.nameEs : cat.nameEn}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="mt-16 text-center text-slate-400">No products match your filters.</p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
