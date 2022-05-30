import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import ESLintPlugin from "@modyqyw/vite-plugin-eslint";
import StylelintPlugin from "vite-plugin-stylelint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [ react(), ESLintPlugin(), StylelintPlugin() ]
});
