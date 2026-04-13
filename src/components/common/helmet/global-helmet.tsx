"use client";

import { useEffect } from "react";
import { translate, useLocaleRefresh } from "@/i18n";
import { usePageTitleStore } from "@/stores";

/**
 * Syncs the browser tab title with the current page + locale.
 *
 * Replaces react-helmet (removed in the Next.js migration).
 * Static/SEO title is handled by Next.js `generateMetadata` in each page.tsx;
 * this component handles the dynamic suffix after hydration.
 */
export const GlobalHelmet = () => {
  useLocaleRefresh();
  const { title } = usePageTitleStore();

  useEffect(() => {
    document.title = translate("appName", { title });
  }, [title]);

  return null;
};
