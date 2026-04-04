"use client";

import { useEffect } from "react";
import { useSettingsStore } from "@/stores";

type ThemeProviderProps = {
  children: React.ReactNode;
};

/**
 * Applies color palette, dark/light, and font-family classes to <html>.
 * Must be a Client Component because it reads from localStorage via Zustand.
 *
 * In Next.js, <html> is rendered server-side so we suppress hydration warnings
 * on it. This component runs after hydration to apply the correct classes.
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { theme, color, font } = useSettingsStore();

  // ── Apply dark / light class ──────────────────────────────────────────
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      root.classList.add(systemDark ? "dark" : "light");
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // ── Apply color palette class ─────────────────────────────────────────
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(
      "azure",
      "emerald",
      "golden",
      "sunset",
      "lavender",
      "scarlet",
      "silver"
    );
    root.classList.add(color ?? "emerald");
  }, [color]);

  // ── Apply font-family to <body> ───────────────────────────────────────
  // Read the computed CSS variable value (set by next/font on <body>) and
  // apply it as a concrete inline style — no CSS var() chain to break.
  useEffect(() => {
    const cssVarMap: Record<string, string> = {
      inter: "--font-inter-variable",
      poppins: "--font-poppins-variable",
      "work-sans": "--font-work-sans-variable",
    };
    const varName = cssVarMap[font] ?? "--font-inter-variable";
    const computed = getComputedStyle(document.body)
      .getPropertyValue(varName)
      .trim();
    document.body.style.fontFamily = computed
      ? `${computed}, sans-serif`
      : "sans-serif";
  }, [font]);

  return <>{children}</>;
};
