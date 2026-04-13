"use client";

import { SideBarLayout } from "@/layout/sidebar-layout";
import { HeaderTitleProvider } from "@/providers/header-title-provider";
import { Confidential } from "@/screens/2024/confidential/confidential";

export function Confidential2024() {
  return (
    <HeaderTitleProvider>
      <SideBarLayout>
        <Confidential />
      </SideBarLayout>
    </HeaderTitleProvider>
  );
}
