import { create } from "zustand";

export type Theme = "dark" | "light" | "system" | undefined;
type FontType = "inter" | "manrope" | "system";

type ThemeStore = {
  theme: Theme;
  font: FontType;
  setFont: (font: FontType) => void;
  setTheme: (theme: Theme) => void;
  getSystemTheme: () => string;
  getTheme: () => boolean;
  toggleTheme: (isDark: boolean) => void;
};

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: localStorage.getItem("vite-ui-theme") as Theme | undefined,
  font: localStorage.getItem("vite-ui-font") as FontType | "inter",
  setFont: (font: FontType) => {
    localStorage.setItem("vite-ui-font", font);
    set({ font });
  },
  getTheme: (): boolean => {
    const currentTheme = get().theme;
    if (currentTheme === "system") {
      return get().getSystemTheme() !== "light";
    } else {
      return currentTheme === "dark";
    }
  },
  toggleTheme: (isDark: boolean) => {
    const resultTheme: Theme = isDark ? "dark" : "light";
    localStorage.setItem("vite-ui-theme", resultTheme);
    set({ theme: resultTheme });
  },
  getSystemTheme: (): string => {
    if (get().theme === undefined || get().theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      console.log("get system theme");
      console.log(systemTheme);
      return systemTheme;
    }
    return get().theme as string;
  },
  setTheme: (theme: Theme) => {
    localStorage.setItem("vite-ui-theme", theme as string);
    set({ theme });
  },
}));
