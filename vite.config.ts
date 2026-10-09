import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

// The hero plays /public/assets/videos/actif-textile-hero.mp4 when that file exists
// (restart the dev server after adding it); otherwise the WebGL knit-cloth fallback runs.
const heroVideoPresent = existsSync(
  resolve(process.cwd(), "public/assets/videos/actif-textile-hero.mp4"),
);

export default defineConfig({
  plugins: [tanstackStart(), viteReact(), tailwindcss(), tsConfigPaths()],
  define: {
    __HERO_VIDEO__: JSON.stringify(heroVideoPresent),
  },
});
