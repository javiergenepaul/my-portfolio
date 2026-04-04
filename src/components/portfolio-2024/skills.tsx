"use client";

import { SideBarLayout } from "@/layout/sidebar-layout";
import { HeaderTitleProvider } from "@/providers/header-title-provider";
import { Skills } from "@/screens/skills/skills";

export function Skills2024() {
  return (
    <HeaderTitleProvider>
      <SideBarLayout>
        <Skills />
      </SideBarLayout>
    </HeaderTitleProvider>
  );
}
