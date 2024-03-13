import { StackName } from "@/screens";

export interface TechStackInterface {
  name: StackName;
  icon?: string;
  url: string | undefined;
  isFavorite: boolean;
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
