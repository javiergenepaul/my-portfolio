import { NavLinkInterface, SocialMediaLinksInterface } from "./types";

export const NAV_LINKS: NavLinkInterface[] = [
  {
    key: "SERVICES",
    name: "services",
    path: "#services",
  },
  {
    key: "PROJECTS",
    name: "projects",
    path: "#projects",
  },
  {
    key: "CONTACTS",
    name: "contacts",
    path: "#contacts",
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
    key: "linkIn",
    icon: "mdi:linkedin",
    title: "LinkIn",
    url: "https://www.linkedin.com/in/gene-paul-mar-javier-500b93245",
  },
  {
    key: "facebook",
    icon: "ic:baseline-facebook",
    title: "Facebook",
    url: "https://www.facebook.com/gennette29",
  },
] 

export const TYPE_ROLES: string[] = [
  "Full-Stack Developer",
  "React TypeScript Developer",
  "Spring Boot Developer",
  "UI/UX Advocate",
  "UI Library Enthusiasts"
]