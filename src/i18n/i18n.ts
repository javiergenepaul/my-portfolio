import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import {en, ja, fil, ceb} from "./locale"
 
i18n    
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, 
    },
    resources: {
      en: {
        translation: en
      },
      ja: {
        translation: ja
      },
      fil: {
        translation: fil
      },
      ceb: {
        translation: ceb
      }
    }
  });
i18n.changeLanguage(navigator.language || "en");

/**
 * Builds up valid keypaths for translations.
 * Update to your default locale of choice if not English.
 */
    type DefaultLocale = typeof en;
    type TxKeyPath = RecursiveKeyOf<DefaultLocale>;
    type RecursiveKeyOf<TObj extends Record<string, any>> = {
    [TKey in keyof TObj & string]: TObj[TKey] extends Record<string, any>
        ? `${TKey}` | `${TKey}.${RecursiveKeyOf<TObj[TKey]>}`
        : `${TKey}`;
    }[keyof TObj & string];

    export { i18n };
    export type { TxKeyPath };
