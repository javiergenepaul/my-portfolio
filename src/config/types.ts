import { StackName } from "@/screens";
import { Moment } from "moment";
import type { ReactNode } from "react";

export type ProjectStatus = "ongoing" | "completed" | "unfinished";
type NumberBetweenOneAndTen = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface TechStackInterface {
  name: StackName;
  icon: string;
  url: string | undefined;
  isFavorite: boolean;
  rate: NumberBetweenOneAndTen;
  dateStarted: Moment;
  dateEnded: Moment | "present";
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
  image: string;
  name: string;
}

export interface ProjectCarouselInterface {
  value: string;
  image: string;
  name: string;
}

export interface SideMenuInterface {
  name: string;
  path: string;
  icon: React.ReactNode;
  href?: string;
}

export type ProjectType = "confidential" | "client" | "personal" | "tutorial";

// ── Experience / Education ───────────────────────────────────────────────────

export interface PromotionInterface {
  title: string;
  subtitle: string;
  startYear: Moment;
  endYear: Moment | "present";
  abbreviation?: string;
  description: string;
}

export interface ContentBodyInterface {
  title: string;
  subtitle?: string;
  startYear: Moment;
  endYear: Moment | "present";
  level?: "tertiary" | "secondary" | "primary" | "vocational";
  abbreviation?: string;
  isWork?: boolean;
  watermark?: ReactNode;
  watermarkAlt?: string;
  description: string;
  subtitleUrl?: string;
  waterMarkWidth?: number;
  promotion?: PromotionInterface[];
}

// ── Certificates ─────────────────────────────────────────────────────────────

export interface CertificateCardInterface {
  title: string;
  organization: string;
  /** Accepts a plain URL string or a Next.js static image import (StaticImageData). */
  organizationImg: string | { src: string; height: number; width: number; blurDataURL?: string };
  organizationAlt: string;
  issuedDate: Moment;
  credentialId?: string;
  credentialUrl: string;
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
