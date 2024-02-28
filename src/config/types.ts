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
