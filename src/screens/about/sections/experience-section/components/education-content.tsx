import {
  BNHSWatermark,
  CTUWatermark,
  PilotWatermark,
  UcWatermark,
} from "@/assets";
import { translate } from "@/i18n";
import { ContentBody, ContentTitle } from "@/screens";
import moment from "moment";

export const EducationSection = () => {
  return (
    <section className="basis-1/2 space-y-2">
      <ContentTitle title={translate("about.education.title")} />

      <div className="flex flex-col gap-4">
        <ContentBody
          level="tertiary"
          title={"University of Cebu - Main Campus"}
          abbreviation="BSCPE"
          subtitle={"Bachelor of Science of Computer Engineering"}
          startYear={moment("2016")}
          endYear={moment("2021")}
          watermark={UcWatermark}
          watermarkAlt="University of Cebu Main Logo"
        />
        <ContentBody
          level="vocational"
          title={"Cebu Technological University"}
          abbreviation="OLTEC"
          subtitle={"Opportunity Livelihood Technology Entrepreneurial Classes"}
          startYear={moment("2015")}
          endYear={moment("2016")}
          watermark={CTUWatermark}
          watermarkAlt="Cebu Technological University"
        />
        <ContentBody
          level="secondary"
          title={"Basilan National High School"}
          subtitle="High School"
          abbreviation="BNHS"
          startYear={moment("2011")}
          endYear={moment("2015")}
          watermark={BNHSWatermark}
          watermarkAlt="Basilan National High School Logo"
        />
        <ContentBody
          level="primary"
          title={"Isabela Central Elementary Pilot School"}
          subtitle="Elementary School"
          abbreviation="ICEPS"
          startYear={moment("2011")}
          watermark={PilotWatermark}
          endYear={moment("2015")}
        />
      </div>
    </section>
  );
};
