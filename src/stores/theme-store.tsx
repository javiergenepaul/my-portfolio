// useThemeStore.ts
import create from "zustand";

interface ThemeStoreState {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const useThemeStore = create<ThemeStoreState>((set) => {
  const prefersDarkMode = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  return {
    darkMode: prefersDarkMode,
    toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  };
});

export default useThemeStore;
