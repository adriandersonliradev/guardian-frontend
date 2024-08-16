import path from "node:path";

import react from "@vitejs/plugin-react";
import type { UserConfig } from "vite";
import { defineConfig } from "vite";
import type { InlineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: "./test/setup.ts",
    coverage: {
      // exclude: ["**/node_modules/**", "**/dist/**"],
      include: ["src/**/*.{ts,tsx}"],
      reporter: ["text", "json", "html"],
    },
  },
} as UserConfig & {
  test: InlineConfig;
});
