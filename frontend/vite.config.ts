import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  esbuild: {
    // Skip TypeScript type checking during build
    logOverride: { "this-is-undefined-in-esm": "silent" },
  },
  build: {
    // Skip TypeScript checking during build
    target: "esnext",
    minify: true,
  },
});
