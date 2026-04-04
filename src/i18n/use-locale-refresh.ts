"use client";

import { useTranslations } from "next-intl";

/**
 * Subscribe a client component to locale changes.
 *
 * Under the hood this calls `useTranslations()` from next-intl, which
 * re-renders the component whenever `NextIntlClientProvider` receives new
 * messages (i.e. when the user switches language).
 *
 * Use this in any component that calls `translate()` but doesn't already
 * call `useTranslations()` directly — it replaces the old react-i18next
 * `const {} = useTranslation()` pattern.
 *
 * @example
 * ```tsx
 * export const MyComponent = () => {
 *   useLocaleRefresh();
 *   return <p>{translate("someKey")}</p>;
 * };
 * ```
 */
export function useLocaleRefresh(): void {
  useTranslations();
}
