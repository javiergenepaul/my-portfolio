import { create } from "zustand";

interface ThemeStoreInterface {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const useThemeStore = create<ThemeStoreInterface>((set) => {
  const prefersDarkMode = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  return {
    darkMode: prefersDarkMode,
    toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  };
});

export { useThemeStore };
export type { ThemeStoreInterface };
