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
export type ProjectViewMOde =
  | "list-mode"
  | "grid-large-mode"
  | "grid-small-mode";

interface SettingsStore {
  theme: Theme;
  font: FontType;
  color: Color;
  isBackgroundOnly: boolean;
  sidenavSwipeToggle: boolean;
  sidenavSwipeSensitivity: number;
  enableParticleBackground: boolean;
  isSettingsNew: boolean;
  hideFloatingSettings: boolean;
  projectViewMode: ProjectViewMOde;
  setFont: (font: FontType) => void;
  setTheme: (theme: Theme) => void;
  getSystemTheme: () => string;
  getTheme: () => boolean;
  toggleTheme: (isDark: boolean) => void;
  setColor: (color: Color) => void;
  setEnableParticleBackground: (enableParticlaBackground: boolean) => void;
  setSideNavSwipeToggle: (sidenavSwipeToggle: boolean) => void;
  setSideNavSwipeSensitivity: (sidenavSwipeSensitivity: number) => void;
  setIsBackgroundOnly: (isBackgroundOnly: boolean) => void;
  setIsSettingsNew: (isSettingsNew: boolean) => void;
  setHideFloatingSettings: (hideFloatingSettings: boolean) => void;
  setProjectViewMode: (projectViewMode: ProjectViewMOde) => void;
}

const BACKGROUND_ONLY_LOCAL: string = "vite-ui-background-only";
const SETTINGS_NEW_LOCAL: string = "vite-ui-settings-new";
const SIDE_NAV_SWIPE_TOGGLE_LOCAL: string = "vite-ui-sidenavSwipeToggle";
const ENABLE_PARTICLE_LOCAL: string = "vite-ui-enableParticle";
const THEME_LOCAL: string = "vite-ui-theme";
const COLOR_LOCAL: string = "vite-ui-color";
const FONT_LOCAL: string = "vite-ui-font";
const SWIPE_SENSITIVITY_LOCAL: string = "vite-ui-sideNavSensitivity";
const PROJECT_VIEW_MODE_LOCAL: string = "vite-ui-projectViewMode";

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  hideFloatingSettings: false,
  isSettingsNew: localStorage.getItem(SETTINGS_NEW_LOCAL)
    ? localStorage.getItem(SETTINGS_NEW_LOCAL) === "true"
    : false,
  isBackgroundOnly: localStorage.getItem(BACKGROUND_ONLY_LOCAL)
    ? localStorage.getItem(BACKGROUND_ONLY_LOCAL) === "true"
    : false,
  sidenavSwipeToggle: localStorage.getItem(SIDE_NAV_SWIPE_TOGGLE_LOCAL)
    ? localStorage.getItem(SIDE_NAV_SWIPE_TOGGLE_LOCAL) === "true"
    : false,
  enableParticleBackground: localStorage.getItem(ENABLE_PARTICLE_LOCAL)
    ? localStorage.getItem(ENABLE_PARTICLE_LOCAL) === "true"
    : true,
  theme: localStorage.getItem(THEME_LOCAL) as Theme | undefined,
  color: localStorage.getItem(COLOR_LOCAL) as Color | "emerald",
  font: localStorage.getItem(FONT_LOCAL) as FontType | "inter",
  projectViewMode: localStorage.getItem(PROJECT_VIEW_MODE_LOCAL) as
    | ProjectViewMOde
    | "list-mode",
  sidenavSwipeSensitivity: localStorage.getItem(SWIPE_SENSITIVITY_LOCAL)
    ? parseInt(localStorage.getItem(SWIPE_SENSITIVITY_LOCAL) as string)
    : 50,
  setColor: (color: Color) => {
    localStorage.setItem(COLOR_LOCAL, color as string);
    set({ color });
  },
  setFont: (font: FontType) => {
    localStorage.setItem(FONT_LOCAL, font);
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
    localStorage.setItem(THEME_LOCAL, resultTheme);
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
    localStorage.setItem(THEME_LOCAL, theme as string);
    set({ theme });
  },
  setEnableParticleBackground: (enableParticleBackground: boolean) => {
    localStorage.setItem(
      ENABLE_PARTICLE_LOCAL,
      enableParticleBackground ? "true" : "false"
    );
    set({ enableParticleBackground });
  },
  setSideNavSwipeToggle: (sidenavSwipeToggle: boolean) => {
    localStorage.setItem(
      SIDE_NAV_SWIPE_TOGGLE_LOCAL,
      sidenavSwipeToggle ? "true" : "false"
    );
    set({ sidenavSwipeToggle });
  },
  setSideNavSwipeSensitivity: (sidenavSwipeSensitivity: number) => {
    localStorage.setItem(
      SWIPE_SENSITIVITY_LOCAL,
      sidenavSwipeSensitivity.toString()
    );
    set({ sidenavSwipeSensitivity });
  },
  setIsBackgroundOnly: (isBackgroundOnly: boolean) => {
    localStorage.setItem(
      BACKGROUND_ONLY_LOCAL,
      isBackgroundOnly ? "true" : "false"
    );
    set({ isBackgroundOnly });
  },
  setIsSettingsNew: (isSettingsNew: boolean) => {
    localStorage.setItem(SETTINGS_NEW_LOCAL, isSettingsNew ? "true" : "false");
    set({ isSettingsNew });
  },
  setHideFloatingSettings: (hideFloatingSettings: boolean) => {
    set({ hideFloatingSettings });
  },
  setProjectViewMode: (projectViewMode: ProjectViewMOde) => {
    localStorage.setItem(PROJECT_VIEW_MODE_LOCAL, projectViewMode.toString());
    set({ projectViewMode });
  },
}));

export default useSettingsStore;
