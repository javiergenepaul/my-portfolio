"use client";

import { useLanguageStore } from "@/stores";

/**
 * Subscribe a client component to locale changes.
 *
 * Under the hood this subscribes to the persisted language Zustand store,
 * which re-renders the component whenever the current locale changes.
 *
 * Use this in any component that calls `translate()` but doesn't already
 * read the language store directly.
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
  useLanguageStore((state) => state.language);
}
