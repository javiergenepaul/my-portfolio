"use client";

import { SideBarLayout } from "@/layout/sidebar-layout";
import { HeaderTitleProvider } from "@/providers/header-title-provider";
import { Project } from "@/screens/2024/project/project";

export function Projects2024() {
  return (
    <HeaderTitleProvider>
      <SideBarLayout>
        <Project />
      </SideBarLayout>
    </HeaderTitleProvider>
  );
}
