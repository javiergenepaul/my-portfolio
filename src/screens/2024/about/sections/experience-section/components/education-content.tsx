"use client";

import React from "react";
import { translate, useLocaleRefresh } from "@/i18n";
import { useLanguageStore } from "@/stores/language-store";
import { useContent } from "@/lib/content/use-content";
import { rowsToContentBody } from "@/lib/content/portfolio";
import { ContentBody, ContentBodyInterface, ContentTitle } from "@/screens";

export const EducationContent = () => {
  useLocaleRefresh();
  const locale = useLanguageStore((s) => s.language);
  const EDUCATION = rowsToContentBody(useContent("education"), locale);

  return (
    <section className="basis-1/2 space-y-2">
      <ContentTitle title={translate("about.education.title")} />
      <div className="flex flex-col gap-4">
        {EDUCATION.map((edu: ContentBodyInterface, key: React.Key) => {
          return <ContentBody key={key} {...edu} />;
        })}
      </div>
    </section>
  );
};
