import { DEV_MODE } from "@/config";
import { Theme, useSettingsStore } from "@/stores";
import { useEffect } from "react";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
}) => {
  const { theme, setTheme, color } = useSettingsStore();
  useEffect(() => {
    if (DEV_MODE && DEV_MODE === "development") {
      const root = window.document.documentElement;
      root.classList.add("debug-screens");
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    // reset first
    root.classList.remove(
      "azure",
      "emerald",
      "golden",
      "sunset",
      "lavender",
      "scarlet",
      "silver"
    );

    if (color) {
      root.classList.add(color);
    } else {
      // set default when color palette is empty
      root.classList.add("emerald");
    }
  }, [color]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme as string);
  }, [theme]);

  useEffect(() => {
    const storedTheme = localStorage.getItem(storageKey) as Theme | null;
    if (storedTheme && storedTheme !== theme) {
      setTheme(storedTheme);
    } else if (!storedTheme && defaultTheme !== theme) {
      setTheme(defaultTheme);
    }
  }, []);

  return <>{children}</>;
};
