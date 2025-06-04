import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import utwm from "unplugin-tailwindcss-mangle/vite"; // Add this import

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), utwm()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
