import { ReactNode } from "react";

export interface BounceTextInterface {
  text: string;
  path?: string;
  openInNewTab?: boolean;
  cursor?: "none";
  className?: string;
}

export interface FadeAnimationProps {
  children: ReactNode;
}

export interface RubberAnimationInterface {
  // isUnderline?: boolean;
  className?: string;
  children: ReactNode;
}
