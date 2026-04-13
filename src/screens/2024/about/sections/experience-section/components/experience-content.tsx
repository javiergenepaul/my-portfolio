import { getExperience } from "@/config/data";
import { translate } from "@/i18n";
import { ContentBody, ContentBodyInterface, ContentTitle } from "@/screens";
import React from "react";

export const ExperienceContent = () => {
  const EXPERIENCE: ContentBodyInterface[] = getExperience();

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
