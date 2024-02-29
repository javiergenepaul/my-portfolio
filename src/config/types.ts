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
  company:
    | "Alliance Software Inc."
    | "Triad Software Digital Solutions"
    | "personal"
    | "Mach95 Software Developer Corp."
    | undefined;
  category: string[];
  url?: string | undefined;
  type: "confidential" | "client" | "personal" | "tutorial";
  stack?: TechStackInterface[];
}
