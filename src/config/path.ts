/**
 * Centralised route paths for the 2024 portfolio.
 * All paths are relative to the year root, e.g. /2024/about.
 *
 * Migration note: names are now plain strings (not translated) because
 * this module runs at import time (before i18n is initialised). Components
 * that need translated names call translate() themselves.
 */
export const PATH = {
  HOME: {
    name: "Home",
    path: "/2024",
  },
  ABOUT: {
    name: "About",
    path: "/2024/about",
  },
  PROJECTS: {
    name: "Projects",
    path: "/2024/projects",
  },
  SKILLS: {
    name: "Skills",
    path: "/2024/skills",
  },
  CONTACTS: {
    name: "Contacts",
    path: "/2024/contacts",
  },
  SETTINGS: {
    name: "Settings",
    path: "/2024/settings",
  },
  SETTINGS_GENERAL: {
    name: "General",
    path: "/2024/settings/",
  },
  SETTINGS_APPEARNCE: {
    name: "Appearance",
    path: "/2024/settings/appearance",
  },
  CONFIDENTIAL: {
    name: "Confidential",
    path: "/2024/confidential",
  },
} as const;
