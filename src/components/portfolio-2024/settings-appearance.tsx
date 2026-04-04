"use client";

import { SideBarLayout } from "@/layout/sidebar-layout";
import { HeaderTitleProvider } from "@/providers/header-title-provider";
import { Settings } from "@/screens/settings/settings";
import { SettingsAppearance } from "@/screens/settings/sub-screen/settings-appearance";

export function SettingsAppearance2024() {
  return (
    <HeaderTitleProvider>
      <SideBarLayout>
        <Settings>
          <SettingsAppearance />
        </Settings>
      </SideBarLayout>
    </HeaderTitleProvider>
  );
}
