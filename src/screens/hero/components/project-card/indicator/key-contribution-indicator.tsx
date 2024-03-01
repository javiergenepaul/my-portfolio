import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components";
import { IndicatorContainer } from "./indicator-container";
import { Layers } from "lucide-react";

interface KeyContributionIndicatorInterface {
  contributions: string[];
}

export const KeyContributionIndicator = (
  props: KeyContributionIndicatorInterface
) => {
  const { contributions } = props;
  return (
    contributions && (
      <HoverCard>
        <HoverCardTrigger>
          <IndicatorContainer>
            <Layers className="group-hover:text-primary" />
            <p className="group-hover:text-primary">{"Contributions"}</p>
          </IndicatorContainer>
        </HoverCardTrigger>
        <HoverCardContent side="right">
          {contributions.map((contribute: string) => {
            return contribute;
          })}
        </HoverCardContent>
      </HoverCard>
    )
  );
};
