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
  theme: undefined,
  font: "inter",
  setFont: (font: FontType) => set({ font }),
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
      return systemTheme;
    }
    return get().theme as string;
  },
  setTheme: (theme: Theme) => {
    localStorage.setItem("vite-ui-theme", get().getSystemTheme());
    set({ theme });
  },
}));
