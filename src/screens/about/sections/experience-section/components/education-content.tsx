import {
  BNHSWatermark,
  CTUWatermark,
  PilotWatermark,
  UcWatermark,
} from "@/assets";
import {
  BNHS_SCHOOL_URL,
  CTU_SCHOOL_URL,
  ICEPS_SCHOOL_URL,
  UC_SCHOOL_URL,
} from "@/config";
import { translate } from "@/i18n";
import { ContentBody, ContentTitle } from "@/screens";
import moment from "moment";

export const EducationContent = () => {
  return (
    <section className="basis-1/2 space-y-2">
      <ContentTitle title={translate("about.education.title")} />

      <div className="flex flex-col gap-4">
        {/* UC */}
        <ContentBody
          level="tertiary"
          title={translate("about.experience.education.tertiary.title")}
          description={translate(
            "about.experience.education.tertiary.description"
          )}
          abbreviation={translate("about.experience.education.tertiary.abb")}
          subtitle={translate("about.experience.education.tertiary.subtitle")}
          startYear={moment("2016")}
          endYear={moment("2021")}
          watermark={UcWatermark}
          watermarkAlt={translate("about.experience.education.tertiary.alt")}
          subtitleUrl={UC_SCHOOL_URL}
        />
        {/* CTU */}
        <ContentBody
          level="vocational"
          title={translate("about.experience.education.vocational.title")}
          description={translate(
            "about.experience.education.vocational.description"
          )}
          abbreviation={translate("about.experience.education.vocational.abb")}
          subtitle={translate("about.experience.education.vocational.subtitle")}
          startYear={moment("2015")}
          endYear={moment("2016")}
          watermark={CTUWatermark}
          watermarkAlt={translate("about.experience.education.vocational.alt")}
          subtitleUrl={CTU_SCHOOL_URL}
        />
        {/* BNHS */}
        <ContentBody
          level="secondary"
          title={translate("about.experience.education.secondary.title")}
          description={translate(
            "about.experience.education.secondary.description"
          )}
          subtitle={translate("about.experience.education.secondary.subtitle")}
          abbreviation={translate("about.experience.education.secondary.abb")}
          startYear={moment("2011")}
          endYear={moment("2015")}
          watermark={BNHSWatermark}
          watermarkAlt={translate("about.experience.education.secondary.alt")}
          subtitleUrl={BNHS_SCHOOL_URL}
        />
        {/* ICEPS */}
        <ContentBody
          level="primary"
          title={translate("about.experience.education.primary.title")}
          description={translate(
            "about.experience.education.primary.description"
          )}
          subtitle={translate("about.experience.education.primary.subtitle")}
          abbreviation={translate("about.experience.education.primary.abb")}
          startYear={moment("2011")}
          watermark={PilotWatermark}
          endYear={moment("2015")}
          watermarkAlt={translate("about.experience.education.primary.alt")}
          subtitleUrl={ICEPS_SCHOOL_URL}
        />
      </div>
    </section>
  );
};
