import type { ProfileInterface, SocialLinkInterface } from "@/config/types";

/**
 * Last-resort defaults for the site owner's identity.
 *
 * These are NOT the source of truth — the `profile` and `socials` CMS types
 * are. Read them through `useProfile()` / `useSocials()` in
 * `@/lib/content/use-content`, never by importing from here.
 *
 * They exist only because the content store is fetched client-side and the
 * splash is removed on a timer rather than gating on the fetch, so there is a
 * brief window on first paint with no data. Without a fallback the hero would
 * render a nameless heading and the résumé would export blank contact details.
 * A field left empty in the CMS falls back here too.
 */
export const PROFILE_FALLBACK: ProfileInterface = {
  fullName: "Gene Paul Mar Javier",
  jobTitle: "Full-Stack Software Engineer",
  bio: "",
  location: "Cebu, Philippines",
  email: "javiergenepaul@gmail.com",
  phone: "09762912231",
  careerStartDate: "2018-08-01",
  avatar: "",
};

export const SOCIALS_FALLBACK: SocialLinkInterface[] = [
  {
    key: "github",
    icon: "github",
    url: "https://github.com/javiergenepaul",
  },
  {
    key: "linkedIn",
    icon: "linkedin",
    url: "https://www.linkedin.com/in/gene-paul-mar-javier-500b93245/",
  },
  {
    key: "upwork",
    icon: "upwork",
    url: "https://www.upwork.com/freelancers/~0146c967e12a6bff87",
  },
];

/**
 * Server-only. Route metadata is generated on the server, where the
 * client-side content store isn't available, so it still reads these.
 * Client components must use `useProfile()` instead.
 */
export const FULL_NAME = PROFILE_FALLBACK.fullName;
export const JOB_TITLE = PROFILE_FALLBACK.jobTitle;
export const MOBILE_NUMBER = PROFILE_FALLBACK.phone;
export const EMAIL_ADDRESS = PROFILE_FALLBACK.email;
export const CAREER_START_DATE = PROFILE_FALLBACK.careerStartDate;
