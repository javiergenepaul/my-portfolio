import { create } from "zustand";

interface ThemeStoreInterface {
  darkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;
}

const useThemeStore = create<ThemeStoreInterface>((set) => {
  const prefersDarkMode = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  return {
    darkMode: prefersDarkMode,
    toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
    setDarkMode: (value: boolean) => set(() => ({ darkMode: value })),
  };
});

export { useThemeStore };
export type { ThemeStoreInterface };
