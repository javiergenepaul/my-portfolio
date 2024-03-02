import { create } from "zustand";

type LanguageType = "en" | "ja" | "fil" | "ceb";

interface LanguageStoreInterface {
  language: LanguageType;
  setLanguage: (language: LanguageType) => void;
}

const DEFAULT_LANGUAGE: LanguageType = "en";

const useLanguageStore = create<LanguageStoreInterface>((set) => ({
  language: DEFAULT_LANGUAGE,
  setLanguage: (language: LanguageType) => set({ language }),
}));

export { useLanguageStore, DEFAULT_LANGUAGE };
export type { LanguageStoreInterface, LanguageType };
