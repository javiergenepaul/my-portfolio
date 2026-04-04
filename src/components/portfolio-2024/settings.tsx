"use client";

import { SideBarLayout } from "@/layout/sidebar-layout";
import { HeaderTitleProvider } from "@/providers/header-title-provider";
import { Settings } from "@/screens/settings/settings";
import { SettingsGeneral } from "@/screens/settings/sub-screen/settings-general";

export function Settings2024() {
  return (
    <HeaderTitleProvider>
      <SideBarLayout>
        <Settings>
          <SettingsGeneral />
        </Settings>
      </SideBarLayout>
    </HeaderTitleProvider>
  );
}
