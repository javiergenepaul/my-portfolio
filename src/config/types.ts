export interface TechStackInterface {
  name: string;
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
  image64: string;
  imageName: string;
  company: string | undefined;
  category: string[];
  previewUrl?: string | undefined;
  codeUrl?: string | undefined;
  type: ProjectType;
  stack?: TechStackInterface[];
}

export type ProjectType = "confidential" | "client" | "personal" | "tutorial";
