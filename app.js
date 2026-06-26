/**
 * THE WORLD MOBILE - CORE APPLICATION LOGIC
 * Includes: Product Database, Cart Engine, Custom Case Canvas Designer, 
 * Repair Price Matrix, Search/Filter Engine, and WhatsApp API Checkout.
 */

// Configuration
const CONFIG = {
  whatsappNumber: "34600000000", // TODO: Replace with the real WhatsApp number (country code + number, no + or spaces)
  baseShippingFee: 4.99,
  freeShippingThreshold: 50.00,
  currency: "€"
};

// ---------------------------------------------------------
// UTILITY: Toast Notification System
// ---------------------------------------------------------
function showToast(message, type = "info") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const icons = { success: "ti-circle-check", error: "ti-circle-x", info: "ti-info-circle" };
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<i class="ti ${icons[type] || icons.info}"></i><span>${message}</span>`;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add("show"));
  });

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// ---------------------------------------------------------
// UTILITY: Close Cart Drawer (named function for inline use)
// ---------------------------------------------------------
window.closeCartDrawer = function() {
  const cartDrawer = document.getElementById("cart-drawer");
  const backdrop = document.getElementById("drawer-backdrop");
  if (cartDrawer) cartDrawer.classList.remove("open");
  if (backdrop) backdrop.classList.remove("show");
  document.body.classList.remove("drawer-open");
};

const STORE_CATEGORIES = [
  { key: "all", name: "All Products", icon: "ti-apps" },
  { key: "photo-cover", name: "Photo Covers", icon: "ti-paint" },
  { key: "iphone-covers", name: "iPhone Covers", icon: "ti-brand-apple" },
  { key: "samsung-covers", name: "Samsung Covers", icon: "ti-device-mobile" },
  { key: "redmi-covers", name: "Redmi Covers", icon: "ti-device-mobile-rotated" },
  { key: "oppo-covers", name: "Oppo Covers", icon: "ti-bolt" },
  { key: "google-pixel", name: "Google Pixel", icon: "ti-brand-google" },
  { key: "airpod-covers", name: "AirPod Covers", icon: "ti-headset" },
  { key: "screen-protectors", name: "Screen Protectors", icon: "ti-shield" },
  { key: "camera-protectors", name: "Camera Protectors", icon: "ti-camera" },
  { key: "smart-watches", name: "Smart Watches", icon: "ti-device-watch" },
  { key: "watch-bands", name: "Watch Bands", icon: "ti-settings" },
  { key: "sim-cards", name: "SIM Cards", icon: "ti-sim-card" },
  { key: "mobile-accessories", name: "Mobile Accessories", icon: "ti-plug" },
  { key: "cordon", name: "Cordon", icon: "ti-sewing-kit" },
  { key: "travel-adapter", name: "Travel Adapter", icon: "ti-bolt" },
  { key: "memory-cards", name: "Memory Cards", icon: "ti-database" },
  { key: "headphones", name: "Headphones", icon: "ti-headphones" },
  { key: "speakers", name: "Speakers", icon: "ti-volume" },
  { key: "offers", name: "Offers", icon: "ti-percentage" },
  { key: "phones", name: "Phones", icon: "ti-device-mobile" },
  { key: "mobile-repair", name: "Mobile Repair", icon: "ti-tool", target: "repair-section" }
];

// ---------------------------------------------------------
// 1. PRODUCT DATABASE
// ---------------------------------------------------------
const fallbackProducts = [
  // 1. Photo covers (Customizable entry item)
  {
    id: "photo-cover-custom",
    title: "Custom Photo Cover (Design Your Own)",
    category: "photo-cover",
    price: 24.99,
    image: "assets/custom-case-floral-book.jpeg",
    description: "Upload your favorite memories, add personalized text, and choose colors to design a completely unique, premium phone case.",
    badge: "new",
    options: ["iPhone 15 Pro", "iPhone 15 Pro Max", "Samsung S24 Ultra", "Google Pixel 8 Pro", "Redmi Note 13"],
    isCustom: true
  },
  // 2. iPhone Covers
  {
    id: "iphone-magsafe-clear",
    title: "iPhone Paris Skyline Custom Case",
    category: "iphone-covers",
    price: 29.99,
    image: "assets/custom-case-paris.jpeg",
    description: "Glossy full-print iPhone case with a warm Paris skyline design, durable edges, and smooth daily grip.",
    badge: "trending",
    options: ["iPhone 15", "iPhone 15 Pro", "iPhone 15 Pro Max", "iPhone 14 Pro"]
  },
  {
    id: "iphone-silicone-case",
    title: "iPhone Floral Book Custom Case",
    category: "iphone-covers",
    price: 19.99,
    image: "assets/custom-case-floral-book.jpeg",
    description: "Soft floral book artwork printed edge-to-edge on a premium protective phone cover.",
    options: ["iPhone 15 Pro", "iPhone 15 Pro Max", "iPhone 14", "iPhone 13"]
  },
  // 3. Samsung Covers
  {
    id: "samsung-s24-leather",
    title: "Galaxy Bicycle Roses Custom Case",
    category: "samsung-covers",
    price: 34.99,
    image: "assets/custom-case-bicycle-roses.jpeg",
    description: "Romantic bicycle and rose print case with a glossy finish and comfortable side protection.",
    options: ["Galaxy S24 Ultra", "Galaxy S24 Plus", "Galaxy S24"]
  },
  {
    id: "samsung-rugged-armor",
    title: "Galaxy Family Photo Custom Case",
    category: "samsung-covers",
    price: 22.99,
    image: "assets/custom-case-family.jpeg",
    description: "Personal family photo case sample with clean print, soft tones, and protective raised edges.",
    options: ["Galaxy S23 Ultra", "Galaxy S23 Plus", "Galaxy S23"]
  },
  // 4. Redmi Covers
  {
    id: "redmi-note13-shockproof",
    title: "Redmi True Friends Quote Case",
    category: "redmi-covers",
    price: 14.99,
    image: "assets/custom-case-friends.jpeg",
    description: "Friendship quote printed cover with illustrated artwork and a bright white base.",
    options: ["Redmi Note 13 Pro 5G", "Redmi Note 13 Pro+", "Redmi Note 13"]
  },
  // 5. Oppo Covers
  {
    id: "oppo-reno11-matte",
    title: "Oppo Flower Book Custom Case",
    category: "oppo-covers",
    price: 13.99,
    image: "assets/custom-case-flower-book.jpeg",
    description: "Colorful flower-and-book printed case for a bold custom look with durable protection.",
    options: ["Oppo Reno 11 Pro", "Oppo Reno 11", "Oppo A78 5G"]
  },
  // 6. Google Pixel
  {
    id: "pixel-8-shield",
    title: "Google Pixel Bouquet Art Case",
    category: "google-pixel",
    price: 24.99,
    image: "assets/custom-case-girl-bouquet.jpeg",
    description: "Pastel bouquet artwork case with a soft artistic finish and everyday scratch protection.",
    options: ["Pixel 8 Pro", "Pixel 8", "Pixel 7a"]
  },
  // 7. Airpod Covers
  {
    id: "airpods-pro-armor",
    title: "AirPods Pro Protective Case",
    category: "airpod-covers",
    price: 16.99,
    image: "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?q=80&w=400&auto=format&fit=crop",
    description: "Military-grade carbon fiber texture case with metal locking clip. Supports wireless charging.",
    options: ["AirPods Pro 2", "AirPods Pro", "AirPods 3"]
  },
  // 8. Screen Protectors
  {
    id: "screen-9h-glass",
    title: "9H Tempered Glass Screen Protector (2-Pack)",
    category: "screen-protectors",
    price: 9.99,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=400&auto=format&fit=crop",
    description: "Ultra-clear tempered glass with oleophobic coating. Easy installation frame included.",
    options: ["iPhone 15 Pro", "iPhone 15 Pro Max", "Samsung S24 Ultra", "Pixel 8 Pro"]
  },
  // 9. Camera Protectors
  {
    id: "camera-lens-rings",
    title: "Camera Lens Tempered Glass Rings",
    category: "camera-protectors",
    price: 8.99,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400&auto=format&fit=crop",
    description: "Individual metal frame protective glass rings for camera lenses. High optical transparency.",
    options: ["iPhone 15 Pro/Max", "iPhone 14 Pro/Max", "Samsung S24 Ultra"]
  },
  // 10. Smart Watches
  {
    id: "smartwatch-amoled-ultra",
    title: "Active Fit Watch Ultra - AMOLED Screen",
    category: "smart-watches",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=400&auto=format&fit=crop",
    description: "Premium fitness tracker featuring always-on AMOLED display, heart rate sensor, blood oxygen tracker, and IP68 water resistance.",
    badge: "trending"
  },
  // 11. Watch Bands
  {
    id: "watch-band-milanese",
    title: "Milanese Loop Stainless Steel Band",
    category: "watch-bands",
    price: 18.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop",
    description: "Modern interpretation of a design developed in Milan. Woven stainless steel with adjustable magnetic closure.",
    options: ["Apple Watch 45mm/49mm", "Samsung Watch 20mm/22mm"]
  },
  // 12. Sim Cards
  {
    id: "sim-prepaid-travel",
    title: "Lycamobile 50GB National & Roaming SIM",
    category: "sim-cards",
    price: 15.00,
    image: "https://images.unsplash.com/photo-1562408590-e32931084e23?q=80&w=400&auto=format&fit=crop",
    description: "Preloaded prepaid SIM card containing 50GB high-speed 5G data, unlimited national calls, and roaming allowances.",
    badge: "new"
  },
  // 13. Mobile Accessories
  {
    id: "accessory-phone-tripod",
    title: "Flexible Octopus Tripod with Wireless Remote",
    category: "mobile-accessories",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1584438784894-089d6a128f3e?q=80&w=400&auto=format&fit=crop",
    description: "Adjustable legs grasp poles or tree branches. Includes Bluetooth shutter button and universal phone clamp."
  },
  // 14. Cordon (Phone Straps)
  {
    id: "cordon-nylon-strap",
    title: "Adjustable Crossbody Phone Cordon",
    category: "cordon",
    price: 7.99,
    image: "https://images.unsplash.com/photo-1622445262465-2481c4574875?q=80&w=400&auto=format&fit=crop",
    description: "Durable nylon lanyard with universal phone patch insert. Keeps your phone safe and accessible hands-free."
  },
  // 15. Travel Adapter
  {
    id: "adapter-gan-65w",
    title: "65W GaN Triple-Port Fast Travel Charger",
    category: "travel-adapter",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=400&auto=format&fit=crop",
    description: "Gallium Nitride (GaN) technology provides fast charging in a super compact size. Dual USB-C and USB-A ports.",
    badge: "trending"
  },
  // 16. Memory Cards
  {
    id: "memory-sandisk-128",
    title: "SanDisk Ultra 128GB MicroSDXC UHS-I",
    category: "memory-cards",
    price: 16.99,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=400&auto=format&fit=crop",
    description: "High-speed memory expansion card up to 140MB/s read speeds. Class 10 for Full HD video recording."
  },
  // 17. Headphones
  {
    id: "audio-headphones-anc",
    title: "SoundVibe Noise Cancelling Wireless Headphones",
    category: "headphones",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop",
    description: "Hybrid ANC reduces ambient noise by up to 90%. Over-ear soft earcups with 40-hour playtime battery.",
    badge: "sale",
    oldPrice: 69.99
  },
  // 18. Speaker
  {
    id: "audio-speaker-waterproof",
    title: "BoomSphere Portable Waterproof Bluetooth Speaker",
    category: "speakers",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=400&auto=format&fit=crop",
    description: "IPX7 waterproof rated speaker with dual bass radiators. 360-degree surrounding sound. TWS pairing enabled."
  },
  // 19. Offers Bundles
  {
    id: "offer-ultimate-bundle",
    title: "Ultimate Protection Bundle (Case + Glass + Camera Lens)",
    category: "offers",
    price: 34.99,
    image: "assets/custom-case-ronaldo.jpeg",
    description: "Get full coverage protection! Includes 1x Premium Clear Case, 1x Tempered Glass Screen Protector, and 1x Camera Lens Ring Set.",
    badge: "sale",
    oldPrice: 48.97,
    options: ["iPhone 15 Pro", "iPhone 15 Pro Max", "Samsung S24 Ultra"]
  },
  // 20. Phones
  {
    id: "phone-iphone15-pro",
    title: "Apple iPhone 15 Pro - 256GB (Refurbished Grade A)",
    category: "phones",
    price: 849.00,
    image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=400&auto=format&fit=crop",
    description: "Refurbished in pristine condition. Aerospace-grade titanium design, Dynamic Island, A17 Pro Chip, and advanced Pro Camera system.",
    badge: "trending"
  },
  {
    id: "phone-s24-ultra",
    title: "Samsung Galaxy S24 Ultra - 512GB (Brand New)",
    category: "phones",
    price: 1249.00,
    image: "https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?q=80&w=400&auto=format&fit=crop",
    description: "Factory unlocked Spanish retail model. Titanium chassis, Snapdragon 8 Gen 3, and integrated S-Pen Stylus with Galaxy AI features.",
    badge: "new"
  }
];

const siliconeCoverProducts = [
  {
    id: "silicone-iphone-sage-green",
    title: "Silicone iPhone Cover - Sage Green",
    category: "iphone-covers",
    price: 14.99,
    image: "assets/products/silicone-iphone-sage-green.jpeg",
    description: "Soft-touch silicone cover with a smooth grip and raised edge protection. Compatible with iPhone 7/8 through iPhone 17 Pro Max.",
    badge: "new",
    options: ["iPhone 7/8", "iPhone X/XS", "iPhone 11", "iPhone 12", "iPhone 13", "iPhone 14", "iPhone 15", "iPhone 16", "iPhone 17 Pro Max"]
  },
  {
    id: "silicone-iphone-burgundy",
    title: "Silicone iPhone Cover - Burgundy",
    category: "iphone-covers",
    price: 14.99,
    image: "assets/products/silicone-iphone-burgundy.jpeg",
    description: "Premium burgundy silicone case with a clean matte finish, comfortable buttons, and everyday shock protection.",
    options: ["iPhone 7/8", "iPhone X/XS", "iPhone 11", "iPhone 12", "iPhone 13", "iPhone 14", "iPhone 15", "iPhone 16", "iPhone 17 Pro Max"]
  },
  {
    id: "silicone-iphone-sky-blue",
    title: "Silicone iPhone Cover - Sky Blue",
    category: "iphone-covers",
    price: 14.99,
    image: "assets/products/silicone-iphone-sky-blue.jpeg",
    description: "Light blue silicone cover with a soft touch feel and slim protective profile for daily use.",
    options: ["iPhone 7/8", "iPhone X/XS", "iPhone 11", "iPhone 12", "iPhone 13", "iPhone 14", "iPhone 15", "iPhone 16", "iPhone 17 Pro Max"]
  },
  {
    id: "silicone-iphone-forest-green",
    title: "Silicone iPhone Cover - Forest Green",
    category: "iphone-covers",
    price: 14.99,
    image: "assets/products/silicone-iphone-forest-green.jpeg",
    description: "Deep green silicone case with a refined matte texture, snug fit, and raised camera protection.",
    options: ["iPhone 7/8", "iPhone X/XS", "iPhone 11", "iPhone 12", "iPhone 13", "iPhone 14", "iPhone 15", "iPhone 16", "iPhone 17 Pro Max"]
  },
  {
    id: "silicone-iphone-deep-purple",
    title: "Silicone iPhone Cover - Deep Purple",
    category: "iphone-covers",
    price: 14.99,
    image: "assets/products/silicone-iphone-deep-purple.jpeg",
    description: "Deep purple silicone cover with soft grip, slim styling, and daily scratch resistance.",
    options: ["iPhone 7/8", "iPhone X/XS", "iPhone 11", "iPhone 12", "iPhone 13", "iPhone 14", "iPhone 15", "iPhone 16", "iPhone 17 Pro Max"]
  },
  {
    id: "silicone-iphone-orange",
    title: "Silicone iPhone Cover - Orange",
    category: "iphone-covers",
    price: 14.99,
    image: "assets/products/silicone-iphone-orange.jpeg",
    description: "Bright orange silicone cover with a bold look, smooth hand feel, and protective raised edges.",
    options: ["iPhone 7/8", "iPhone X/XS", "iPhone 11", "iPhone 12", "iPhone 13", "iPhone 14", "iPhone 15", "iPhone 16", "iPhone 17 Pro Max"]
  },
  {
    id: "silicone-iphone-blush-pink",
    title: "Silicone iPhone Cover - Blush Pink",
    category: "iphone-covers",
    price: 14.99,
    image: "assets/products/silicone-iphone-blush-pink.jpeg",
    description: "Soft blush pink silicone case with a minimal premium finish and everyday drop protection.",
    options: ["iPhone 7/8", "iPhone X/XS", "iPhone 11", "iPhone 12", "iPhone 13", "iPhone 14", "iPhone 15", "iPhone 16", "iPhone 17 Pro Max"]
  },
  {
    id: "silicone-iphone-royal-blue",
    title: "Silicone iPhone Cover - Royal Blue",
    category: "iphone-covers",
    price: 14.99,
    image: "assets/products/silicone-iphone-royal-blue.jpeg",
    description: "Royal blue silicone cover with a premium matte grip, precise cutouts, and slim protection.",
    options: ["iPhone 7/8", "iPhone X/XS", "iPhone 11", "iPhone 12", "iPhone 13", "iPhone 14", "iPhone 15", "iPhone 16", "iPhone 17 Pro Max"]
  },
  {
    id: "silicone-iphone-black",
    title: "Silicone iPhone Cover - Black",
    category: "iphone-covers",
    price: 14.99,
    image: "assets/products/silicone-iphone-black.jpeg",
    description: "Classic black silicone cover with clean styling, soft-touch grip, and daily phone protection.",
    options: ["iPhone 7/8", "iPhone X/XS", "iPhone 11", "iPhone 12", "iPhone 13", "iPhone 14", "iPhone 15", "iPhone 16", "iPhone 17 Pro Max"]
  },
  {
    id: "iphone-16-pro-max-purple",
    title: "iPhone 16 Pro Max Silicone Cover - Purple",
    category: "iphone-covers",
    price: 19.99,
    image: "assets/products/iphone-16-pro-max-purple.jpeg",
    description: "Premium iPhone 16 Pro Max silicone cover in purple with camera ring protection and a soft matte finish.",
    badge: "new",
    options: ["iPhone 16 Pro Max", "Color: Purple"]
  },
  {
    id: "iphone-16-pro-max-navy-blue",
    title: "iPhone 16 Pro Max Silicone Cover - Navy Blue",
    category: "iphone-covers",
    price: 19.99,
    image: "assets/products/iphone-16-pro-max-navy-blue.jpeg",
    description: "Navy blue silicone cover made for iPhone 16 Pro Max with precise fit and smooth grip.",
    options: ["iPhone 16 Pro Max", "Color: Navy Blue"]
  },
  {
    id: "iphone-16-pro-max-red",
    title: "iPhone 16 Pro Max Silicone Cover - Red",
    category: "iphone-covers",
    price: 19.99,
    image: "assets/products/iphone-16-pro-max-red.jpeg",
    description: "Bold red iPhone 16 Pro Max silicone cover with slim protection and clean camera cutouts.",
    options: ["iPhone 16 Pro Max", "Color: Red"]
  },
  {
    id: "iphone-16-pro-max-sage-green",
    title: "iPhone 16 Pro Max Silicone Cover - Sage Green",
    category: "iphone-covers",
    price: 19.99,
    image: "assets/products/iphone-16-pro-max-sage-green.jpeg",
    description: "Sage green iPhone 16 Pro Max silicone case with soft-touch finish and raised edge protection.",
    options: ["iPhone 16 Pro Max", "Color: Sage Green"]
  },
  {
    id: "iphone-16-pro-max-hot-pink",
    title: "iPhone 16 Pro Max Silicone Cover - Hot Pink",
    category: "iphone-covers",
    price: 19.99,
    image: "assets/products/iphone-16-pro-max-hot-pink.jpeg",
    description: "Hot pink iPhone 16 Pro Max silicone cover for a bright look with everyday protection.",
    options: ["iPhone 16 Pro Max", "Color: Hot Pink"]
  },
  {
    id: "iphone-16-pro-max-white",
    title: "iPhone 16 Pro Max Silicone Cover - White",
    category: "iphone-covers",
    price: 19.99,
    image: "assets/products/iphone-16-pro-max-white.jpeg",
    description: "White silicone cover for iPhone 16 Pro Max with a clean minimalist finish and snug fit.",
    options: ["iPhone 16 Pro Max", "Color: White"]
  },
  {
    id: "iphone-16-pro-max-forest-green",
    title: "iPhone 16 Pro Max Silicone Cover - Forest Green",
    category: "iphone-covers",
    price: 19.99,
    image: "assets/products/iphone-16-pro-max-forest-green.jpeg",
    description: "Forest green iPhone 16 Pro Max case with soft matte texture and camera protection.",
    options: ["iPhone 16 Pro Max", "Color: Forest Green"]
  },
  {
    id: "iphone-16-pro-max-black",
    title: "iPhone 16 Pro Max Silicone Cover - Black",
    category: "iphone-covers",
    price: 19.99,
    image: "assets/products/iphone-16-pro-max-black.jpeg",
    description: "Black iPhone 16 Pro Max silicone cover with a timeless look, smooth grip, and raised camera edge.",
    options: ["iPhone 16 Pro Max", "Color: Black"]
  },
  {
    id: "iphone-16-pro-max-burgundy",
    title: "iPhone 16 Pro Max Silicone Cover - Burgundy",
    category: "iphone-covers",
    price: 19.99,
    image: "assets/products/iphone-16-pro-max-burgundy.jpeg",
    description: "Burgundy iPhone 16 Pro Max silicone cover with elegant color and everyday impact protection.",
    options: ["iPhone 16 Pro Max", "Color: Burgundy"]
  },
  {
    id: "iphone-16-pro-max-blush-pink",
    title: "iPhone 16 Pro Max Silicone Cover - Blush Pink",
    category: "iphone-covers",
    price: 19.99,
    image: "assets/products/iphone-16-pro-max-blush-pink.jpeg",
    description: "Blush pink iPhone 16 Pro Max silicone cover with soft premium feel and slim protection.",
    options: ["iPhone 16 Pro Max", "Color: Blush Pink"]
  },
  {
    id: "iphone-16-pro-max-royal-blue",
    title: "iPhone 16 Pro Max Silicone Cover - Royal Blue",
    category: "iphone-covers",
    price: 19.99,
    image: "assets/products/iphone-16-pro-max-royal-blue.jpeg",
    description: "Royal blue iPhone 16 Pro Max silicone cover with bold color and comfortable grip.",
    options: ["iPhone 16 Pro Max", "Color: Royal Blue"]
  },
  {
    id: "iphone-16-pro-max-sky-blue",
    title: "iPhone 16 Pro Max Silicone Cover - Sky Blue",
    category: "iphone-covers",
    price: 19.99,
    image: "assets/products/iphone-16-pro-max-sky-blue.jpeg",
    description: "Sky blue iPhone 16 Pro Max case with a soft matte texture and precise button fit.",
    options: ["iPhone 16 Pro Max", "Color: Sky Blue"]
  },
  {
    id: "iphone-16-pro-max-lavender",
    title: "iPhone 16 Pro Max Silicone Cover - Lavender",
    category: "iphone-covers",
    price: 19.99,
    image: "assets/products/iphone-16-pro-max-lavender.jpeg",
    description: "Lavender iPhone 16 Pro Max silicone cover with soft-touch finish and elegant pastel color.",
    options: ["iPhone 16 Pro Max", "Color: Lavender"]
  },
  {
    id: "iphone-16-pro-max-lime-green",
    title: "iPhone 16 Pro Max Silicone Cover - Lime Green",
    category: "iphone-covers",
    price: 19.99,
    image: "assets/products/iphone-16-pro-max-lime-green.jpeg",
    description: "Lime green iPhone 16 Pro Max silicone cover with bright color and slim daily protection.",
    options: ["iPhone 16 Pro Max", "Color: Lime Green"]
  },
  {
    id: "iphone-16-pro-max-orange",
    title: "iPhone 16 Pro Max Silicone Cover - Orange",
    category: "iphone-covers",
    price: 19.99,
    image: "assets/products/iphone-16-pro-max-orange.jpeg",
    description: "Orange iPhone 16 Pro Max silicone cover with a bold finish, raised camera protection, and easy grip.",
    options: ["iPhone 16 Pro Max", "Color: Orange"]
  }
];

function dedupeProductCatalog(productList) {
  const seenIds = new Set();
  const seenImages = new Set();

  return productList.filter(product => {
    const idKey = String(product.id || "").trim().toLowerCase();
    const imageKey = String(product.image || "").split("?")[0].trim().toLowerCase();

    if ((idKey && seenIds.has(idKey)) || (imageKey && seenImages.has(imageKey))) {
      return false;
    }

    if (idKey) seenIds.add(idKey);
    if (imageKey) seenImages.add(imageKey);
    return true;
  });
}

const localCatalogProducts = dedupeProductCatalog([...siliconeCoverProducts, ...fallbackProducts]);
let products = [...localCatalogProducts];

function getSupabaseConfig() {
  return window.TWM_SUPABASE_CONFIG || {};
}

function isSupabaseConfigured() {
  const cfg = getSupabaseConfig();
  return Boolean(cfg.url && cfg.anonKey && window.supabase?.createClient);
}

function getSupabaseClient() {
  if (!isSupabaseConfigured()) return null;
  if (!window.twmSupabaseClient) {
    const cfg = getSupabaseConfig();
    window.twmSupabaseClient = window.supabase.createClient(cfg.url, cfg.anonKey);
  }
  return window.twmSupabaseClient;
}

function normalizeSupabaseProduct(row) {
  return {
    id: String(row.id),
    title: row.title || "Untitled Product",
    category: row.category || "mobile-accessories",
    price: Number(row.price || 0),
    image: row.image_url || row.image || "assets/hero-bg.png",
    description: row.description || "",
    badge: row.badge || "",
    oldPrice: row.old_price ? Number(row.old_price) : null,
    options: Array.isArray(row.options) ? row.options : [],
    isCustom: Boolean(row.is_custom)
  };
}

async function loadProductsFromSupabase() {
  const client = getSupabaseClient();
  if (!client) return localCatalogProducts;

  const cfg = getSupabaseConfig();
  const table = cfg.productsTable || "products";

  try {
    const { data, error } = await client
      .from(table)
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw error;
    const supabaseProducts = data?.length ? data.map(normalizeSupabaseProduct) : [];
    const supabaseProductIds = new Set(supabaseProducts.map(product => product.id));
    const localOnlyProducts = localCatalogProducts.filter(product => !supabaseProductIds.has(product.id));
    return dedupeProductCatalog([...supabaseProducts, ...localOnlyProducts]);
  } catch (error) {
    console.warn("Supabase products could not be loaded. Using fallback catalog.", error);
    return localCatalogProducts;
  }
}

// ---------------------------------------------------------
// 2. MOBILE REPAIR PRICE MATRIX
// ---------------------------------------------------------
const repairPrices = {
  apple: {
    name: "Apple iPhone",
    models: {
      "iphone-15-pro-max": { name: "iPhone 15 Pro Max", screen: 289, battery: 99, port: 89, camera: 79, back: 149 },
      "iphone-15-pro": { name: "iPhone 15 Pro", screen: 249, battery: 99, port: 89, camera: 79, back: 129 },
      "iphone-15": { name: "iPhone 15", screen: 199, battery: 89, port: 79, camera: 69, back: 99 },
      "iphone-14-pro-max": { name: "iPhone 14 Pro Max", screen: 229, battery: 89, port: 79, camera: 69, back: 119 },
      "iphone-14-pro": { name: "iPhone 14 Pro", screen: 209, battery: 89, port: 79, camera: 69, back: 109 },
      "iphone-14": { name: "iPhone 14", screen: 169, battery: 79, port: 69, camera: 59, back: 89 },
      "iphone-13": { name: "iPhone 13", screen: 139, battery: 79, port: 59, camera: 59, back: 79 },
      "iphone-12": { name: "iPhone 12", screen: 119, battery: 69, port: 59, camera: 49, back: 69 }
    }
  },
  samsung: {
    name: "Samsung Galaxy",
    models: {
      "galaxy-s24-ultra": { name: "Galaxy S24 Ultra", screen: 299, battery: 89, port: 79, camera: 89, back: 99 },
      "galaxy-s24-plus": { name: "Galaxy S24 Plus", screen: 219, battery: 79, port: 69, camera: 79, back: 89 },
      "galaxy-s24": { name: "Galaxy S24", screen: 179, battery: 79, port: 69, camera: 69, back: 79 },
      "galaxy-s23-ultra": { name: "Galaxy S23 Ultra", screen: 249, battery: 79, port: 69, camera: 79, back: 89 },
      "galaxy-s23": { name: "Galaxy S23", screen: 159, battery: 69, port: 59, camera: 59, back: 69 },
      "galaxy-a54": { name: "Galaxy A54 5G", screen: 109, battery: 59, port: 49, camera: 39, back: 49 }
    }
  },
  xiaomi: {
    name: "Xiaomi / Redmi",
    models: {
      "xiaomi-14-ultra": { name: "Xiaomi 14 Ultra", screen: 259, battery: 79, port: 69, camera: 79, back: 89 },
      "xiaomi-13-pro": { name: "Xiaomi 13 Pro", screen: 199, battery: 69, port: 59, camera: 69, back: 79 },
      "redmi-note-13-pro-plus": { name: "Redmi Note 13 Pro+", screen: 129, battery: 59, port: 49, camera: 49, back: 59 },
      "redmi-note-13-pro": { name: "Redmi Note 13 Pro 5G", screen: 99, battery: 59, port: 49, camera: 39, back: 49 },
      "redmi-note-12": { name: "Redmi Note 12", screen: 79, battery: 49, port: 39, camera: 29, back: 39 }
    }
  },
  oppo: {
    name: "Oppo",
    models: {
      "oppo-find-x6-pro": { name: "Find X6 Pro", screen: 239, battery: 79, port: 69, camera: 79, back: 89 },
      "oppo-reno-11-pro": { name: "Reno 11 Pro", screen: 149, battery: 69, port: 59, camera: 59, back: 69 },
      "oppo-reno-10": { name: "Reno 10 5G", screen: 119, battery: 59, port: 49, camera: 49, back: 59 },
      "oppo-a78": { name: "Oppo A78", screen: 89, battery: 49, port: 39, camera: 29, back: 39 }
    }
  },
  google: {
    name: "Google Pixel",
    models: {
      "pixel-8-pro": { name: "Pixel 8 Pro", screen: 239, battery: 89, port: 79, camera: 69, back: 109 },
      "pixel-8": { name: "Pixel 8", screen: 189, battery: 79, port: 69, camera: 59, back: 89 },
      "pixel-7-pro": { name: "Pixel 7 Pro", screen: 199, battery: 79, port: 69, camera: 59, back: 89 },
      "pixel-7a": { name: "Pixel 7a", screen: 129, battery: 69, port: 59, camera: 49, back: 69 }
    }
  }
};

const repairServiceInfo = {
  screen: { name: "Screen Replacement", time: "45-60 mins" },
  battery: { name: "New High-Capacity Battery", time: "30 mins" },
  port: { name: "Charging Port Repair", time: "45 mins" },
  camera: { name: "Camera Glass Replacement", time: "40 mins" },
  back: { name: "Back Glass Replacement", time: "1-2 hours" }
};
// ---------------------------------------------------------
// 3. APPLICATION STATE
// ---------------------------------------------------------
let cart = [];
let selectedCategory = "all";
let searchQuery = "";
let currentCoupon = null;
let deliveryMethod = "pickup"; // "pickup" or "delivery"

// Customizer state
const customizerState = {
  model: "iPhone 15 Pro",
  bgColor: "#ffffff",
  imageSrc: null,
  imageObj: null,
  scale: 100,
  xOffset: 0,
  yOffset: 0,
  rotation: 0,
  text: "",
  textColor: "#000000",
  fontSize: 20
};

// ---------------------------------------------------------
// 4. DOCUMENT LOAD & INITIALIZATION
// ---------------------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {
  initCategoryPageState();
  initCategoryTabs();
  initNavbarScroll();
  initSearch();
  await initProductCatalog();
  initCustomizerCanvas();
  initCustomizerControls();
  initRepairEstimator();
  initCartDrawer();
  initProductDetailModal();
  initOffersCountdown();
});

function isCategoryPage() {
  return document.body?.dataset.page === "category";
}

function getCategoryByKey(categoryKey) {
  return STORE_CATEGORIES.find(cat => cat.key === categoryKey) || STORE_CATEGORIES[0];
}

function getCategoryUrl(cat) {
  if (!cat) return "category.html?category=all";
  if (cat.target) return `index.html#${cat.target}`;
  return `category.html?category=${encodeURIComponent(cat.key)}`;
}

function getProductUrl(prod) {
  return `product.html?product=${encodeURIComponent(prod.id)}`;
}

function initCategoryPageState() {
  if (!isCategoryPage()) return;

  const params = new URLSearchParams(window.location.search);
  const requestedCategory = params.get("category") || "all";
  selectedCategory = getCategoryByKey(requestedCategory).key;
  updateCategoryPageHeader(getCategoryByKey(selectedCategory));
}

function updateCategoryPageHeader(cat) {
  if (!isCategoryPage() || !cat) return;

  const title = document.getElementById("category-page-title");
  const subtitle = document.getElementById("category-page-subtitle");
  const badge = document.getElementById("category-page-badge");

  if (title) title.textContent = cat.name;
  if (subtitle) {
    subtitle.textContent = cat.key === "all"
      ? "Browse all premium covers, accessories, protectors, phones, watches, and repair essentials in one place."
      : `Browse ${cat.name.toLowerCase()} available at The World Mobile.`;
  }
  if (badge) badge.innerHTML = `<i class="ti ${cat.icon}"></i> ${cat.name}`;
  document.title = `${cat.name} | The World Mobile`;
}

function updateProductPage() {
  if (document.body?.dataset.page !== "product") return;

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("product");
  const prod = products.find(item => item.id === productId) || products[0];

  const page = document.getElementById("product-page");
  const empty = document.getElementById("product-page-empty");
  if (!prod) {
    if (page) page.style.display = "none";
    if (empty) empty.style.display = "block";
    return;
  }

  if (page) page.style.display = "";
  if (empty) empty.style.display = "none";

  const category = getCategoryByKey(prod.category);
  const title = document.getElementById("product-page-title");
  const categoryEl = document.getElementById("product-page-category");
  const image = document.getElementById("product-page-image");
  const price = document.getElementById("product-page-price");
  const oldPrice = document.getElementById("product-page-old-price");
  const desc = document.getElementById("product-page-desc");
  const options = document.getElementById("product-page-options");
  const addBtn = document.getElementById("product-page-add");
  const whatsapp = document.getElementById("product-page-whatsapp");
  const breadcrumbCategory = document.getElementById("product-page-breadcrumb-category");

  document.title = `${prod.title} | The World Mobile`;
  if (title) title.textContent = prod.title;
  if (categoryEl) categoryEl.innerHTML = `<i class="ti ${category.icon}"></i> ${category.name}`;
  if (breadcrumbCategory) {
    breadcrumbCategory.textContent = category.name;
    breadcrumbCategory.href = getCategoryUrl(category);
  }
  if (image) {
    image.src = prod.image;
    image.alt = prod.title;
  }
  if (price) price.textContent = `${CONFIG.currency}${prod.price.toFixed(2)}`;
  if (oldPrice) {
    oldPrice.textContent = prod.oldPrice ? `${CONFIG.currency}${prod.oldPrice.toFixed(2)}` : "";
    oldPrice.style.display = prod.oldPrice ? "inline" : "none";
  }
  if (desc) desc.textContent = prod.description || "Premium product from The World Mobile.";
  if (options) {
    options.innerHTML = (prod.options || []).map(option => `<span>${option}</span>`).join("");
    options.style.display = prod.options?.length ? "flex" : "none";
  }
  if (addBtn) addBtn.onclick = () => quickAddCart(prod.id);
  if (whatsapp) {
    whatsapp.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(`Hello The World Mobile, I want details for: ${prod.title}`)}`;
  }
}

// Navbar scroll shadow & Mobile menu controls
function initNavbarScroll() {
  const header = document.querySelector(".shop-header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // Mobile navigation drawer toggles
  const menuToggle = document.getElementById("menu-toggle-btn");
  const menuClose = document.getElementById("menu-close-btn");
  const mobileMenu = document.getElementById("mobile-drawer-menu");
  const backdrop = document.getElementById("drawer-backdrop");
  const menuLinks = mobileMenu?.querySelector(".wix-browser-links");

  if (menuLinks) {
    menuLinks.innerHTML = `
      <a href="index.html" class="active" data-menu-home="true"><i class="ti ti-home"></i> Home</a>
      ${STORE_CATEGORIES.map(cat => `
        <a href="${getCategoryUrl(cat)}" data-category="${cat.key}">
          <i class="ti ${cat.icon}"></i> ${cat.name}
        </a>
      `).join("")}
      <a href="about.html"><i class="ti ti-info-circle"></i> About Us</a>
      <a href="contact.html"><i class="ti ti-phone"></i> Contact</a>
      <a href="privacy-policy.html"><i class="ti ti-shield"></i> Privacy Policy</a>
      <a href="terms.html"><i class="ti ti-file-text"></i> Terms</a>
      <a href="delivery-info.html"><i class="ti ti-truck"></i> Delivery Info</a>
    `;
    syncCategoryControls(selectedCategory);
  }

  const closeMobileMenu = () => {
    if (mobileMenu) mobileMenu.classList.remove("open");
    document.body.classList.remove("menu-drawer-open");
    const cartDrawerOpen = document.getElementById("cart-drawer")?.classList.contains("open");
    if (backdrop && !cartDrawerOpen) {
      backdrop.classList.remove("show");
      document.body.classList.remove("drawer-open");
    }
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'false');
      try { menuToggle.focus(); } catch(e){}
    }
  };

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      mobileMenu.classList.add("open");
      if (backdrop) backdrop.classList.add("show");
      document.body.classList.add("drawer-open");
      document.body.classList.add("menu-drawer-open");
      // Accessibility: indicate expanded state and move focus into menu
      menuToggle.setAttribute('aria-expanded', 'true');
      const firstFocusable = mobileMenu.querySelector('button, a, [tabindex]:not([tabindex="-1"])');
      if (firstFocusable) {
        try { firstFocusable.focus(); } catch (e) {}
      }
    });
  }

  if (menuClose && mobileMenu) {
    menuClose.addEventListener("click", closeMobileMenu);
  }

  if (backdrop) {
    backdrop.addEventListener("click", closeMobileMenu);
  }

  // Close menu drawer when clicking on any menu link (for smooth scrolling to sections)
  if (mobileMenu) {
    const navLinks = mobileMenu.querySelectorAll(".wix-browser-links a");
    navLinks.forEach(link => {
      link.addEventListener("click", (event) => {
        const categoryKey = link.getAttribute("data-category");
        const category = STORE_CATEGORIES.find(cat => cat.key === categoryKey);

        if (link.hasAttribute("data-menu-home")) {
          if (window.location.pathname.endsWith("index.html") || window.location.pathname.endsWith("/")) {
            event.preventDefault();
            scrollToElement("shop-header");
          }
          document.querySelectorAll(".wix-browser-links a").forEach(item => item.classList.remove("active"));
          link.classList.add("active");
        } else if (category && isCategoryPage() && !category.target) {
          event.preventDefault();
          selectCategory(category);
        }

        closeMobileMenu();
      });
    });
  }
}

// ---------------------------------------------------------
// 5. SEARCH & FILTER ENGINE
// ---------------------------------------------------------
function initCategoryTabs() {
  const container = document.getElementById("categories-tabs");
  if (!container) return;

  // Clear original static categories
  container.innerHTML = "";

  STORE_CATEGORIES.forEach(cat => {
    const tab = document.createElement("a");
    tab.className = `category-tab ${selectedCategory === cat.key ? 'active' : ''}`;
    tab.setAttribute("data-category", cat.key);
    tab.href = getCategoryUrl(cat);
    tab.innerHTML = `<i class="ti ${cat.icon}"></i> ${cat.name}`;
    
    tab.addEventListener("click", (event) => {
      if (isCategoryPage() && !cat.target) {
        event.preventDefault();
        selectCategory(cat);
      }
    });
    
    container.appendChild(tab);
  });
}

function selectCategory(cat) {
  if (!cat) return;

  syncCategoryControls(cat.key);

  if (cat.target) {
    window.location.href = getCategoryUrl(cat);
    return;
  }

  if (!isCategoryPage()) {
    window.location.href = getCategoryUrl(cat);
    return;
  }

  selectedCategory = cat.key;
  updateCategoryPageHeader(cat);
  const nextUrl = getCategoryUrl(cat);
  if (`${window.location.pathname.split("/").pop()}${window.location.search}` !== nextUrl) {
    window.history.pushState({}, "", nextUrl);
  }
  filterAndRenderProducts();
  scrollToElement("products-section");
}

function syncCategoryControls(categoryKey) {
  document.querySelectorAll(".category-tab").forEach(tab => {
    tab.classList.toggle("active", tab.getAttribute("data-category") === categoryKey);
  });

  document.querySelectorAll(".wix-browser-links a").forEach(link => {
    link.classList.toggle("active", link.getAttribute("data-category") === categoryKey);
  });
}

function initSearch() {
  const searchInputs = [
    document.getElementById("global-search"),
    document.getElementById("body-search")
  ];
  
  const searchForm = document.getElementById("header-search-form");
  if (searchForm) {
    searchForm.addEventListener("submit", (e) => e.preventDefault());
  }

  searchInputs.forEach(input => {
    if (!input) return;
    input.addEventListener("input", (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      
      // Keep search values synced
      searchInputs.forEach(inp => {
        if (inp && inp !== e.target) inp.value = e.target.value;
      });
      
      filterAndRenderProducts();
    });
  });
}

async function initProductCatalog() {
  products = await loadProductsFromSupabase();
  updateProductPage();
  filterAndRenderProducts();
}

function filterAndRenderProducts() {
  const grid = document.getElementById("products-grid");
  if (!grid) return;

  const filtered = products.filter(prod => {
    const matchesCategory = selectedCategory === "all" || prod.category === selectedCategory;
    const matchesSearch = prod.title.toLowerCase().includes(searchQuery) || 
                          prod.description.toLowerCase().includes(searchQuery) ||
                          prod.category.toLowerCase().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="cart-empty-message" style="grid-column: 1/-1; padding: 60px 0;">
        <i class="ti ti-search-off" style="font-size: 64px; color: var(--text-muted); display: block; margin-bottom: 16px;"></i>
        <h3>No Products Found</h3>
        <p>Try searching for something else or explore a different category.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(prod => {
    const badgeHTML = prod.badge ? `<span class="product-badge badge-${prod.badge}">${prod.badge}</span>` : '';
    const oldPriceHTML = prod.oldPrice ? `<span class="product-old-price">${CONFIG.currency}${prod.oldPrice.toFixed(2)}</span>` : '';
    
    let btnActionHTML = `
      <button class="product-add-btn" onclick="quickAddCart('${prod.id}')" aria-label="Add ${prod.title} to cart">
        <i class="ti ti-shopping-cart-plus"></i>
      </button>
    `;
    
    return `
      <div class="product-card glass" id="prod-${prod.id}">
        ${badgeHTML}
        <a class="product-image-container" href="${getProductUrl(prod)}" aria-label="View ${prod.title}">
          <img src="${prod.image}" alt="${prod.title}" loading="lazy">
          <div class="product-actions-overlay">
            <button class="overlay-btn" type="button" onclick="event.preventDefault(); window.location.href='${getProductUrl(prod)}';" title="View Details">
              <i class="ti ti-eye"></i>
              <span>View</span>
            </button>
            <button class="overlay-btn" type="button" onclick="event.preventDefault(); quickAddCart('${prod.id}')" title="Add to Cart">
              <i class="ti ti-shopping-cart"></i>
              <span>Add</span>
            </button>
          </div>
        </a>
        <div class="product-info">
          <span class="product-category">${prod.category.replace(/-/g, " ")}</span>
          <h3 class="product-title"><a href="${getProductUrl(prod)}">${prod.title}</a></h3>
          <div class="product-bottom">
            <div class="product-price-wrapper">
              <span class="product-price">${CONFIG.currency}${prod.price.toFixed(2)}</span>
              ${oldPriceHTML}
            </div>
            ${btnActionHTML}
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// Utility smooth scroll
window.scrollToElement = function(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
};

// ---------------------------------------------------------
// 6. INTERACTIVE PHOTO COVER CUSTOMIZER
// ---------------------------------------------------------
let canvas, ctx;

function initCustomizerCanvas() {
  canvas = document.getElementById("customizer-canvas");
  if (!canvas) return;
  ctx = canvas.getContext("2d");
  
  // Set logical dimensions
  canvas.width = 500;
  canvas.height = 1000;
  
  drawCustomizer();
}

function initCustomizerControls() {
  const modelSelect = document.getElementById("case-model");
  const uploadInput = document.getElementById("case-upload");
  const textInput = document.getElementById("case-text");
  const textColorSelect = document.getElementById("case-text-color");
  const fontSizeInput = document.getElementById("case-font-size");
  
  // Position adjustments
  const adjustmentPanel = document.getElementById("customizer-adjustments");
  const scaleInput = document.getElementById("adjust-scale");
  const xInput = document.getElementById("adjust-x");
  const yInput = document.getElementById("adjust-y");
  const rotateInput = document.getElementById("adjust-rotate");
  
  if (modelSelect) {
    modelSelect.addEventListener("change", (e) => {
      customizerState.model = e.target.value;
      drawCustomizer();
    });
  }
  
  // Color picking
  document.querySelectorAll(".color-option").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".color-option").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      customizerState.bgColor = btn.getAttribute("data-color");
      drawCustomizer();
    });
  });
  
  // File upload
  if (uploadInput) {
    uploadInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        customizerState.imageSrc = event.target.result;
        
        const img = new Image();
        img.onload = () => {
          customizerState.imageObj = img;
          
          // Reset positioning values
          customizerState.scale = 100;
          customizerState.xOffset = 0;
          customizerState.yOffset = 0;
          customizerState.rotation = 0;
          
          if (scaleInput) scaleInput.value = 100;
          if (xInput) xInput.value = 0;
          if (yInput) yInput.value = 0;
          if (rotateInput) rotateInput.value = 0;
          
          adjustmentPanel.classList.add("active");
          drawCustomizer();
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  }
  
  // Text inputs
  if (textInput) {
    textInput.addEventListener("input", (e) => {
      customizerState.text = e.target.value;
      drawCustomizer();
    });
  }
  
  if (textColorSelect) {
    textColorSelect.addEventListener("change", (e) => {
      customizerState.textColor = e.target.value;
      drawCustomizer();
    });
  }
  
  if (fontSizeInput) {
    fontSizeInput.addEventListener("input", (e) => {
      customizerState.fontSize = parseInt(e.target.value) || 20;
      drawCustomizer();
    });
  }
  
  // Adjustment sliders
  if (scaleInput) {
    scaleInput.addEventListener("input", (e) => {
      customizerState.scale = parseInt(e.target.value);
      drawCustomizer();
    });
  }
  if (xInput) {
    xInput.addEventListener("input", (e) => {
      customizerState.xOffset = parseInt(e.target.value);
      drawCustomizer();
    });
  }
  if (yInput) {
    yInput.addEventListener("input", (e) => {
      customizerState.yOffset = parseInt(e.target.value);
      drawCustomizer();
    });
  }
  if (rotateInput) {
    rotateInput.addEventListener("input", (e) => {
      customizerState.rotation = parseInt(e.target.value);
      drawCustomizer();
    });
  }
  
  // Add to cart customizer
  const addBtn = document.getElementById("add-custom-case-btn");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      addCustomCaseToCart();
    });
  }
}

// Render case design to HTML5 canvas
function drawCustomizer() {
  if (!canvas || !ctx) return;
  
  // 1. Draw solid background
  ctx.fillStyle = customizerState.bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // 2. Draw user-uploaded image if exists
  if (customizerState.imageObj) {
    ctx.save();
    
    // Translate to center + slider offsets
    const centerX = canvas.width / 2 + customizerState.xOffset;
    const centerY = canvas.height / 2 + customizerState.yOffset;
    ctx.translate(centerX, centerY);
    
    // Rotate canvas
    ctx.rotate((customizerState.rotation * Math.PI) / 180);
    
    // Calculate size based on scale
    const baseScale = Math.min(canvas.width / customizerState.imageObj.width, canvas.height / customizerState.imageObj.height);
    const finalWidth = customizerState.imageObj.width * baseScale * (customizerState.scale / 100);
    const finalHeight = customizerState.imageObj.height * baseScale * (customizerState.scale / 100);
    
    // Draw centered on current translation coordinate
    ctx.drawImage(
      customizerState.imageObj, 
      -finalWidth / 2, 
      -finalHeight / 2, 
      finalWidth, 
      finalHeight
    );
    
    ctx.restore();
  }
  
  // 3. Draw text overlay
  if (customizerState.text.trim() !== "") {
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `bold ${customizerState.fontSize * 2}px 'Outfit', sans-serif`;
    ctx.fillStyle = customizerState.textColor;
    
    // Add text stroke for visibility against noisy backgrounds
    ctx.strokeStyle = customizerState.textColor === "#ffffff" ? "#000000" : "#ffffff";
    ctx.lineWidth = 4;
    
    const textY = canvas.height * 0.8; // positioned near bottom
    ctx.strokeText(customizerState.text, canvas.width / 2, textY);
    ctx.fillText(customizerState.text, canvas.width / 2, textY);
    ctx.restore();
  }
  
  // 4. Draw phone bezel mockup overlay (simulating a premium glossy case frame)
  ctx.save();
  ctx.strokeStyle = "rgba(0, 0, 0, 0.95)";
  ctx.lineWidth = 26; // Thick border to act as a physical cover bezel
  
  // Bezel outline
  ctx.beginPath();
  ctx.roundRect(13, 13, canvas.width - 26, canvas.height - 26, 60);
  ctx.stroke();
  
  // Inner bezel gradient shadow
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(26, 26, canvas.width - 52, canvas.height - 52, 48);
  ctx.stroke();
  
  // Draw simulated camera island box for realistic cover alignment
  ctx.fillStyle = "#111115";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(40, 40, 160, 160, 32);
  ctx.fill();
  ctx.stroke();
  
  // Draw triple lenses inside the camera island
  ctx.fillStyle = "#000000";
  // Lens 1
  ctx.beginPath(); ctx.arc(80, 80, 24, 0, Math.PI * 2); ctx.fill();
  // Lens 2
  ctx.beginPath(); ctx.arc(160, 80, 24, 0, Math.PI * 2); ctx.fill();
  // Lens 3
  ctx.beginPath(); ctx.arc(80, 160, 24, 0, Math.PI * 2); ctx.fill();
  
  ctx.restore();
}

function addCustomCaseToCart() {
  const dataURL = canvas.toDataURL();
  
  const customItem = {
    id: `custom-case-${Date.now()}`,
    title: `Custom Case (${customizerState.model})`,
    price: 24.99,
    image: dataURL,
    category: "photo-cover",
    quantity: 1,
    options: {
      model: customizerState.model,
      bgColor: customizerState.bgColor,
      text: customizerState.text,
      isCustom: true
    }
  };
  
  cart.push(customItem);
  saveCart();
  updateCartUI();
  openCartDrawer();
  
  // Clear customization inputs
  customizerState.text = "";
  customizerState.imageObj = null;
  customizerState.imageSrc = null;
  const textInput = document.getElementById("case-text");
  if (textInput) textInput.value = "";
  const uploadInput = document.getElementById("case-upload");
  if (uploadInput) uploadInput.value = "";
  document.getElementById("customizer-adjustments").classList.remove("active");
  drawCustomizer();
}

// ---------------------------------------------------------
// 7. INTERACTIVE MOBILE REPAIR ESTIMATOR
// ---------------------------------------------------------
function initRepairEstimator() {
  const brandSelect = document.getElementById("repair-brand");
  const modelSelect = document.getElementById("repair-model");
  const issueSelect = document.getElementById("repair-issue");
  const estimateBox = document.getElementById("repair-estimate");
  const priceVal = document.getElementById("repair-price-val");
  const durationVal = document.getElementById("repair-duration-val");
  const bookBtn = document.getElementById("book-repair-btn");
  
  if (!brandSelect) return;
  
  // Populates brand selector
  brandSelect.innerHTML = `<option value="">Select Phone Brand...</option>` +
    Object.keys(repairPrices).map(key => 
      `<option value="${key}">${repairPrices[key].name}</option>`
    ).join("");
    
  brandSelect.addEventListener("change", (e) => {
    const brand = e.target.value;
    modelSelect.innerHTML = `<option value="">Select Phone Model...</option>`;
    issueSelect.selectedIndex = 0;
    estimateBox.classList.remove("active");
    
    if (brand && repairPrices[brand]) {
      modelSelect.disabled = false;
      const models = repairPrices[brand].models;
      modelSelect.innerHTML += Object.keys(models).map(modelKey => 
        `<option value="${modelKey}">${models[modelKey].name}</option>`
      ).join("");
    } else {
      modelSelect.disabled = true;
      issueSelect.disabled = true;
    }
  });
  
  modelSelect.addEventListener("change", (e) => {
    const model = e.target.value;
    issueSelect.selectedIndex = 0;
    estimateBox.classList.remove("active");
    
    if (model) {
      issueSelect.disabled = false;
    } else {
      issueSelect.disabled = true;
    }
  });
  
  issueSelect.addEventListener("change", calculateRepairEstimate);
  
  function calculateRepairEstimate() {
    const brand = brandSelect.value;
    const model = modelSelect.value;
    const issue = issueSelect.value;
    
    if (brand && model && issue && repairPrices[brand]?.models[model]?.[issue]) {
      const price = repairPrices[brand].models[model][issue];
      const time = repairServiceInfo[issue].time;
      
      priceVal.innerText = `${CONFIG.currency}${price}`;
      durationVal.innerText = time;
      estimateBox.classList.add("active");
    } else {
      estimateBox.classList.remove("active");
    }
  }

  // Repair form submit booking action
  const repairForm = document.getElementById("repair-booking-form");
  if (repairForm) {
    repairForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const brand = brandSelect.value;
      const model = modelSelect.value;
      const issue = issueSelect.value;
      const customerName = document.getElementById("booking-name")?.value.trim();
      const customerPhone = document.getElementById("booking-phone")?.value.trim();

      if (!brand || !model || !issue) {
        showToast("Please select a brand, model, and issue to continue.", "error");
        return;
      }

      if (!customerName || !customerPhone) {
        showToast("Please enter your name and WhatsApp number.", "error");
        return;
      }

      const brandName = repairPrices[brand].name;
      const modelName = repairPrices[brand].models[model].name;
      const issueName = repairServiceInfo[issue].name;
      const price = repairPrices[brand].models[model][issue];

      const repairItem = {
        id: `repair-${brand}-${model}-${issue}-${Date.now()}`,
        title: `Repair: ${modelName}`,
        price: price,
        image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=200&auto=format&fit=crop",
        category: "repair",
        quantity: 1,
        options: {
          brand: brandName,
          model: modelName,
          issue: issueName,
          customerName: customerName,
          customerPhone: customerPhone,
          isRepair: true
        }
      };

      cart.push(repairItem);
      saveCart();
      updateCartUI();
      openCartDrawer();
      showToast(`Repair booking for ${modelName} added to cart!`, "success");

      // Reset form
      repairForm.reset();
      modelSelect.disabled = true;
      issueSelect.disabled = true;
      estimateBox.classList.remove("active");
    });
  }
}

// ---------------------------------------------------------
// 8. CART DRAWER & CHECKOUT ENGINE
// ---------------------------------------------------------
function initCartDrawer() {
  const cartToggle = document.getElementById("cart-toggle-btn");
  const cartClose = document.getElementById("cart-close-btn");
  const cartDrawer = document.getElementById("cart-drawer");
  const backdrop = document.getElementById("drawer-backdrop");
  
  const openCart = () => {
    cartDrawer.classList.add("open");
    backdrop.classList.add("show");
    document.body.classList.add("drawer-open");
  };
  
  const closeCart = () => {
    cartDrawer.classList.remove("open");
    backdrop.classList.remove("show");
    document.body.classList.remove("drawer-open");
  };
  
  if (cartToggle) cartToggle.addEventListener("click", openCart);
  if (cartClose) cartClose.addEventListener("click", closeCart);
  if (backdrop) backdrop.addEventListener("click", closeCart);
  
  // Load saved cart from localStorage
  const saved = localStorage.getItem("twm_cart");
  if (saved) {
    try {
      cart = JSON.parse(saved);
      updateCartUI();
    } catch(e) {
      cart = [];
    }
  }
  
  // Delivery option tabs in cart
  const tabPickup = document.getElementById("tab-pickup");
  const tabDelivery = document.getElementById("tab-delivery");
  const addressField = document.getElementById("shipping-address");
  
  if (tabPickup && tabDelivery) {
    tabPickup.addEventListener("click", () => {
      tabPickup.classList.add("active");
      tabDelivery.classList.remove("active");
      deliveryMethod = "pickup";
      if (addressField) {
        addressField.required = false;
        addressField.style.display = "none";
      }
      updateCartUI();
    });
    
    tabDelivery.addEventListener("click", () => {
      tabDelivery.classList.add("active");
      tabPickup.classList.remove("active");
      deliveryMethod = "delivery";
      if (addressField) {
        addressField.required = true;
        addressField.style.display = "block";
      }
      updateCartUI();
    });
  }
  
  // Promo code validation
  const promoBtn = document.getElementById("apply-promo-btn");
  const promoInput = document.getElementById("promo-input");

  if (promoBtn && promoInput) {
    promoBtn.addEventListener("click", () => {
      const code = promoInput.value.toUpperCase().trim();

      if (!code) {
        showToast("Please enter a promo code first.", "error");
        return;
      }

      if (code === "WELCOME10") {
        currentCoupon = { code: "WELCOME10", discountPercent: 10 };
        showToast("Coupon applied! 10% discount activated.", "success");
      } else if (code === "FREESHIP") {
        currentCoupon = { code: "FREESHIP", freeShipping: true };
        showToast("Free shipping coupon applied!", "success");
      } else if (code === "REPAIR5") {
        currentCoupon = { code: "REPAIR5", discountAmount: 5.00, onlyRepair: true };
        showToast("EUR5.00 off your repair booking applied!", "success");
      } else {
        showToast(`"${code}" is not a valid coupon code.`, "error");
        currentCoupon = null;
      }
      promoInput.value = "";
      updateCartUI();
    });
  }
  
  // Checkout Submit via WhatsApp
  const checkoutForm = document.getElementById("cart-checkout-form");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      if (cart.length === 0) {
        showToast("Your cart is empty!", "error");
        return;
      }
      
      const name = document.getElementById("shipping-name").value.trim();
      const phone = document.getElementById("shipping-phone").value.trim();
      const address = document.getElementById("shipping-address").value.trim();
      
      sendWhatsAppOrder(name, phone, address);
    });
  }
}

window.openCartDrawer = function() {
  const cartDrawer = document.getElementById("cart-drawer");
  const backdrop = document.getElementById("drawer-backdrop");
  if (cartDrawer && backdrop) {
    cartDrawer.classList.add("open");
    backdrop.classList.add("show");
    document.body.classList.add("drawer-open");
  }
};

window.quickAddCart = function(productId) {
  const prod = products.find(p => p.id === productId);
  if (!prod) return;
  
  // Check if product already in cart (excluding customizable cases/repair bookings)
  const existing = cart.find(item => item.id === productId && !item.options?.isCustom && !item.options?.isRepair);
  
  if (existing) {
    existing.quantity += 1;
  } else {
    // Check if product has dropdown options, if yes, open detail modal instead
    if (prod.options && prod.options.length > 0 && productId !== "photo-cover-custom" && document.getElementById("product-detail-modal")) {
      openProductDetail(productId);
      return;
    }
    
    cart.push({
      id: prod.id,
      title: prod.title,
      price: prod.price,
      image: prod.image,
      category: prod.category,
      quantity: 1,
      options: prod.options?.length ? { selected: prod.options[0] } : undefined
    });
  }
  
  saveCart();
  updateCartUI();
  
  // Glow product card on add
  const card = document.getElementById(`prod-${productId}`);
  if (card) {
    card.style.boxShadow = "var(--shadow-glow)";
    setTimeout(() => {
      card.style.boxShadow = "var(--shadow-md)";
    }, 800);
  }
  
  openCartDrawer();
  showToast(`${prod.title} added to cart!`, "success");
};

function saveCart() {
  // Filters out circular/large canvas images from storage to avoid localStorage quota limits
  const storageCart = cart.map(item => {
    if (item.options?.isCustom) {
      return { ...item, image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=200&auto=format&fit=crop" }; // replace dataURL for storage
    }
    return item;
  });
  localStorage.setItem("twm_cart", JSON.stringify(storageCart));
}

window.updateCartQty = function(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  
  item.quantity += delta;
  
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== id);
  }
  
  saveCart();
  updateCartUI();
};

window.removeCartItem = function(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCartUI();
};

function updateCartUI() {
  const cartItemsContainer = document.getElementById("cart-items-list");
  const countBadge = document.getElementById("cart-count-badge");
  const formSection = document.getElementById("cart-checkout-form-container");
  
  if (!cartItemsContainer) return;
  
  // Total item count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (countBadge) countBadge.innerText = totalItems;
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="cart-empty-message">
        <i class="ti ti-shopping-cart-x"></i>
        <p>Your cart is empty</p>
        <button class="btn btn-secondary" onclick="closeCartDrawer()" style="margin-top:16px; width: 100%;">Continue Shopping</button>
      </div>
    `;
    if (formSection) formSection.classList.remove("active");
    
    updateSummary(0, 0, 0, 0);
    return;
  }
  
  if (formSection) formSection.classList.add("active");
  
  // Render items
  cartItemsContainer.innerHTML = cart.map(item => {
    let metaText = "";
    if (item.options?.isCustom) {
      metaText = `Model: ${item.options.model} ${item.options.text ? `| Text: "${item.options.text}"` : ''}`;
    } else if (item.options?.isRepair) {
      metaText = `${item.options.issue} (${item.options.model})`;
    } else if (item.options?.selectedModel) {
      metaText = `Option: ${item.options.selectedModel}`;
    }

    return `
      <div class="cart-item">
        <div class="cart-item-img">
          <img src="${item.image}" alt="${item.title}">
        </div>
        <div class="cart-item-details">
          <h4 class="cart-item-title">${item.title}</h4>
          ${metaText ? `<span class="cart-item-meta">${metaText}</span>` : ''}
          <div class="cart-item-bottom">
            <div class="cart-qty">
              <button class="qty-btn" onclick="updateCartQty('${item.id}', -1)" aria-label="Decrease quantity">-</button>
              <span class="qty-val">${item.quantity}</span>
              <button class="qty-btn" onclick="updateCartQty('${item.id}', 1)" aria-label="Increase quantity">+</button>
            </div>
            <span class="cart-item-price">${CONFIG.currency}${(item.price * item.quantity).toFixed(2)}</span>
            <button class="cart-item-remove" onclick="removeCartItem('${item.id}')" aria-label="Remove item">
              <i class="ti ti-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
  
  // Calculate Totals
  let subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Calculate shipping
  let shipping = 0;
  if (deliveryMethod === "delivery") {
    shipping = CONFIG.baseShippingFee;
    if (subtotal >= CONFIG.freeShippingThreshold) {
      shipping = 0;
    }
  }
  
  // Calculate discount
  let discount = 0;
  if (currentCoupon) {
    if (currentCoupon.freeShipping && deliveryMethod === "delivery") {
      shipping = 0;
    } else if (currentCoupon.discountPercent) {
      discount = subtotal * (currentCoupon.discountPercent / 100);
    } else if (currentCoupon.onlyRepair) {
      // Find repair items
      const repairItemsSubtotal = cart
        .filter(item => item.options?.isRepair)
        .reduce((sum, item) => sum + (item.price * item.quantity), 0);
      if (repairItemsSubtotal > 0) {
        discount = Math.min(currentCoupon.discountAmount, repairItemsSubtotal);
      }
    }
  }
  
  let total = subtotal + shipping - discount;
  if (total < 0) total = 0;
  
  updateSummary(subtotal, shipping, discount, total);
}

function updateSummary(subtotal, shipping, discount, total) {
  const subTotalEl = document.getElementById("summary-subtotal");
  const shippingEl = document.getElementById("summary-shipping");
  const discountEl = document.getElementById("summary-discount");
  const totalEl = document.getElementById("summary-total");
  
  if (subTotalEl) subTotalEl.innerText = `${CONFIG.currency}${subtotal.toFixed(2)}`;
  if (shippingEl) {
    if (deliveryMethod === "pickup") {
      shippingEl.innerText = "Store Pickup (Free)";
    } else {
      shippingEl.innerText = shipping === 0 ? "FREE" : `${CONFIG.currency}${shipping.toFixed(2)}`;
    }
  }
  if (discountEl) {
    if (discount > 0) {
      discountEl.parentElement.style.display = "flex";
      discountEl.innerText = `-${CONFIG.currency}${discount.toFixed(2)}`;
    } else {
      discountEl.parentElement.style.display = "none";
    }
  }
  if (totalEl) totalEl.innerText = `${CONFIG.currency}${total.toFixed(2)}`;
}

// Compile cart to text block and redirect user to WhatsApp Web or App
function sendWhatsAppOrder(name, phone, address) {
  let subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  let shipping = 0;
  if (deliveryMethod === "delivery") {
    shipping = subtotal >= CONFIG.freeShippingThreshold ? 0 : CONFIG.baseShippingFee;
  }
  
  let discount = 0;
  if (currentCoupon) {
    if (currentCoupon.freeShipping && deliveryMethod === "delivery") {
      shipping = 0;
    } else if (currentCoupon.discountPercent) {
      discount = subtotal * (currentCoupon.discountPercent / 100);
    } else if (currentCoupon.onlyRepair) {
      const repairItemsSubtotal = cart
        .filter(item => item.options?.isRepair)
        .reduce((sum, item) => sum + (item.price * item.quantity), 0);
      discount = Math.min(currentCoupon.discountAmount, repairItemsSubtotal);
    }
  }
  
  let total = subtotal + shipping - discount;
  if (total < 0) total = 0;

  // Build the message
  let msg = `*NEW ORDER - THE WORLD MOBILE*\n`;
  msg += `-------------------------------------------\n`;
  msg += `*Customer Name:* ${name}\n`;
  msg += `*Phone:* ${phone}\n`;
  msg += `*Delivery Method:* ${deliveryMethod === "delivery" ? "Home Delivery" : "Store Pickup"}\n`;
  
  if (deliveryMethod === "delivery") {
    msg += `*Shipping Address:* ${address}\n`;
  }
  msg += `-------------------------------------------\n\n`;
  msg += `*Ordered Items:*\n`;
  
  cart.forEach((item, index) => {
    msg += `${index + 1}. *${item.title}* x${item.quantity} - ${CONFIG.currency}${(item.price * item.quantity).toFixed(2)}\n`;
    if (item.options?.isCustom) {
      msg += `   - Phone Model: ${item.options.model}\n`;
      if (item.options.text) msg += `   - Text Printed: "${item.options.text}"\n`;
      msg += `   - Case Color: ${item.options.bgColor}\n`;
    } else if (item.options?.isRepair) {
      msg += `   - Repair: ${item.options.issue}\n`;
      msg += `   - Device: ${item.options.model}\n`;
    } else if (item.options?.selectedModel) {
      msg += `   - Selected Model: ${item.options.selectedModel}\n`;
    }
    msg += `\n`;
  });
  
  msg += `-------------------------------------------\n`;
  msg += `Subtotal: ${CONFIG.currency}${subtotal.toFixed(2)}\n`;
  msg += `Shipping Fee: ${deliveryMethod === "delivery" ? (shipping === 0 ? "FREE" : `${CONFIG.currency}${shipping.toFixed(2)}`) : "Free (Store Pickup)"}\n`;
  
  if (discount > 0) {
    msg += `Coupon Discount (${currentCoupon.code}): -${CONFIG.currency}${discount.toFixed(2)}\n`;
  }
  
  msg += `*TOTAL AMOUNT: ${CONFIG.currency}${total.toFixed(2)}*\n\n`;
  msg += `Please confirm my order and send payment instructions. Thank you!`;

  // Encode message for WhatsApp link
  const encodedMsg = encodeURIComponent(msg);
  const waURL = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodedMsg}`;
  
  // Clear cart and storage on success checkout redirection
  cart = [];
  currentCoupon = null;
  saveCart();
  updateCartUI();
  
  // Close Cart
  document.getElementById("cart-drawer").classList.remove("open");
  document.getElementById("drawer-backdrop").classList.remove("show");
  document.body.classList.remove("drawer-open");
  
  // Redirect
  window.open(waURL, "_blank");
}

// ---------------------------------------------------------
// 9. PRODUCT DETAIL MODAL
// ---------------------------------------------------------
let activeDetailProductId = null;

function initProductDetailModal() {
  const overlay = document.getElementById("product-detail-modal");
  const closeBtn = document.getElementById("modal-close-btn");
  
  const closeModal = () => {
    overlay.classList.remove("open");
    activeDetailProductId = null;
  };
  
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal();
    });
  }
}

window.openProductDetail = function(productId) {
  const prod = products.find(p => p.id === productId);
  if (!prod) return;
  
  activeDetailProductId = productId;
  
  const modal = document.getElementById("product-detail-modal");
  const mainImg = document.getElementById("modal-main-img");
  const category = document.getElementById("modal-category");
  const title = document.getElementById("modal-title");
  const price = document.getElementById("modal-price");
  const oldPrice = document.getElementById("modal-old-price");
  const desc = document.getElementById("modal-desc");
  const optionsWrapper = document.getElementById("modal-options-wrapper");
  const optionsList = document.getElementById("modal-options-list");
  
  if (!modal) return;
  
  // Populate content
  mainImg.src = prod.image;
  mainImg.alt = prod.title;
  category.innerText = prod.category.replace(/-/g, " ");
  title.innerText = prod.title;
  price.innerText = `${CONFIG.currency}${prod.price.toFixed(2)}`;
  
  if (prod.oldPrice) {
    oldPrice.style.display = "inline";
    oldPrice.innerText = `${CONFIG.currency}${prod.oldPrice.toFixed(2)}`;
  } else {
    oldPrice.style.display = "none";
  }
  
  desc.innerText = prod.description || "Premium accessory designed with durable shock protection and ergonomic grip features.";
  
  // Populate product model/color options if exist
  if (prod.options && prod.options.length > 0) {
    optionsWrapper.style.display = "block";
    optionsList.innerHTML = prod.options.map((opt, index) => 
      `<button class="option-select-btn ${index === 0 ? 'active' : ''}" onclick="selectModalOption(this, '${opt}')">${opt}</button>`
    ).join("");
    // Store selected option on the wrapper
    optionsWrapper.setAttribute("data-selected-option", prod.options[0]);
  } else {
    optionsWrapper.style.display = "none";
    optionsWrapper.removeAttribute("data-selected-option");
  }
  
  // Render Modal Cart Button
  const footer = document.getElementById("modal-footer-action");
  footer.innerHTML = `
    <button class="btn btn-primary" onclick="addModalItemToCart()" style="flex:1;">
      <i class="ti ti-shopping-cart"></i> Add to Shopping Cart
    </button>
  `;
  
  modal.classList.add("open");
};

window.selectModalOption = function(btn, optionValue) {
  document.querySelectorAll(".option-select-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  
  const wrapper = document.getElementById("modal-options-wrapper");
  if (wrapper) {
    wrapper.setAttribute("data-selected-option", optionValue);
  }
};

window.addModalItemToCart = function() {
  if (!activeDetailProductId) return;
  
  const prod = products.find(p => p.id === activeDetailProductId);
  if (!prod) return;
  
  const wrapper = document.getElementById("modal-options-wrapper");
  const selectedOption = wrapper ? wrapper.getAttribute("data-selected-option") : null;
  
  // Add item
  cart.push({
    id: `${prod.id}-${selectedOption || 'default'}`,
    title: prod.title,
    price: prod.price,
    image: prod.image,
    category: prod.category,
    quantity: 1,
    options: selectedOption ? { selectedModel: selectedOption } : null
  });
  
  saveCart();
  updateCartUI();
  
  // Close Modal
  document.getElementById("product-detail-modal").classList.remove("open");
  activeDetailProductId = null;
  
  openCartDrawer();
  showToast(`${prod.title} added to cart!`, "success");
};

// ---------------------------------------------------------
// 10. OFFERS COUNTDOWN TIMERS
// ---------------------------------------------------------
function initOffersCountdown() {
  const timers = document.querySelectorAll(".countdown-timer");
  if (timers.length === 0) return;

  // Persist the countdown end date in localStorage so it doesn't reset on every page load
  const STORAGE_KEY = "twm_countdown_end";
  let countdownEnd = parseInt(localStorage.getItem(STORAGE_KEY));
  const now = new Date().getTime();

  if (!countdownEnd || countdownEnd < now) {
    // Start a fresh 3-day countdown
    countdownEnd = now + (3 * 24 * 60 * 60 * 1000);
    localStorage.setItem(STORAGE_KEY, String(countdownEnd));
  }

  function updateTimers() {
    const remaining = countdownEnd - new Date().getTime();

    if (remaining < 0) {
      timers.forEach(t => {
        t.innerHTML = `<div class="timer-segment"><span class="timer-number" style="font-size:14px; color:var(--color-danger);">EXPIRED</span></div>`;
      });
      return;
    }

    const days    = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

    timers.forEach(timer => {
      timer.innerHTML = `
        <div class="timer-segment">
          <span class="timer-number">${days.toString().padStart(2, '0')}</span>
          <span class="timer-label">Days</span>
        </div>
        <div class="timer-segment">
          <span class="timer-number">${hours.toString().padStart(2, '0')}</span>
          <span class="timer-label">Hrs</span>
        </div>
        <div class="timer-segment">
          <span class="timer-number">${minutes.toString().padStart(2, '0')}</span>
          <span class="timer-label">Mins</span>
        </div>
        <div class="timer-segment">
          <span class="timer-number">${seconds.toString().padStart(2, '0')}</span>
          <span class="timer-label">Secs</span>
        </div>
      `;
    });
  }

  updateTimers();
  setInterval(updateTimers, 1000);
}
