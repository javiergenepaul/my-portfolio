"use client";

import React from "react";
import { translate, useLocaleRefresh } from "@/i18n";
import { useLanguageStore } from "@/stores/language-store";
import { useContent } from "@/lib/content/use-content";
import { rowsToExperience } from "@/lib/content/portfolio";
import { ContentBody, ContentBodyInterface, ContentTitle } from "@/screens";

export const ExperienceContent = () => {
  useLocaleRefresh();
  const locale = useLanguageStore((s) => s.language);
  const EXPERIENCE = rowsToExperience(useContent("experience"), locale);

  return (
    <section className="basis-1/2 space-y-2">
      <ContentTitle title={translate("about.experience.title")} />
      <div className="flex flex-col gap-4">
        {EXPERIENCE.map((exp: ContentBodyInterface, key: React.Key) => {
          return <ContentBody key={key} {...exp} />;
        })}
      </div>
    </section>
  );
};
