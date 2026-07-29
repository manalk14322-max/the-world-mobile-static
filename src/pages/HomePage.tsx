import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Palette, Shield, Truck, Wrench } from "lucide-react";
import { PhoneHeroScene } from "@/components/3d/PhoneHeroScene";
import { ProductCard } from "@/components/ProductCard";
import { RepairEstimator } from "@/components/RepairEstimator";
import { CATEGORIES } from "@/data/categories";
import { useProducts } from "@/context/ProductsProvider";
import { useI18n } from "@/i18n/I18nProvider";
import { SHOP_CONFIG } from "@/config";

const trust = [
  { icon: Truck, key: "trust_shipping" as const },
  { icon: Shield, key: "trust_quality" as const },
  { icon: Wrench, key: "trust_repair" as const },
  { icon: Palette, key: "trust_support" as const },
];

export function HomePage() {
  const { t } = useI18n();
  const { products, loading } = useProducts();
  const featured = products.slice(0, 8);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/40 via-surface to-surface" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-400">{t("hero_kicker")}</p>
            <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
              {t("hero_title")}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">{t("hero_sub")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-brand-500"
              >
                {t("hero_cta_shop")}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/customize"
                className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                {t("hero_cta_custom")}
              </Link>
              <a
                href={`https://wa.me/${SHOP_CONFIG.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-600/10 px-6 py-3 text-sm font-semibold text-emerald-300 hover:bg-emerald-600/20"
              >
                {t("hero_cta_wa")}
              </a>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15, duration: 0.6 }}>
            <PhoneHeroScene />
          </motion.div>
        </div>
      </section>

      <section className="border-y border-white/5 bg-surface-raised/50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 sm:px-6 md:grid-cols-4">
          {trust.map(({ icon: Icon, key }) => (
            <div key={key} className="flex flex-col items-center gap-2 text-center sm:flex-row sm:text-left">
              <div className="rounded-xl bg-brand-500/10 p-2.5 text-brand-400">
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-xs font-medium text-slate-300 sm:text-sm">{t(key)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">{t("section_categories")}</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {CATEGORIES.filter((c) => c.key !== "all").map((cat) => (
              <Link
                key={cat.key}
                to={`/shop?category=${cat.key}`}
                className="rounded-2xl border border-white/8 bg-gradient-to-br from-white/[0.04] to-transparent p-5 transition hover:border-brand-500/40 hover:shadow-glow"
              >
                <p className="font-display font-semibold text-white">{cat.nameEn}</p>
                <p className="mt-1 text-xs text-slate-500">{cat.nameEs}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16 sm:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">{t("section_featured")}</h2>
            <Link to="/shop" className="text-sm font-semibold text-brand-400 hover:text-brand-300">
              View all →
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-white/5" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <RepairEstimator />
    </>
  );
}
