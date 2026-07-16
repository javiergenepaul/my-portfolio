"use client";

import { SideBarLayout } from "@/layout/sidebar-layout";
import { HeaderTitleProvider } from "@/providers/header-title-provider";
import { ResumeBuilder } from "@/screens/2024/resume";
import type { ResumeData } from "@/screens/2024/resume/resume-content";

export function Resume2024({ content }: { content?: ResumeData }) {
  return (
    <HeaderTitleProvider>
      <SideBarLayout>
        <ResumeBuilder content={content} />
      </SideBarLayout>
    </HeaderTitleProvider>
  );
}
