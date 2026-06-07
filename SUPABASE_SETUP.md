# Supabase Admin Setup

1. Create a Supabase project.
2. Open Supabase SQL Editor and run `supabase-schema.sql`.
3. Go to Authentication > Users and create one user for the client.
4. Fix invitation redirect URLs:
   - Go to Authentication > URL Configuration.
   - In Site URL, enter your live website URL.
     Example: `https://your-github-username.github.io/your-repo/`
   - In Redirect URLs, add the admin page URL.
     Example: `https://your-github-username.github.io/your-repo/admin.html`
   - For local testing, also add:
     `http://127.0.0.1:5500/admin.html`
     or whatever local URL your editor/server uses.
   - Click Save.
5. Go to Project Settings > API and copy:
   - Project URL
   - anon public key
6. Paste them in `supabase-config.js`:

```js
window.TWM_SUPABASE_CONFIG = {
  url: "https://YOUR-PROJECT.supabase.co",
  anonKey: "YOUR_ANON_KEY",
  productsTable: "products",
  storageBucket: "product-images"
};
```

7. Open `admin.html`, login with the Auth user, and add products.
8. The main website will load live products automatically from Supabase.

## If Invite Email Opens `localhost:3000`

This means Supabase Authentication > URL Configuration still has `localhost:3000` as the Site URL.

Fix:

1. Go to Supabase > Authentication > URL Configuration.
2. Replace Site URL with your real website URL.
3. Add your real `admin.html` URL in Redirect URLs.
4. Save.
5. Go to Authentication > Users.
6. Delete the old pending user or create a fresh invite.
7. Send a new invitation email.

Old invitation links cannot be repaired after they expire. Send a new invite.

## Easier Login Option

Instead of invitation email, you can create the client user manually:

1. Go to Authentication > Users.
2. Click Add user.
3. Enter email and password.
4. Enable Auto Confirm User.
5. Click Create user.
6. Give the client `admin.html`, email, and password.

If Supabase is not configured or has no products yet, the website will keep showing the built-in demo catalog.
