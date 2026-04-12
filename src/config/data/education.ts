import moment from "moment";
import { translate } from "@/i18n";
import type { ContentBodyInterface } from "@/config/types";
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
} from "@/config/constants";

/**
 * Education history — shared across all year portfolios.
 * Factory function so translate() runs at render time.
 */
export const getEducation = (): ContentBodyInterface[] => [
  {
    title: translate("about.experience.education.tertiary.title"),
    startYear: moment("2016"),
    endYear: moment("2021"),
    description: translate("about.experience.education.tertiary.description"),
    level: "tertiary",
    abbreviation: translate("about.experience.education.tertiary.abb"),
    subtitle: translate("about.experience.education.tertiary.subtitle"),
    watermark: UcWatermark,
    watermarkAlt: translate("about.experience.education.tertiary.alt"),
    subtitleUrl: UC_SCHOOL_URL,
  },
  {
    level: "vocational",
    title: translate("about.experience.education.vocational.title"),
    description: translate("about.experience.education.vocational.description"),
    abbreviation: translate("about.experience.education.vocational.abb"),
    subtitle: translate("about.experience.education.vocational.subtitle"),
    startYear: moment("2015"),
    endYear: moment("2016"),
    watermark: CTUWatermark,
    watermarkAlt: translate("about.experience.education.vocational.alt"),
    subtitleUrl: CTU_SCHOOL_URL,
  },
  {
    level: "secondary",
    title: translate("about.experience.education.secondary.title"),
    description: translate("about.experience.education.secondary.description"),
    subtitle: translate("about.experience.education.secondary.subtitle"),
    abbreviation: translate("about.experience.education.secondary.abb"),
    startYear: moment("2011"),
    endYear: moment("2015"),
    watermark: BNHSWatermark,
    watermarkAlt: translate("about.experience.education.secondary.alt"),
    subtitleUrl: BNHS_SCHOOL_URL,
  },
  {
    level: "primary",
    title: translate("about.experience.education.primary.title"),
    description: translate("about.experience.education.primary.description"),
    subtitle: translate("about.experience.education.primary.subtitle"),
    abbreviation: translate("about.experience.education.primary.abb"),
    startYear: moment("2011"),
    endYear: moment("2015"),
    watermark: PilotWatermark,
    watermarkAlt: translate("about.experience.education.primary.alt"),
    subtitleUrl: ICEPS_SCHOOL_URL,
  },
];
