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
