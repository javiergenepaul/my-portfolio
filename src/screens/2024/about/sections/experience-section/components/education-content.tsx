import { getEducation } from "@/config/data";
import { translate } from "@/i18n";
import { ContentBody, ContentBodyInterface, ContentTitle } from "@/screens";
import React from "react";

export const EducationContent = () => {
  const EDUCATION: ContentBodyInterface[] = getEducation();

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
