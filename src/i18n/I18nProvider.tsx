import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Lang } from "@/types";

const messages = {
  en: {
    nav_shop: "Shop",
    nav_custom: "Design yours",
    nav_repairs: "Repairs",
    nav_about: "About",
    nav_contact: "Contact",
    hero_kicker: "Premium mobile lifestyle",
    hero_title: "Cases, accessories & repairs — reimagined",
    hero_sub:
      "Custom photo printing, curated accessories, and express repair estimates. Shop in seconds, checkout on WhatsApp.",
    hero_cta_shop: "Browse catalog",
    hero_cta_custom: "Start designing",
    hero_cta_wa: "Chat on WhatsApp",
    trust_shipping: "Fast shipping in Spain",
    trust_quality: "Premium print quality",
    trust_repair: "Express repairs",
    trust_support: "Human support",
    section_categories: "Shop by category",
    section_featured: "Featured products",
    section_repairs: "Instant repair estimate",
    repair_desc: "Pick brand, model, and issue for a transparent quote before you visit.",
    repair_cta: "Book via WhatsApp",
    footer_tagline: "Your mobile world — protected and personalized.",
    search_placeholder: "Search cases, models, accessories…",
    add_cart: "Add to cart",
    view: "View details",
    cart_title: "Your bag",
    cart_empty: "Your bag is empty",
    checkout: "Order on WhatsApp",
    pickup: "Store pickup",
    delivery: "Home delivery",
    name: "Name",
    phone: "Phone",
    address: "Address",
    subtotal: "Subtotal",
    shipping: "Shipping",
    total: "Total",
    free_shipping: "Free shipping unlocked",
    lang_switch: "ES",
  },
  es: {
    nav_shop: "Tienda",
    nav_custom: "Diseña la tuya",
    nav_repairs: "Reparaciones",
    nav_about: "Nosotros",
    nav_contact: "Contacto",
    hero_kicker: "Estilo móvil premium",
    hero_title: "Fundas, accesorios y reparaciones — reinventado",
    hero_sub:
      "Impresión personalizada, accesorios seleccionados y presupuestos rápidos. Compra en segundos y paga por WhatsApp.",
    hero_cta_shop: "Ver catálogo",
    hero_cta_custom: "Empezar diseño",
    hero_cta_wa: "WhatsApp",
    trust_shipping: "Envío rápido en España",
    trust_quality: "Calidad de impresión",
    trust_repair: "Reparación express",
    trust_support: "Atención humana",
    section_categories: "Comprar por categoría",
    section_featured: "Productos destacados",
    section_repairs: "Presupuesto de reparación",
    repair_desc: "Elige marca, modelo y avería para un precio claro antes de venir.",
    repair_cta: "Reservar por WhatsApp",
    footer_tagline: "Tu mundo móvil — protegido y personalizado.",
    search_placeholder: "Buscar fundas, modelos, accesorios…",
    add_cart: "Añadir",
    view: "Ver detalle",
    cart_title: "Tu cesta",
    cart_empty: "Tu cesta está vacía",
    checkout: "Pedir por WhatsApp",
    pickup: "Recogida en tienda",
    delivery: "Envío a domicilio",
    name: "Nombre",
    phone: "Teléfono",
    address: "Dirección",
    subtotal: "Subtotal",
    shipping: "Envío",
    total: "Total",
    free_shipping: "Envío gratis activado",
    lang_switch: "EN",
  },
} as const;

type MessageKey = keyof (typeof messages)["en"];

type I18nContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: MessageKey) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = localStorage.getItem("twm_lang");
    if (stored === "en" || stored === "es") return stored;
    return navigator.language.startsWith("es") ? "es" : "en";
  });

  const setLang = (next: Lang) => {
    localStorage.setItem("twm_lang", next);
    setLangState(next);
  };

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: (key: MessageKey) => messages[lang][key] ?? messages.en[key],
    }),
    [lang]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
