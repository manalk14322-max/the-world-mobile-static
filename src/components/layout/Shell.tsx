import { Link, NavLink } from "react-router-dom";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useI18n } from "@/i18n/I18nProvider";
import { asset, SHOP_CONFIG } from "@/config";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition-colors ${isActive ? "text-brand-400" : "text-slate-300 hover:text-white"}`;

export function Header() {
  const { t, lang, setLang } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const count = useCartStore((s) => s.itemCount());
  const setOpen = useCartStore((s) => s.setOpen);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    window.location.href = q ? `/shop?q=${encodeURIComponent(q)}` : "/shop";
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:gap-6">
        <Link to="/" className="flex shrink-0 items-center gap-2" onClick={() => setMenuOpen(false)}>
          <img src={asset("assets/the-world-mobile-logo.jpeg")} alt="" className="h-10 w-10 rounded-xl object-cover ring-1 ring-white/10" />
          <span className="hidden font-display text-lg font-semibold tracking-tight text-white sm:inline">
            The World <span className="text-brand-400">Mobile</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main">
          <NavLink to="/shop" className={navLinkClass}>
            {t("nav_shop")}
          </NavLink>
          <NavLink to="/customize" className={navLinkClass}>
            {t("nav_custom")}
          </NavLink>
          <a href="/#repairs" className={navLinkClass}>
            {t("nav_repairs")}
          </a>
          <NavLink to="/about" className={navLinkClass}>
            {t("nav_about")}
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            {t("nav_contact")}
          </NavLink>
        </nav>

        <form onSubmit={onSearch} className="relative ml-auto hidden max-w-xs flex-1 md:block lg:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search_placeholder")}
            className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-brand-500/50 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </form>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => setLang(lang === "en" ? "es" : "en")}
            className="rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5"
            aria-label="Switch language"
          >
            {t("lang_switch")}
          </button>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="relative rounded-full p-2.5 text-slate-200 hover:bg-white/5"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </button>
          <button
            type="button"
            className="rounded-full p-2.5 text-slate-200 hover:bg-white/5 lg:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-white/5 bg-surface-raised px-4 py-4 lg:hidden">
          <form onSubmit={onSearch} className="relative mb-4 md:hidden">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("search_placeholder")}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white"
            />
          </form>
          <nav className="flex flex-col gap-1">
            {[
              ["/shop", t("nav_shop")],
              ["/customize", t("nav_custom")],
              ["/#repairs", t("nav_repairs")],
              ["/about", t("nav_about")],
              ["/contact", t("nav_contact")],
            ].map(([to, label]) => (
              <Link
                key={to}
                to={to}
                className="rounded-xl px-3 py-3 text-base font-medium text-slate-200 hover:bg-white/5"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
            <a
              href={`https://wa.me/${SHOP_CONFIG.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 rounded-xl bg-emerald-600 px-3 py-3 text-center font-semibold text-white"
            >
              WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-auto border-t border-white/5 bg-surface-raised">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-lg font-semibold text-white">The World Mobile</p>
          <p className="mt-2 text-sm text-slate-400">{t("footer_tagline")}</p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-slate-400">
          <Link to="/shop" className="hover:text-white">
            Shop
          </Link>
          <Link to="/customize" className="hover:text-white">
            Custom designer
          </Link>
          <Link to="/about" className="hover:text-white">
            About
          </Link>
          <Link to="/contact" className="hover:text-white">
            Contact
          </Link>
        </div>
        <div className="text-sm text-slate-400">
          <p>© {new Date().getFullYear()} The World Mobile</p>
          <a href="/admin.html" className="mt-2 inline-block text-slate-500 hover:text-slate-300">
            Admin
          </a>
        </div>
      </div>
    </footer>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-slate-100">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
