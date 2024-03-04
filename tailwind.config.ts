import type { Config } from "tailwindcss";
import AnimatePlugin from "tailwindcss-animate";
import DebugScreen from "tailwindcss-debug-screens";

import { ShadcnPlugin } from "./src/lib/shadcn-plugin";

const config = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  plugins: [AnimatePlugin, ShadcnPlugin, DebugScreen],
} satisfies Config;

export default config;
