import { NavLinkInterface, SocialMediaLinksInterface } from "./types";

export const NAV_LINKS: NavLinkInterface[] = [
  {
    key: "services",
    name: "services",
    path: "#services",
    selectedId: "services"
  },
  {
    key: "projects",
    name: "projects",
    path: "#projects",
    selectedId: "projects"
  },
  {
    key: "contacts",
    name: "contacts",
    path: "#contacts",
    selectedId: "contacts"
  },
];

export const SOCIAL_MEDIA_LINKS: SocialMediaLinksInterface[] = [
  {
    key: "github",
    icon: "mdi:github",
    title: "Github",
    url: "https://github.com/javiergenepaul",
  },
  {
    key: "linkedIn",
    icon: "entypo-social:linkedin-with-circle",
    title: "LinkedIn",
    url: "https://www.linkedin.com/in/gene-paul-mar-javier-500b93245",
  },
];

export const TYPE_ROLES: string[] = [
  "Full-Stack Developer",
  "React TypeScript Developer",
  "Spring Boot Developer",
  "UI/UX Advocate",
  "UI Library Enthusiasts",
];
