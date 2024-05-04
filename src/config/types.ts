import { StackName } from "@/screens";
import { Moment } from "moment";

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
  keyContribution?: string[];
  carousel: ProjectCarouselInterface[];
  company: string | undefined;
  category: string[];
  previewUrl?: string | undefined;
  codeUrl?: string | undefined;
  type: ProjectType;
  stack?: TechStackInterface[];
  projectId: string;
  status: ProjectStatus;
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
