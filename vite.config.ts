import path from "path";
import sirv from "sirv";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

function serveAssetsDir(): Plugin {
  const assetsPath = path.resolve(__dirname, "assets");
  return {
    name: "serve-root-assets",
    configureServer(server) {
      server.middlewares.use("/assets", sirv(assetsPath, { dev: true, etag: true }));
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    serveAssetsDir(),
    viteStaticCopy({
      targets: [
        { src: "assets/**/*", dest: "assets" },
        { src: "admin.html", dest: "." },
        { src: "admin.js", dest: "." },
        { src: "admin.css", dest: "." },
        { src: "supabase-config.js", dest: "." },
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    fs: { allow: ["."] },
  },
});
