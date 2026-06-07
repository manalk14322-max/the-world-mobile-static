const cfg = window.TWM_SUPABASE_CONFIG || {};
const hasConfig = Boolean(cfg.url && cfg.anonKey && window.supabase?.createClient);
const client = hasConfig ? window.supabase.createClient(cfg.url, cfg.anonKey) : null;
const tableName = cfg.productsTable || "products";
const bucketName = cfg.storageBucket || "product-images";

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

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  setTimeout(() => {
    toast.hidden = true;
  }, 3200);
}

function getUrlParams() {
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const searchParams = new URLSearchParams(window.location.search);
  return { hashParams, searchParams };
}

function showAuthNotice(title, message) {
  document.getElementById("auth-notice-title").textContent = title;
  document.getElementById("auth-notice-message").textContent = message;
  authNotice.hidden = false;
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
    return "Invitation link expired or already used. Create a new invite after fixing Supabase redirect URL settings.";
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

function getOptionsArray() {
  return document
    .getElementById("product-options")
    .value
    .split(",")
    .map(item => item.trim())
    .filter(Boolean);
}

function setPanelState(isLoggedIn) {
  loginPanel.hidden = isLoggedIn;
  passwordPanel.hidden = true;
  adminPanel.hidden = !isLoggedIn;
  document.getElementById("logout-btn").hidden = !isLoggedIn;
}

function setPasswordSetupState() {
  loginPanel.hidden = true;
  passwordPanel.hidden = false;
  adminPanel.hidden = true;
  document.getElementById("logout-btn").hidden = false;
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
}

function fillForm(product) {
  document.getElementById("form-title").textContent = "Edit product";
  document.getElementById("product-id").value = product.id;
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
  if (!file) return document.getElementById("existing-image-url").value;

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

async function loadProducts() {
  if (!client) return;

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

  if (!data.length) {
    productList.innerHTML = `<p class="muted">No products yet. Add the first one from the form.</p>`;
    return;
  }

  productList.innerHTML = data.map(product => `
    <article class="admin-product">
      <img src="${product.image_url || "assets/hero-bg.png"}" alt="${product.title}">
      <div>
        <h3>${product.title}</h3>
        <span>${product.category} - €${Number(product.price || 0).toFixed(2)} - ${product.is_active ? "Visible" : "Hidden"}</span>
      </div>
      <div class="row-actions">
        <button type="button" data-action="edit" data-id="${product.id}" title="Edit"><i class="ti ti-edit"></i></button>
        <button class="danger" type="button" data-action="delete" data-id="${product.id}" title="Delete"><i class="ti ti-trash"></i></button>
      </div>
    </article>
  `).join("");

  productList.querySelectorAll("button[data-action]").forEach(button => {
    button.addEventListener("click", async () => {
      const id = button.dataset.id;
      const action = button.dataset.action;
      const product = data.find(item => String(item.id) === String(id));

      if (action === "edit" && product) {
        fillForm(product);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      if (action === "delete") {
        const confirmed = confirm("Delete this product?");
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

async function saveProduct(event) {
  event.preventDefault();

  try {
    const idInput = document.getElementById("product-id");
    const title = document.getElementById("product-title").value.trim();
    const id = idInput.value || `${slugify(title)}-${Date.now()}`;
    const imageUrl = await uploadImage(imageInput.files[0]);

    const payload = {
      id,
      title,
      category: document.getElementById("product-category").value,
      price: Number(document.getElementById("product-price").value || 0),
      old_price: document.getElementById("product-old-price").value ? Number(document.getElementById("product-old-price").value) : null,
      description: document.getElementById("product-description").value.trim(),
      image_url: imageUrl,
      badge: document.getElementById("product-badge").value || null,
      options: getOptionsArray(),
      is_custom: false,
      is_active: document.getElementById("product-active").checked,
      sort_order: Number(document.getElementById("product-sort").value || 100),
      updated_at: new Date().toISOString()
    };

    const { error } = await client.from(tableName).upsert(payload);
    if (error) throw error;

    showToast("Product saved.");
    resetForm();
    await loadProducts();
  } catch (error) {
    showToast(error.message || "Product could not be saved.");
  }
}

async function initAdmin() {
  if (!hasConfig) {
    setupWarning.hidden = false;
    setPanelState(false);
    return;
  }

  const authErrorMessage = getAuthErrorMessage();
  if (authErrorMessage) {
    showAuthNotice("Invitation problem", authErrorMessage);
    clearAuthUrl();
  }

  const { data } = await client.auth.getSession();
  const hasSession = Boolean(data.session);

  if (hasSession && isPasswordSetupLink()) {
    setPasswordSetupState();
  } else {
    setPanelState(hasSession);
    if (hasSession) await loadProducts();
  }

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

