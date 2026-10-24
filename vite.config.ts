import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// BASE_PATH is set by the GitHub Pages workflow ("/<repo-name>/"); locally the site lives at "/".
export default defineConfig({
  base: process.env.BASE_PATH ?? "/",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        studio: resolve(import.meta.dirname, "index.html"),
        shop: resolve(import.meta.dirname, "shop.html"),
      },
    },
  },
});
