"use client";

import { NextIntlClientProvider } from "next-intl";
import { useEffect, useState } from "react";
import { useLanguageStore } from "@/stores";
import { messageStore } from "@/i18n/store";
// Only English is bundled statically — other locales are fetched on demand.
import en from "@/i18n/locale/en.json";

type Locale = "en" | "ja" | "fil" | "ceb";
type Messages = typeof en;

async function loadLocale(locale: Locale): Promise<Messages> {
  if (locale === "en") return en;
  const mod = await import(`@/i18n/locale/${locale}.json`);
  return mod.default as Messages;
}

/**
 * Client-side i18n provider.
 *
 * Bundle strategy:
 *  - `en` is the only statically imported bundle (smallest initial JS).
 *  - All other locales are fetched via dynamic import only when selected.
 *  - On first render the active locale from localStorage is loaded; if it
 *    differs from "en" there is a single short re-render once it resolves.
 */
export function I18nProvider({ children }: { children: React.ReactNode }) {
  const { language } = useLanguageStore();
  const requested = (language as Locale) ?? "en";

  const [activeLocale, setActiveLocale] = useState<Locale>("en");
  const [messages, setMessages] = useState<Messages>(en);

  useEffect(() => {
    if (requested === activeLocale) return;
    loadLocale(requested).then((msgs) => {
      setMessages(msgs);
      setActiveLocale(requested);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requested]);

  // Sync singleton before children render
  messageStore.init(activeLocale, messages);

  return (
    <NextIntlClientProvider locale={activeLocale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
