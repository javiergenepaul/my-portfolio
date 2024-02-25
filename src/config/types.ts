import { SelectedNavLink } from "@/stores/nav-link-store";

export interface NavLinkInterface {
  key: SelectedNavLink;
  name: string;
  path: string;
  selectedId: SelectedNavLink;
}

export interface SocialMediaLinksInterface {
  key: string;
  icon: string;
  title: string;
  url: string;
}

interface TechStackInterface {
  name: string;
  icon: string;
}

export interface ServiceOfferInterface {
  key: string;
  title: string;
  description: string;
  subDetails?: string[];
  stack?: TechStackInterface[];
}
