import { translate } from "@/i18n";
import {
  NavLinkInterface,
  ServiceOfferInterface,
  SocialMediaLinksInterface,
} from "./types";
import * as url from "./url";

export const NAV_LINKS: NavLinkInterface[] = [
  {
    key: "services",
    name: translate("header.navLinks.services"),
    path: "#services",
    selectedId: "services",
  },
  {
    key: "projects",
    name: translate("header.navLinks.projects"),
    path: "#projects",
    selectedId: "projects",
  },
  {
    key: "contacts",
    name: translate("header.navLinks.contacts"),
    path: "#contacts",
    selectedId: "contacts",
  },
];

export const SOCIAL_MEDIA_LINKS: SocialMediaLinksInterface[] = [
  {
    key: "github",
    icon: "fa6-brands:square-github",
    title: translate("header.socialMediaLinks.github"),
    url: url.GITHUB_URL,
  },
  {
    key: "linkedIn",
    icon: "fa6-brands:linkedin",
    title: translate("header.socialMediaLinks.linkedIn"),
    url: url.LINKED_IN_URL,
  },
  {
    key: "upwork",
    icon: "fa6-brands:upwork",
    title: translate("header.socialMediaLinks.upwork"),
    url: url.UPWORK_URL,
  },
];

export const SERVICE_OFFER: ServiceOfferInterface[] = [
  {
    key: "fullStack",
    title: translate("services.fullStack.title"),
    description: translate("services.fullStack.description"),
  },
  {
    key: "webApp",
    title: translate("services.webApp.title"),
    description: translate("services.webApp.description"),
  },
  {
    key: "designImplementation",
    title: translate("services.designImplementation.title"),
    description: translate("services.designImplementation.description"),
  },
];

export const TYPE_ROLES: string[] = [
  translate("header.typeRole.fullStack"),
  translate("header.typeRole.reactTypescript"),
  translate("header.typeRole.springBoot"),
  translate("header.typeRole.uiuxAdvocate"),
  translate("header.typeRole.uiLibraryEnthusiasts"),
];
