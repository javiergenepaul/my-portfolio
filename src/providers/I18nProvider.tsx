"use client";

import { NextIntlClientProvider } from "next-intl";
import { useLanguageStore } from "@/stores";
import { messageStore } from "@/i18n/store";
import en from "@/i18n/locale/en.json";
import ja from "@/i18n/locale/ja.json";
import fil from "@/i18n/locale/fil.json";
import ceb from "@/i18n/locale/ceb.json";

type Locale = "en" | "ja" | "fil" | "ceb";
type Messages = typeof en;

// All locales bundled at startup — switching is fully synchronous, zero load time.
const LOCALES: Record<Locale, Messages> = {
  en,
  ja: ja as unknown as Messages,
  fil: fil as unknown as Messages,
  ceb: ceb as unknown as Messages,
};

/**
 * Client-side i18n provider.
 *
 * All locale files are bundled statically so language switching is instant —
 * no async chunk fetches, no useEffect round-trips, one synchronous re-render.
 */
export function I18nProvider({ children }: { children: React.ReactNode }) {
  const { language } = useLanguageStore();
  const locale = ((language as Locale) in LOCALES ? language : "en") as Locale;
  const messages = LOCALES[locale];

  // Sync singleton before children render — translate() is always up-to-date
  messageStore.init(locale, messages);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
