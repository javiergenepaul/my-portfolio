import { AllianceWatermark, ExodiaWatermark, Mach95Watermark } from "@/assets";
import {
  ALLIANCE_COMPANY_URL,
  EXODIA_COMPANY_URL,
  MACH95_COMPANY_URL,
} from "@/config";
import { translate } from "@/i18n";
import { ContentBody, ContentBodyInterface, ContentTitle } from "@/screens";
import moment from "moment";

export const ExperienceContent = () => {
  const EXPERIENCE: ContentBodyInterface[] = [
    {
      title: translate("about.experience.experience.alliance.ats1.title"),
      description: translate(
        "about.experience.experience.alliance.ats1.description"
      ),
      subtitle: translate("about.experience.experience.alliance.ats1.subtitle"),
      startYear: moment("2024-01-01"),
      abbreviation: translate("about.experience.experience.alliance.ats1.abb"),
      endYear: "present",
      watermark: AllianceWatermark,
      watermarkAlt: translate("about.experience.experience.alliance.ats1.alt"),
      subtitleUrl: ALLIANCE_COMPANY_URL,
      isWork: true,
    },
    {
      title: translate("about.experience.experience.alliance.ts1.title"),
      description: translate(
        "about.experience.experience.alliance.ts1.description"
      ),
      subtitle: translate("about.experience.experience.alliance.ts1.subtitle"),
      startYear: moment("2022-12-01"),
      abbreviation: translate("about.experience.experience.alliance.ts1.abb"),
      endYear: moment("2024-01-01"),
      watermark: AllianceWatermark,
      watermarkAlt: translate("about.experience.experience.alliance.ts1.alt"),
      subtitleUrl: ALLIANCE_COMPANY_URL,
      isWork: true,
    },
    {
      title: translate("about.experience.experience.mach95.title"),
      description: translate("about.experience.experience.mach95.description"),
      subtitle: translate("about.experience.experience.mach95.subtitle"),
      startYear: moment("2021-07-01"),
      endYear: moment("2022-12-01"),
      watermark: Mach95Watermark,
      watermarkAlt: translate("about.experience.experience.mach95.alt"),
      subtitleUrl: MACH95_COMPANY_URL,
      isWork: true,
    },
    {
      title: translate("about.experience.experience.exodia.title"),
      description: translate("about.experience.experience.exodia.description"),
      subtitle: translate("about.experience.experience.exodia.subtitle"),
      abbreviation: translate("about.experience.experience.exodia.abb"),
      startYear: moment("2019-07-01"),
      endYear: moment("2021-07-01"),
      watermark: ExodiaWatermark,
      watermarkAlt: translate("about.experience.experience.exodia.alt"),
      subtitleUrl: EXODIA_COMPANY_URL,
      isWork: true,
    },
  ];

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
