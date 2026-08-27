import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? `/${process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "loko-swm-fan-zone-landing"}/` : "/",
  plugins: [react()],
  publicDir: resolve(__dirname, "../landing/assets"),
  server: {
    fs: {
      allow: [resolve(__dirname, "..")],
    },
  },
});
