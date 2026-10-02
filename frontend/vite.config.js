import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { ssrDevPlugin } from "./ssr/plugin.js";

const frontendRoot = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(frontendRoot, "..");

export default defineConfig({
  plugins: [react(), ssrDevPlugin(repoRoot, frontendRoot)],
  resolve: {
    conditions: ["module", "browser", "development", "import"],
    alias: {
      "react-helmet-async": path.resolve(frontendRoot, "node_modules/react-helmet-async/lib/index.esm.js"),
    },
  },
  ssr: {
    resolve: {
      conditions: ["module", "browser", "development", "import"],
      externalConditions: ["module", "import"],
    },
  },
  server: {
    port: 5173,
    fs: {
      allow: [repoRoot],
    },
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/uploads": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
