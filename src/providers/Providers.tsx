"use client";

import { ThemeProvider } from "./ThemeProvider";
import { I18nProvider } from "./I18nProvider";
import { Toaster } from "@/components/ui/toaster";
import { FloatingNavigation } from "@/components/draggable/floating-navigation";
import dynamic from "next/dynamic";

const BackgroundParticle = dynamic(
  () =>
    import("@/components/particles/background-particle").then(
      (m) => m.BackgroundParticle
    ),
  { ssr: false }
);
import { LoadingMask } from "@/components/loading-mask/loading-mask";
import { GlobalHelmet } from "@/components/helmet/global-helmet";

/**
 * Root client provider tree.
 *
 * Ordering matters:
 *  1. I18nProvider  — must wrap everything that calls `translate()` / `useLocaleRefresh()`
 *  2. ThemeProvider — applies CSS classes to <html> after hydration
 *  3. UI chrome     — floating settings, particles, toasts (depend on both above)
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <ThemeProvider>
        <GlobalHelmet />
        <LoadingMask />
        <Toaster />
        <FloatingNavigation />
        <BackgroundParticle />
        {children}
      </ThemeProvider>
    </I18nProvider>
  );
}
