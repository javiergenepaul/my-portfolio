"use client";

import { SideBarLayout } from "@/layout/sidebar-layout";
import { HeaderTitleProvider } from "@/providers/header-title-provider";
import { Settings } from "@/screens/2024/settings/settings";
import { SettingsAppearance } from "@/screens/2024/settings/sub-screen/settings-appearance";

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
