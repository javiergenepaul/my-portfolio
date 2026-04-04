import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Theme = "dark" | "light" | "system";
export type Color =
  | "azure"
  | "emerald"
  | "golden"
  | "sunset"
  | "lavender"
  | "scarlet"
  | "silver";
export type FontFamily = "inter" | "work-sans" | "poppins";

interface SettingsState {
  theme: Theme;
  color: Color;
  font: FontFamily;
  enableParticleBackground: boolean;
  isBackgroundOnly: boolean;
  hideFloatingSettings: boolean;
  sidenavSwipeToggle: boolean;
  sidenavSwipeSensitivity: number;
  isSettingsNew: boolean;

  setTheme: (theme: Theme) => void;
  setColor: (color: Color) => void;
  setFont: (font: FontFamily) => void;
  setEnableParticleBackground: (value: boolean) => void;
  setIsBackgroundOnly: (value: boolean) => void;
  setHideFloatingSettings: (value: boolean) => void;
  setSidenavSwipeToggle: (value: boolean) => void;
  setSidenavSwipeSensitivity: (value: number) => void;
  setIsSettingsNew: (value: boolean) => void;
  /** Returns true when the resolved theme is light. */
  getTheme: () => boolean;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      theme: "system",
      color: "emerald",
      font: "inter",
      enableParticleBackground: true,
      isBackgroundOnly: false,
      hideFloatingSettings: false,
      sidenavSwipeToggle: true,
      sidenavSwipeSensitivity: 50,
      isSettingsNew: false,

      setTheme: (theme) => set({ theme }),
      setColor: (color) => set({ color }),
      setFont: (font) => set({ font }),
      setEnableParticleBackground: (enableParticleBackground) =>
        set({ enableParticleBackground }),
      setIsBackgroundOnly: (isBackgroundOnly) => set({ isBackgroundOnly }),
      setHideFloatingSettings: (hideFloatingSettings) =>
        set({ hideFloatingSettings }),
      setSidenavSwipeToggle: (sidenavSwipeToggle) =>
        set({ sidenavSwipeToggle }),
      setSidenavSwipeSensitivity: (sidenavSwipeSensitivity) =>
        set({ sidenavSwipeSensitivity }),
      setIsSettingsNew: (isSettingsNew) => set({ isSettingsNew }),

      getTheme: () => {
        const { theme } = get();
        if (theme === "system") {
          if (typeof window === "undefined") return false;
          return !window.matchMedia("(prefers-color-scheme: dark)").matches;
        }
        return theme === "light";
      },
    }),
    {
      name: "portfolio-settings",
      // createJSONStorage with localStorage is fine here because this store is
      // only accessed inside "use client" components. The `skipHydration`
      // pattern is not needed since all consumers are client-side.
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : (null as any)
      ),
      // Only persist user preferences, not transient UI state.
      partialize: (state) => ({
        theme: state.theme,
        color: state.color,
        font: state.font,
        enableParticleBackground: state.enableParticleBackground,
        sidenavSwipeToggle: state.sidenavSwipeToggle,
        sidenavSwipeSensitivity: state.sidenavSwipeSensitivity,
        isSettingsNew: state.isSettingsNew,
      }),
    }
  )
);
