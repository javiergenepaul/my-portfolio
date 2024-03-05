import { create } from "zustand";

export type Theme = "dark" | "light" | "system" | undefined;
export type FontType = "inter" | "work-sans" | "poppins";
export type Color =
  | "azure"
  | "emerald"
  | "golden"
  | "sunset"
  | "lavender"
  | "scarlet"
  | "silver";

type ThemeStore = {
  theme: Theme;
  font: FontType;
  color: Color;
  enableParticleBackground: boolean;
  setFont: (font: FontType) => void;
  setTheme: (theme: Theme) => void;
  getSystemTheme: () => string;
  getTheme: () => boolean;
  toggleTheme: (isDark: boolean) => void;
  setColor: (color: Color) => void;
  setEnableParticleBackground: (enableParticlaBackground: boolean) => void;
};

export const useThemeStore = create<ThemeStore>((set, get) => ({
  enableParticleBackground: localStorage.getItem("vite-ui-enableParticle")
    ? localStorage.getItem("vite-ui-enableParticle") === "true"
    : true,
  theme: localStorage.getItem("vite-ui-theme") as Theme | undefined,
  color: localStorage.getItem("vite-ui-color") as Color | "emerald",
  setColor: (color: Color) => {
    localStorage.setItem("vite-ui-color", color as string);
    set({ color });
  },
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

      return systemTheme;
    }
    return get().theme as string;
  },
  setTheme: (theme: Theme) => {
    localStorage.setItem("vite-ui-theme", theme as string);
    set({ theme });
  },
  setEnableParticleBackground: (enableParticleBackground: boolean) => {
    localStorage.setItem(
      "vite-ui-enableParticle",
      enableParticleBackground ? "true" : "false"
    );
    set({ enableParticleBackground });
  },
}));

export default useThemeStore;
