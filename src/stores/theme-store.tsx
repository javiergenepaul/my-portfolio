// import { create } from "zustand";

// interface ThemeStoreInterface {
//   darkMode: boolean;
//   toggleDarkMode: () => void;
//   setDarkMode: (value: boolean) => void;
// }

// const useThemeStore = create<ThemeStoreInterface>((set) => {
//   const prefersDarkMode = window.matchMedia(
//     "(prefers-color-scheme: dark)"
//   ).matches;

//   return {
//     darkMode: prefersDarkMode,
//     toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
//     setDarkMode: (value: boolean) => set(() => ({ darkMode: value })),
//   };
// });

// export { useThemeStore };
// export type { ThemeStoreInterface };

import { create } from "zustand";

export type Theme = "dark" | "light" | "system" | undefined;

type ThemeStore = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  getSystemTheme: () => string;
  getTheme: () => boolean;
  toggleTheme: (isDark: boolean) => void;
};

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: undefined,
  getTheme: () => {
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

// export const useTheme = () => useThemeStore((state) => state.theme);

// export const ThemeProvider: React.FC<ThemeProviderProps> = ({
//   children,
//   defaultTheme = "system",
//   storageKey = "vite-ui-theme",
// }) => {
//   const theme = useTheme();

//   useEffect(() => {
//     const root = window.document.documentElement;

//     root.classList.remove("light", "dark");

//     if (theme === "system") {
//       const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
//       root.classList.add(systemTheme);
//       return;
//     } else

//     root.classList.add(theme);
//   }, [theme]);

//   useEffect(() => {
//     const storedTheme = localStorage.getItem(storageKey) as Theme | null;
//     if (storedTheme && storedTheme !== theme) {
//       useThemeStore.getState().setTheme(storedTheme);
//     } else if (!storedTheme && defaultTheme !== theme) {
//       useThemeStore.getState().setTheme(defaultTheme);
//     }
//   }, []);

//   return <>{children}</>;
// };
