"use client";

import { SideBarLayout } from "@/layout/sidebar-layout";
import { HeaderTitleProvider } from "@/providers/header-title-provider";
import { ResumeBuilder } from "@/screens/resume";

export function Resume2024() {
  return (
    <HeaderTitleProvider>
      <SideBarLayout>
        <ResumeBuilder />
      </SideBarLayout>
    </HeaderTitleProvider>
  );
}
