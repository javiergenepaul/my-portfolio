import { StackName } from "@/screens";
import type { Dayjs } from "dayjs";
import type { ReactNode } from "react";
import type { StaticImageData } from "next/image";

export type ProjectStatus = "ongoing" | "completed" | "unfinished";
type NumberBetweenOneAndTen = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface TechStackInterface {
  name: StackName;
  /** Localized display name resolved for the current locale (DB-driven). When
   *  absent (code constants), consumers fall back to the i18n stack label. */
  label?: string;
  icon: string;
  url: string | undefined;
  isFavorite: boolean;
  rate: NumberBetweenOneAndTen;
  // Plain ISO date strings (or the "present" sentinel). Kept as strings so
  // config/stack.ts has no date-library calls at module scope; parsed with
  // dayjs() only where an experience diff is actually computed.
  dateStarted: string;
  dateEnded: string;
  isStudying: boolean;
  alt: string;
}

export interface ServiceOfferInterface {
  title: string;
  description: string;
  subDetails?: string[];
  stack?: TechStackInterface[];
}

export interface ProjectInterface {
  title: string;
  description: string;
  date: Date;
  keyContribution?: KeyContributionInterface[];
  carousel: ProjectCarouselInterface[];
  company: string | undefined;
  category: string[];
  previewUrl?: string | undefined;
  codeUrl?: string | undefined;
  /** Admin-uploaded page screenshot (Storage URL); shown on the card when no
   *  screenshot `carousel` is set, framed by `mockupTemplate` if one is chosen. */
  mockPhoto?: string;
  /** Mockup frame id the screenshot is dropped into (see MOCKUP_TEMPLATES). */
  mockupTemplate?: string;
  type: ProjectType;
  stack?: TechStackInterface[];
  projectId: string;
  status: ProjectStatus;
  hidden?: boolean;
}

export interface KeyContributionInterface {
  name: string;
  description: string;
}

export interface ProjectCarouselInterface {
  value: string;
  image: string | StaticImageData;
  name: string;
}

export interface SideMenuInterface {
  name: string;
  path: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

export type ProjectType = "confidential" | "client" | "personal" | "tutorial";

// ── Experience / Education ───────────────────────────────────────────────────

export interface PromotionInterface {
  title: string;
  subtitle: string;
  startYear: Dayjs;
  endYear: Dayjs | "present";
  abbreviation?: string;
  description: string;
}

export interface ContentBodyInterface {
  title: string;
  subtitle?: string;
  startYear: Dayjs;
  endYear: Dayjs | "present";
  level?: "tertiary" | "secondary" | "primary" | "vocational";
  abbreviation?: string;
  isWork?: boolean;
  employmentType?: "Full-time" | "Part-time";
  watermark?: ReactNode | StaticImageData;
  watermarkAlt?: string;
  description: string;
  subtitleUrl?: string;
  waterMarkWidth?: number;
  promotion?: PromotionInterface[];
  /** Stack name keys (DB-driven); rendered as chips via the i18n stack label. */
  stack?: string[];
}

// ── Certificates ─────────────────────────────────────────────────────────────

export interface CertificateCardInterface {
  title: string;
  organization: string;
  /** Accepts a plain URL string or a Next.js static image import (StaticImageData). */
  organizationImg:
    | string
    | { src: string; height: number; width: number; blurDataURL?: string };
  organizationAlt: string;
  issuedDate: Dayjs;
  credentialId?: string;
  credentialUrl: string | StaticImageData;
  /** Stack name keys (DB-driven); rendered as chips via the i18n stack label. */
  stack?: string[];
}

// ── Books ─────────────────────────────────────────────────────────────────────

export interface BookInterface {
  title: string;
  author: string;
  quote: string;
  reflection: string;
  theme: string;
}

// ── Testimonials ─────────────────────────────────────────────────────────────

export type TestimonialRelationship =
  | "Colleague"
  | "Client"
  | "Manager"
  | "Mentor"
  | "Peer";

export interface TestimonialInterface {
  name: string;
  role: string;
  company: string;
  avatar: string;
  text: string;
  rating: number;
  service: string;
  relationship: TestimonialRelationship;
  github?: string;
  linkedin?: string;
  behance?: string;
}

// ── Languages ────────────────────────────────────────────────────────────────

export type ProficiencyLevel = "Native" | "Fluent" | "Conversational" | "Basic";

export interface LanguageInterface {
  name: string;
  nativeName: string;
  flagIcon: string;
  locale: "en" | "ja" | "fil" | "ceb";
  level: ProficiencyLevel;
  note: string;
}

// ── Skills ───────────────────────────────────────────────────────────────────

export interface SkillCategory {
  key: string;
  label: string;
  stacks: TechStackInterface[];
}

interface TemplateParams {
  from_name: string;
  from_email: string;
  to_name: string;
  message: string;
}

export interface EmailInterface {
  service_id: string;
  template_id: string;
  user_id: string;
  template_params: TemplateParams;
}
