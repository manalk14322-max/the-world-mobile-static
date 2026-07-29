import { SHOP_CONFIG } from "@/config";

export function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl font-bold text-white">About The World Mobile</h1>
      <div className="prose prose-invert mt-8 max-w-none space-y-4 text-slate-400">
        <p>
          We are a Spain-based mobile lifestyle store specializing in custom printed cases, premium accessories, and
          professional smartphone repairs.
        </p>
        <p>
          Every order is handled with care — from photo cover design to screen protectors and same-week repair slots.
          Questions? Message us anytime on WhatsApp.
        </p>
        <a
          href={`https://wa.me/${SHOP_CONFIG.whatsappNumber}`}
          className="inline-flex rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white"
        >
          WhatsApp {SHOP_CONFIG.whatsappNumber}
        </a>
      </div>
    </div>
  );
}

export function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl font-bold text-white">Contact</h1>
      <p className="mt-4 text-slate-400">Fastest response via WhatsApp — we typically reply within business hours.</p>
      <div className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <p>
          <span className="text-slate-500">WhatsApp:</span>{" "}
          <a href={`https://wa.me/${SHOP_CONFIG.whatsappNumber}`} className="font-semibold text-emerald-400">
            +{SHOP_CONFIG.whatsappNumber}
          </a>
        </p>
        <p className="text-sm text-slate-500">Store pickup and delivery available across Spain.</p>
      </div>
    </div>
  );
}
