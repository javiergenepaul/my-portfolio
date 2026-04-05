import moment from "moment";
import { translate } from "@/i18n";
import type { ContentBodyInterface } from "@/config/types";
import {
  AllianceWatermark,
  ExodiaWatermark,
  KryterionWatermark,
  Mach95Watermark,
} from "@/assets";
import {
  ALLIANCE_COMPANY_URL,
  EXODIA_COMPANY_URL,
  KRYTERION_COMPANY_URL,
  MACH95_COMPANY_URL,
} from "@/config/constants";

/**
 * Work experience entries — shared across all year portfolios.
 * Factory function so translate() runs at render time.
 */
export const getExperience = (): ContentBodyInterface[] => [
  {
    title: translate("about.experience.experience.kryterion.title"),
    description: translate("about.experience.experience.kryterion.description"),
    subtitle: translate("about.experience.experience.kryterion.subtitle"),
    startYear: moment("2024-09-09"),
    endYear: "present",
    watermark: KryterionWatermark,
    watermarkAlt: translate("about.experience.experience.kryterion.alt"),
    subtitleUrl: KRYTERION_COMPANY_URL,
    waterMarkWidth: 105,
    isWork: true,
  },
  {
    title: translate("about.experience.experience.alliance.title"),
    startYear: moment("2022-12-01"),
    endYear: moment("2024-09-05"),
    description: translate("about.experience.experience.alliance.description"),
    watermark: AllianceWatermark,
    watermarkAlt: translate("about.experience.experience.alliance.promotion.ats1.alt"),
    subtitleUrl: ALLIANCE_COMPANY_URL,
    isWork: true,
    subtitle: translate("about.experience.experience.alliance.subtitle"),
    promotion: [
      {
        title: translate("about.experience.experience.alliance.promotion.ats1.title"),
        description: translate("about.experience.experience.alliance.promotion.ats1.description"),
        subtitle: translate("about.experience.experience.alliance.promotion.ats1.subtitle"),
        abbreviation: translate("about.experience.experience.alliance.promotion.ats1.abb"),
        startYear: moment("2024-01-01"),
        endYear: moment("2024-09-05"),
      },
      {
        title: translate("about.experience.experience.alliance.promotion.ts1.title"),
        description: translate("about.experience.experience.alliance.promotion.ts1.description"),
        subtitle: translate("about.experience.experience.alliance.promotion.ts1.subtitle"),
        abbreviation: translate("about.experience.experience.alliance.promotion.ts1.abb"),
        startYear: moment("2022-12-01"),
        endYear: moment("2024-01-01"),
      },
    ],
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
