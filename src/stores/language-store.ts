import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type LanguageType = "en" | "ja" | "fil" | "ceb";
export const DEFAULT_LANGUAGE: LanguageType = "en";

interface LanguageState {
  language: LanguageType;
  setLanguage: (language: LanguageType) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: DEFAULT_LANGUAGE,
      setLanguage: (language) => set({ language }),
    }),
    {
      name: "portfolio-language",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : (null as any),
      ),
    },
  ),
);
