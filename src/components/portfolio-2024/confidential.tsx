"use client";

import { SideBarLayout } from "@/layout/sidebar-layout";
import { HeaderTitleProvider } from "@/providers/header-title-provider";
import { Confidential } from "@/screens/confidential/confidential";

export function Confidential2024() {
  return (
    <HeaderTitleProvider>
      <SideBarLayout>
        <Confidential />
      </SideBarLayout>
    </HeaderTitleProvider>
  );
}
