"use client";

import { SideBarLayout } from "@/layout/sidebar-layout";
import { HeaderTitleProvider } from "@/providers/header-title-provider";
import { About } from "@/screens/about/about";

export function About2024() {
  return (
    <HeaderTitleProvider>
      <SideBarLayout>
        <About />
      </SideBarLayout>
    </HeaderTitleProvider>
  );
}
