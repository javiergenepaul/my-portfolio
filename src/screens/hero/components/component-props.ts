import { ServiceOfferInterface, TechStackInterface } from "@/config";
import { SelectedNavLink } from "@/stores";

export interface ServiceCardInterface extends ServiceOfferInterface {}

export interface HighlightTextInterface {
  url: string;
  text: string;
}

export interface NavLinkInterface {
  name: string;
  path: string;
  selectedId: SelectedNavLink;
}

export interface SocialMediaLinksInterface {
  key: string;
  icon: React.ReactNode;
  title: string;
  url: string;
}

export interface StackDetailsProps extends TechStackInterface {}
