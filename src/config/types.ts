export interface TechStackInterface {
  name: string;
  icon?: string;
  url: string | undefined;
  isFavorite: boolean;
}

export interface ServiceOfferInterface {
  key?: string;
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
  image64: string,
  imageName: string,
  company: string | undefined;
  category: string[];
  url?: string | undefined;
  type: "confidential" | "client" | "personal" | "tutorial";
  stack?: TechStackInterface[];
}
