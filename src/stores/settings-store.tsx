import { create } from "zustand";
import { Theme } from ".";

type FontType = "inter" | "manrope" | "system";

interface SettingsInterface {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  font: FontType;
  setFont: (font: FontType) => void;
}

const useSettingsStore = create<SettingsInterface>((set) => ({
  theme: undefined,
  setTheme: (theme: Theme) => set({ theme }),
  font: localStorage.getItem("vite-ui-font") as FontType | "inter",
  setFont: (font: FontType) => {
    console.log(font);

    localStorage.setItem("vite-ui-font", font);
    set({ font });
  },
}));

export { useSettingsStore };
export type { SettingsInterface };
