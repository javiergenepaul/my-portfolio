import { translate } from "@/i18n";
import * as url from "./url";
import { SocialMediaLinksInterface } from "@/screens";

export const SOCIAL_MEDIA_LINKS: SocialMediaLinksInterface[] = [
  {
    key: "github",
    icon: "github",
    title: translate("header.socialMediaLinks.github"),
    url: url.GITHUB_URL,
  },
  {
    key: "linkedIn",
    icon: "linkedin",
    title: translate("header.socialMediaLinks.linkedIn"),
    url: url.LINKED_IN_URL,
  },
  {
    key: "upwork",
    icon: "upwork",
    title: translate("header.socialMediaLinks.upwork"),
    url: url.UPWORK_URL,
  },
];

export const SILVER_COLOR: string = "#FAFAFA";
export const SILVER_COLOR_DARK: string = "#18181B";
export const SCARLET_COLOR: string = "#E11D48";
export const LAVENDER_COLOR: string = "#6D28D9";
export const SUNSET_COLOR: string = "#EA580C";
export const GOLDEN_COLOR: string = "#FACC15";
export const AZURE_COLOR: string = "#3B82F6";
export const EMERALD_COLOR: string = "#22C55E";
