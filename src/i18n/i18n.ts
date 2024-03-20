import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import * as LOCALE from "./locale";
import { DEFAULT_LANGUAGE } from "@/stores";

// Check local storage for preferred language
const preferredLanguage = localStorage.getItem("i18nextLng");

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false,
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: LOCALE.EN,
      },
      ja: {
        translation: LOCALE.JA,
      },
      fil: {
        translation: LOCALE.FIL,
      },
      ceb: {
        translation: LOCALE.CEB,
      },
      ar: {
        translation: LOCALE.AR,
      },
    },
  });

i18n.changeLanguage(
  preferredLanguage || navigator.language || DEFAULT_LANGUAGE
);

/**
 * Builds up valid keypaths for translations.
 * Update to your default locale of choice if not English.
 */
type DefaultLocale = typeof LOCALE.AR;
type TxKeyPath = RecursiveKeyOf<DefaultLocale>;
type RecursiveKeyOf<TObj extends Record<string, any>> = {
  [TKey in keyof TObj & string]: TObj[TKey] extends Record<string, any>
    ? `${TKey}` | `${TKey}.${RecursiveKeyOf<TObj[TKey]>}`
    : `${TKey}`;
}[keyof TObj & string];

export { i18n };
export type { TxKeyPath };
