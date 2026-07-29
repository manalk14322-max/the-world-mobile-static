import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { useCartStore } from "@/store/cartStore";
import { SHOP_CONFIG } from "@/config";

const MODELS = ["iPhone 16 Pro Max", "iPhone 15 Pro", "Samsung S24 Ultra", "Pixel 8 Pro"];

export function CustomizePage() {
  const { t } = useI18n();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState(MODELS[0]);
  const [bg, setBg] = useState("#ffffff");
  const [text, setText] = useState("");
  const [textColor, setTextColor] = useState("#111827");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const imageObj = useRef<HTMLImageElement | null>(null);
  const addItem = useCartStore((s) => s.addItem);
  const setOpen = useCartStore((s) => s.setOpen);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = bg;
    ctx.fillRect(40, 20, w - 80, h - 40);
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 3;
    ctx.strokeRect(40, 20, w - 80, h - 40);
    if (imageObj.current) {
      const img = imageObj.current;
      const maxW = w - 120;
      const maxH = h - 120;
      const ratio = Math.min(maxW / img.width, maxH / img.height);
      const iw = img.width * ratio;
      const ih = img.height * ratio;
      ctx.drawImage(img, (w - iw) / 2, (h - ih) / 2 + 10, iw, ih);
    }
    if (text.trim()) {
      ctx.fillStyle = textColor;
      ctx.font = "bold 22px Outfit, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(text, w / 2, h - 36);
    }
  }, [bg, text, textColor]);

  useEffect(() => {
    draw();
  }, [draw, imageSrc]);

  const onUpload = (file: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    const img = new Image();
    img.onload = () => {
      imageObj.current = img;
      draw();
    };
    img.src = url;
  };

  const addToCart = () => {
    addItem({
      productId: "photo-cover-custom",
      title: `Custom Photo Cover — ${model}`,
      price: 24.99,
      image: "assets/custom-case-floral-book.jpeg",
      variant: model,
      note: text ? `Text: ${text}` : undefined,
    });
    setOpen(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">{t("nav_custom")}</h1>
      <p className="mt-2 max-w-2xl text-slate-400">
        Upload your photo, add optional text, and send the design with your WhatsApp order. Our team prints in premium quality.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="rounded-3xl border border-white/10 bg-slate-900/30 p-4 sm:p-6">
          <canvas ref={canvasRef} width={480} height={720} className="mx-auto max-h-[70vh] w-full max-w-sm rounded-2xl shadow-card" />
        </div>
        <div className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <label className="block">
            <span className="text-xs font-medium text-slate-400">Phone model</span>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-surface px-3 py-3 text-sm"
            >
              {MODELS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-medium text-slate-400">Background</span>
            <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="mt-2 h-10 w-full cursor-pointer rounded-lg" />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-slate-400">Upload photo</span>
            <input
              type="file"
              accept="image/*"
              className="mt-2 w-full text-sm text-slate-400 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-600 file:px-3 file:py-2 file:text-white"
              onChange={(e) => onUpload(e.target.files?.[0] ?? null)}
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-slate-400">Custom text</span>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-surface px-3 py-3 text-sm"
              placeholder="Name, quote…"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-slate-400">Text color</span>
            <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="mt-2 h-10 w-full cursor-pointer rounded-lg" />
          </label>
          <p className="text-sm text-slate-500">
            From {SHOP_CONFIG.currency}24.99 — final preview confirmed on WhatsApp.
          </p>
          <button
            type="button"
            onClick={addToCart}
            className="w-full rounded-xl bg-brand-600 py-3 font-bold text-white hover:bg-brand-500"
          >
            {t("add_cart")}
          </button>
        </div>
      </div>
    </div>
  );
}
