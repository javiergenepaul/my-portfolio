"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSettingsStore } from "@/stores";
import { SideBarLayout } from "@/layout/sidebar-layout";
import { HeaderTitleProvider } from "@/providers/header-title-provider";
import { Hero } from "@/screens/hero/hero";
import { initAnalytics, logPageView } from "@/lib";
import { PATH } from "@/config";

/**
 * Client shell that renders the 2024 Hero page within the sidebar layout.
 * Analytics and floating-settings visibility are managed here (mirroring
 * the old routes.tsx AppScreen component).
 */
export function Portfolio2024Shell() {
  const pathname = usePathname();
  const { setHideFloatingSettings } = useSettingsStore();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    logPageView(pathname);
  }, [pathname]);

  useEffect(() => {
    const settingsPaths = [
      PATH.SETTINGS.path,
      PATH.SETTINGS_APPEARNCE.path,
      PATH.SETTINGS_GENERAL.path,
    ];
    setHideFloatingSettings((settingsPaths as readonly string[]).includes(pathname));
    window.scrollTo(0, 0);
  }, [pathname, setHideFloatingSettings]);

  return (
    <HeaderTitleProvider>
      <SideBarLayout>
        <Hero />
      </SideBarLayout>
    </HeaderTitleProvider>
  );
}
