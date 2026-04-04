import { getRequestConfig } from "next-intl/server";
import { en, ja, fil, ceb } from "./locale";

export type Locale = "en" | "ja" | "fil" | "ceb";
export const defaultLocale: Locale = "en";

const allMessages: Record<Locale, typeof en> = { en, ja, fil, ceb };

/**
 * next-intl server configuration.
 * Used when server components need translations via `getTranslations()`.
 * The locale is passed via the `locale` param from middleware.
 */
export default getRequestConfig(async ({ locale }) => ({
  locale: locale ?? defaultLocale,
  messages: allMessages[(locale as Locale) ?? defaultLocale] ?? en,
}));
