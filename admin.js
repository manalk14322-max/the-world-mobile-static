const cfg = window.TWM_SUPABASE_CONFIG || {};
const hasConfig = Boolean(cfg.url && cfg.anonKey && window.supabase?.createClient);
const client = hasConfig ? window.supabase.createClient(cfg.url, cfg.anonKey) : null;
const tableName = cfg.productsTable || "products";
const bucketName = cfg.storageBucket || "product-images";

const CATEGORY_LABELS = {
  "photo-cover": "Photo Covers",
  "iphone-covers": "iPhone Covers",
  "samsung-covers": "Samsung Covers",
  "redmi-covers": "Redmi Covers",
  "oppo-covers": "Oppo Covers",
  "google-pixel": "Google Pixel",
  "airpod-covers": "AirPod Covers",
  "screen-protectors": "Screen Protectors",
  "camera-protectors": "Camera Protectors",
  "smart-watches": "Smart Watches",
  "watch-bands": "Watch Bands",
  "sim-cards": "Sim Cards",
  "mobile-accessories": "Mobile Accessories",
  "cordon": "Cordon",
  "travel-adapter": "Travel Adapter",
  "memory-cards": "Memory Cards",
  "headphones": "Headphones",
  "speaker": "Speaker",
  "offers": "Offers",
  "phones": "Phones",
  "mobile-repair": "Mobile Repair"
};

const loginPanel = document.getElementById("login-panel");
const passwordPanel = document.getElementById("password-panel");
const adminPanel = document.getElementById("admin-panel");
const setupWarning = document.getElementById("setup-warning");
const authNotice = document.getElementById("auth-notice");
const loginForm = document.getElementById("login-form");
const passwordForm = document.getElementById("password-form");
const productForm = document.getElementById("product-form");
const productList = document.getElementById("admin-product-list");
const imageInput = document.getElementById("product-image");
const imagePreview = document.getElementById("image-preview");
const toast = document.getElementById("admin-toast");
const dashboardStats = document.getElementById("dashboard-stats");
const searchInput = document.getElementById("product-search");
const categoryFilter = document.getElementById("category-filter");

let catalogCache = [];
let activeSearch = "";
let activeCategory = "all";

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    toast.hidden = true;
  }, 3200);
}

function getUrlParams() {
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const searchParams = new URLSearchParams(window.location.search);
  return { hashParams, searchParams };
}

function showAuthNotice(title, message) {
  const titleEl = document.getElementById("auth-notice-title");
  const messageEl = document.getElementById("auth-notice-message");
  if (titleEl) titleEl.textContent = title;
  if (messageEl) messageEl.textContent = message;
  if (authNotice) authNotice.hidden = false;
}

function clearAuthUrl() {
  if (window.location.hash || window.location.search) {
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

function getAuthErrorMessage() {
  const { hashParams, searchParams } = getUrlParams();
  const error = hashParams.get("error") || searchParams.get("error");
  const code = hashParams.get("error_code") || searchParams.get("error_code");
  const description = hashParams.get("error_description") || searchParams.get("error_description");

  if (!error && !code && !description) return "";
  if (code === "otp_expired") {
    return "Invitation link expired or already used. Create a new invite from Supabase Auth.";
  }
  return description || error || "Supabase could not complete this login link.";
}

function isPasswordSetupLink() {
  const { hashParams, searchParams } = getUrlParams();
  const type = hashParams.get("type") || searchParams.get("type");
  return type === "invite" || type === "recovery";
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function parseOptions(value) {
  return value
    .split(",")
    .map(item => item.trim())
    .filter(Boolean);
}

function categoryLabel(key) {
  return CATEGORY_LABELS[key] || key || "Uncategorized";
}

function setPanelState(isLoggedIn) {
  if (loginPanel) loginPanel.hidden = isLoggedIn;
  if (passwordPanel) passwordPanel.hidden = true;
  if (adminPanel) adminPanel.hidden = !isLoggedIn;
  if (dashboardStats) dashboardStats.hidden = !isLoggedIn;
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) logoutBtn.hidden = !isLoggedIn;
}

function setPasswordSetupState() {
  if (loginPanel) loginPanel.hidden = true;
  if (passwordPanel) passwordPanel.hidden = false;
  if (adminPanel) adminPanel.hidden = true;
  if (dashboardStats) dashboardStats.hidden = true;
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) logoutBtn.hidden = false;
}

function resetForm() {
  productForm.reset();
  document.getElementById("product-id").value = "";
  document.getElementById("existing-image-url").value = "";
  document.getElementById("product-active").checked = true;
  document.getElementById("product-sort").value = "100";
  document.getElementById("form-title").textContent = "Add product";
  imagePreview.hidden = true;
  imagePreview.removeAttribute("src");
  imageInput.value = "";
}

function fillForm(product) {
  document.getElementById("form-title").textContent = "Edit product";
  document.getElementById("product-id").value = product.id || "";
  document.getElementById("existing-image-url").value = product.image_url || "";
  document.getElementById("product-title").value = product.title || "";
  document.getElementById("product-category").value = product.category || "photo-cover";
  document.getElementById("product-badge").value = product.badge || "";
  document.getElementById("product-price").value = product.price ?? "";
  document.getElementById("product-old-price").value = product.old_price ?? "";
  document.getElementById("product-description").value = product.description || "";
  document.getElementById("product-options").value = Array.isArray(product.options) ? product.options.join(", ") : "";
  document.getElementById("product-sort").value = product.sort_order ?? 100;
  document.getElementById("product-active").checked = product.is_active !== false;

  if (product.image_url) {
    imagePreview.src = product.image_url;
    imagePreview.hidden = false;
  }
}

async function uploadImage(file) {
  const existing = document.getElementById("existing-image-url").value;
  if (!file) return existing;
  if (!client) return existing;

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`;
  const { error } = await client.storage.from(bucketName).upload(path, file, {
    cacheControl: "3600",
    upsert: false
  });

  if (error) throw error;

  const { data } = client.storage.from(bucketName).getPublicUrl(path);
  return data.publicUrl;
}

function applyFilters() {
  const query = activeSearch.toLowerCase();
  return catalogCache.filter(product => {
    const matchesCategory = activeCategory === "all" || product.category === activeCategory;
    const haystack = [
      product.title,
      product.description,
      product.category,
      product.badge,
      categoryLabel(product.category)
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return matchesCategory && haystack.includes(query);
  });
}

function updateStats(items = catalogCache) {
  const total = items.length;
  const visible = items.filter(item => item.is_active !== false).length;
  const hidden = total - visible;
  const totalEl = document.getElementById("stat-total");
  const visibleEl = document.getElementById("stat-visible");
  const hiddenEl = document.getElementById("stat-hidden");
  if (totalEl) totalEl.textContent = String(total);
  if (visibleEl) visibleEl.textContent = String(visible);
  if (hiddenEl) hiddenEl.textContent = String(hidden);
}

function renderProductList(items) {
  if (!productList) return;

  updateStats(items);

  if (!items.length) {
    productList.innerHTML = `
      <article class="admin-product">
        <div>
          <h3>No products found</h3>
          <p>Try a different search or category filter.</p>
        </div>
      </article>
    `;
    return;
  }

  productList.innerHTML = items.map(product => {
    const badgeHTML = product.badge ? `<span class="meta-pill">${product.badge}</span>` : "";
    const statusHTML = product.is_active === false
      ? `<span class="meta-pill muted"><i class="ti ti-eye-off"></i> Hidden</span>`
      : `<span class="meta-pill"><i class="ti ti-eye"></i> Visible</span>`;
    const oldPriceHTML = product.old_price ? `<span class="meta-pill muted"><i class="ti ti-tag"></i> Old €${Number(product.old_price).toFixed(2)}</span>` : "";

    return `
      <article class="admin-product">
        <img src="${product.image_url || "assets/hero-bg.png"}" alt="${product.title || "Product"}" />
        <div>
          <h3>${product.title || "Untitled product"}</h3>
          <p>${categoryLabel(product.category)} · €${Number(product.price || 0).toFixed(2)}</p>
          <div class="product-meta">
            ${statusHTML}
            ${badgeHTML}
            ${oldPriceHTML}
          </div>
        </div>
        <div class="row-actions">
          <button type="button" data-action="edit" data-id="${product.id}" title="Edit"><i class="ti ti-edit"></i></button>
          <button type="button" data-action="duplicate" data-id="${product.id}" title="Duplicate"><i class="ti ti-copy"></i></button>
          <button type="button" data-action="toggle" data-id="${product.id}" title="Toggle visibility"><i class="ti ti-eye-cog"></i></button>
          <button class="danger" type="button" data-action="delete" data-id="${product.id}" title="Delete"><i class="ti ti-trash"></i></button>
        </div>
      </article>
    `;
  }).join("");

  productList.querySelectorAll("button[data-action]").forEach(button => {
    button.addEventListener("click", async () => {
      const id = button.dataset.id;
      const action = button.dataset.action;
      const product = catalogCache.find(item => String(item.id) === String(id));
      if (!product) return;

      if (action === "edit") {
        fillForm(product);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      if (action === "duplicate") {
        fillForm({
          ...product,
          id: "",
          title: `${product.title} copy`
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
        showToast("Product copied into the editor.");
        return;
      }

      if (action === "toggle") {
        const { error } = await client.from(tableName).update({
          is_active: !product.is_active,
          updated_at: new Date().toISOString()
        }).eq("id", id);
        if (error) {
          showToast(error.message);
          return;
        }
        showToast(product.is_active ? "Product hidden." : "Product shown.");
        await loadProducts();
        return;
      }

      if (action === "delete") {
        const confirmed = confirm(`Delete "${product.title}"?`);
        if (!confirmed) return;
        const { error } = await client.from(tableName).delete().eq("id", id);
        if (error) {
          showToast(error.message);
          return;
        }
        showToast("Product deleted.");
        await loadProducts();
      }
    });
  });
}

async function loadProducts() {
  if (!client) {
    productList.innerHTML = `<p class="muted">Connect Supabase to see products.</p>`;
    return;
  }

  productList.innerHTML = `<p class="muted">Loading products...</p>`;
  const { data, error } = await client
    .from(tableName)
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    productList.innerHTML = `<p class="muted">${error.message}</p>`;
    return;
  }

  catalogCache = Array.isArray(data) ? data : [];
  renderProductList(applyFilters());
}

async function saveProduct(event) {
  event.preventDefault();

  if (!client) {
    showToast("Connect Supabase first.");
    return;
  }

  try {
    const title = document.getElementById("product-title").value.trim();
    if (!title) {
      showToast("Add a product title first.");
      return;
    }

    const idInput = document.getElementById("product-id");
    const existingId = idInput.value.trim();
    const id = existingId || `${slugify(title)}-${Date.now()}`;
    const file = imageInput.files[0];
    const existingImage = document.getElementById("existing-image-url").value;
    const imageUrl = await uploadImage(file);

    const payload = {
      id,
      title,
      category: document.getElementById("product-category").value,
      price: Number(document.getElementById("product-price").value || 0),
      old_price: document.getElementById("product-old-price").value ? Number(document.getElementById("product-old-price").value) : null,
      description: document.getElementById("product-description").value.trim(),
      image_url: imageUrl || existingImage,
      badge: document.getElementById("product-badge").value || null,
      options: parseOptions(document.getElementById("product-options").value),
      is_custom: false,
      is_active: document.getElementById("product-active").checked,
      sort_order: Number(document.getElementById("product-sort").value || 100),
      updated_at: new Date().toISOString()
    };

    if (!payload.image_url) {
      showToast("Please upload a product image.");
      return;
    }

    const { error } = await client.from(tableName).upsert(payload);
    if (error) throw error;

    showToast("Product saved.");
    resetForm();
    await loadProducts();
  } catch (error) {
    showToast(error.message || "Product could not be saved.");
  }
}

function bindFilters() {
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      activeSearch = searchInput.value || "";
      renderProductList(applyFilters());
    });
  }

  if (categoryFilter) {
    categoryFilter.addEventListener("change", () => {
      activeCategory = categoryFilter.value || "all";
      renderProductList(applyFilters());
    });
  }
}

async function initAdmin() {
  if (!hasConfig) {
    if (setupWarning) setupWarning.hidden = false;
    setPanelState(false);
    return;
  }

  const authErrorMessage = getAuthErrorMessage();
  if (authErrorMessage) {
    showAuthNotice("Invitation problem", authErrorMessage);
    clearAuthUrl();
  }

  bindFilters();

  const { data } = await client.auth.getSession();
  const hasSession = Boolean(data.session);

  if (hasSession && isPasswordSetupLink()) {
    setPasswordSetupState();
  } else {
    setPanelState(hasSession);
    if (hasSession) await loadProducts();
  }

  client.auth.onAuthStateChange(async (_event, session) => {
    const loggedIn = Boolean(session);
    setPanelState(loggedIn);
    if (loggedIn) {
      await loadProducts();
    }
  });

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) {
      showToast(error.message);
      return;
    }
    setPanelState(true);
    await loadProducts();
  });

  document.getElementById("logout-btn").addEventListener("click", async () => {
    await client.auth.signOut();
    setPanelState(false);
  });

  passwordForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const password = document.getElementById("new-password").value;
    const { error } = await client.auth.updateUser({ password });
    if (error) {
      showToast(error.message);
      return;
    }
    clearAuthUrl();
    showToast("Password saved.");
    setPanelState(true);
    await loadProducts();
  });

  document.getElementById("reset-form-btn").addEventListener("click", resetForm);
  document.getElementById("refresh-btn").addEventListener("click", loadProducts);
  productForm.addEventListener("submit", saveProduct);

  imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) return;
    imagePreview.src = URL.createObjectURL(file);
    imagePreview.hidden = false;
  });
}

document.addEventListener("DOMContentLoaded", initAdmin);
