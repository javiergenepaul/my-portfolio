"use client";

import dynamic from "next/dynamic";
import { ThemeProvider } from "./ThemeProvider";
import { I18nProvider } from "./I18nProvider";
import { Toaster } from "@/components/common/ui/toaster";
import { GlobalHelmet } from "@/components/common/helmet/global-helmet";
import { SplashRemover } from "@/components/common/splash/SplashRemover";

const LoadingMask = dynamic(
  () =>
    import("@/components/common/loading-mask/loading-mask").then((m) => m.LoadingMask),
  { ssr: false },
);

/**
 * Root client provider tree — global to every page/year.
 *
 * Ordering matters:
 *  1. I18nProvider  — must wrap everything that calls `translate()` / `useLocaleRefresh()`
 *  2. ThemeProvider — applies CSS classes to <html> after hydration
 *  3. Global UI chrome (toasts, loading mask, splash removal)
 *
 * 2024-specific chrome (FloatingNavigation, BackgroundParticle) lives in
 * src/app/(years)/2024/layout-client.tsx so it never renders on 2025/2026.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <ThemeProvider>
        <SplashRemover />
        <GlobalHelmet />
        <LoadingMask />
        <Toaster />
        {children}
      </ThemeProvider>
    </I18nProvider>
  );
}
