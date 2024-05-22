import { translate } from "@/i18n";
import { ContentBody, ContentTitle } from "@/screens";
import moment from "moment";

export const ExperienceContent = () => {
  return (
    <section className="basis-1/2 space-y-2">
      <ContentTitle title={translate("about.experience.title")} />
      <div className="flex flex-col gap-4">
        <ContentBody
          title={"Software Engineer - Associate Technical Specialist I"}
          subtitle={"Alliance Software Inc."}
          startYear={moment("2024-01-01")}
          abbreviation="ATS I"
          endYear="present"
          isWork
        />
        <ContentBody
          title={"Software Engineer - Technical Specialist I"}
          subtitle={"Alliance Software Inc."}
          startYear={moment("2022-12-01")}
          abbreviation="TS I"
          endYear={moment("2024-01-01")}
          isWork
        />
        <ContentBody
          title={"Software Developer"}
          subtitle={"Mach95 Software Development Corporation"}
          startYear={moment("2021-07-01")}
          endYear={moment("2022-12-01")}
          isWork
        />
        <ContentBody
          title={"VR/AR Developer & 3D Modeler"}
          subtitle={"Exodia Game Development"}
          abbreviation="Part Time"
          startYear={moment("2019-07-01")}
          endYear={moment("2021-07-01")}
          isWork
        />
      </div>
    </section>
  );
};
