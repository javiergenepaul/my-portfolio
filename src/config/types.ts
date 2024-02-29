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
  company: string;
  category: string[];
  url?: string | undefined;
  type: "confidential" | "client" | "personal";
  stack?: TechStackInterface[];
}
