import { useMemo, useState } from "react";
import { MessageCircle, Wrench } from "lucide-react";
import { REPAIR_BRANDS, REPAIR_DURATIONS, REPAIR_ISSUES } from "@/data/repairs";
import { useI18n } from "@/i18n/I18nProvider";
import { SHOP_CONFIG } from "@/config";

export function RepairEstimator() {
  const { lang, t } = useI18n();
  const [brandId, setBrandId] = useState("");
  const [modelId, setModelId] = useState("");
  const [issueKey, setIssueKey] = useState("");

  const brand = REPAIR_BRANDS.find((b) => b.id === brandId);
  const models = brand ? Object.entries(brand.models) : [];
  const model = brand && modelId ? brand.models[modelId] : null;

  const price = useMemo(() => {
    if (!model || !issueKey) return null;
    const key = issueKey as keyof typeof model;
    if (key === "name") return null;
    return model[key];
  }, [model, issueKey]);

  const duration = issueKey ? REPAIR_DURATIONS[issueKey] : "—";

  const waText = encodeURIComponent(
    [
      "Hello The World Mobile, I'd like a repair quote:",
      brand?.name,
      model?.name,
      REPAIR_ISSUES.find((i) => i.key === issueKey)?.[lang === "es" ? "labelEs" : "labelEn"],
      price != null ? `Estimated: €${price}` : "",
    ]
      .filter(Boolean)
      .join(" — ")
  );

  return (
    <section id="repairs" className="scroll-mt-24 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-300">
              <Wrench className="h-3.5 w-3.5" />
              Express service
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">{t("section_repairs")}</h2>
            <p className="mt-3 max-w-lg text-slate-400">{t("repair_desc")}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-card">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-xs font-medium text-slate-400">Brand</span>
                <select
                  value={brandId}
                  onChange={(e) => {
                    setBrandId(e.target.value);
                    setModelId("");
                    setIssueKey("");
                  }}
                  className="w-full rounded-xl border border-white/10 bg-surface px-3 py-3 text-sm text-white"
                >
                  <option value="">Select brand</option>
                  {REPAIR_BRANDS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-xs font-medium text-slate-400">Model</span>
                <select
                  value={modelId}
                  disabled={!brandId}
                  onChange={(e) => {
                    setModelId(e.target.value);
                    setIssueKey("");
                  }}
                  className="w-full rounded-xl border border-white/10 bg-surface px-3 py-3 text-sm text-white disabled:opacity-40"
                >
                  <option value="">Select model</option>
                  {models.map(([id, m]) => (
                    <option key={id} value={id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-xs font-medium text-slate-400">Issue</span>
                <select
                  value={issueKey}
                  disabled={!modelId}
                  onChange={(e) => setIssueKey(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-surface px-3 py-3 text-sm text-white disabled:opacity-40"
                >
                  <option value="">Select issue</option>
                  {REPAIR_ISSUES.map((issue) => (
                    <option key={issue.id} value={issue.key}>
                      {lang === "es" ? issue.labelEs : issue.labelEn}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-6 flex flex-wrap items-end justify-between gap-4 rounded-xl bg-brand-950/40 p-4 ring-1 ring-brand-500/20">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Estimate</p>
                <p className="font-display text-3xl font-bold text-white">
                  {price != null ? `${SHOP_CONFIG.currency}${price}` : `${SHOP_CONFIG.currency}—`}
                </p>
                <p className="mt-1 text-sm text-slate-400">Typical time: {duration}</p>
              </div>
              <a
                href={`https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${waText}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-500"
              >
                <MessageCircle className="h-4 w-4" />
                {t("repair_cta")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
