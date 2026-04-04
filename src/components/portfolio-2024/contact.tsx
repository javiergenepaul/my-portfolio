"use client";

import { SideBarLayout } from "@/layout/sidebar-layout";
import { HeaderTitleProvider } from "@/providers/header-title-provider";
import { Contact } from "@/screens/contact/contact";

export function Contact2024() {
  return (
    <HeaderTitleProvider>
      <SideBarLayout>
        <Contact />
      </SideBarLayout>
    </HeaderTitleProvider>
  );
}
