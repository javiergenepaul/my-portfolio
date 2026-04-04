"use client";

import { NextIntlClientProvider } from "next-intl";
import { useLanguageStore } from "@/stores";
import { messageStore } from "@/i18n/store";
import { en, ja, fil, ceb } from "@/i18n/locale";

type Locale = "en" | "ja" | "fil" | "ceb";
const allMessages: Record<Locale, typeof en> = { en, ja, fil, ceb };

/**
 * Client-side i18n provider — replaces i18next + I18nextProvider.
 *
 * How it works:
 *  1. Reads `language` from Zustand (persisted to localStorage).
 *  2. Passes the matching message bundle to `NextIntlClientProvider`.
 *  3. Calls `messageStore.init()` **synchronously during render** so the
 *     `translate()` helper always has fresh messages before any child paints.
 *
 * When the user switches language:
 *  - `useLanguageStore()` triggers a re-render of this provider.
 *  - `messageStore` is updated synchronously.
 *  - `NextIntlClientProvider` receives new `messages` + `locale` props.
 *  - All children using `useTranslations()` / `useLocaleRefresh()` re-render.
 */
export function I18nProvider({ children }: { children: React.ReactNode }) {
  const { language } = useLanguageStore();
  const locale = (language as Locale) ?? "en";
  const messages = allMessages[locale] ?? en;

  // Sync singleton before children render — no async, no flash
  messageStore.init(locale, messages);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
