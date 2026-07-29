# The World Mobile (v2)

Modern storefront built with **React**, **Vite**, **Tailwind CSS**, **Framer Motion**, and **React Three Fiber** (3D hero).

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
npm run preview
```

Deploy the `dist/` folder (GitHub Pages, Netlify, etc.).

### GitHub Pages subpath

If the site is not at the domain root, set `base` in `vite.config.ts`:

```ts
export default defineConfig({ base: "/your-repo-name/" });
```

## Supabase (optional)

Copy `.env.example` to `.env` and set:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Without these, the shop uses the built-in catalog in `src/data/catalog.ts`.

Product admin: open `/admin.html` after build (legacy admin UI, copied into `dist`).

## Previous static site

The original multi-page HTML site files (`about.html`, `app.js`, etc.) remain in the repo for reference. The new app replaces `index.html` as the Vite entry point.
