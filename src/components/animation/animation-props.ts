import { ReactNode } from "react";

export interface BounceTextInterface {
  text: string;
  path?: string;
  openInNewTab?: boolean;
  isUnderline?: boolean;
  cursor?: "none";
}

export interface FadeAnimationProps {
  children: ReactNode;
}

export interface RubberAnimationInterface {
  isUnderline?: boolean;
  children: ReactNode;
}
