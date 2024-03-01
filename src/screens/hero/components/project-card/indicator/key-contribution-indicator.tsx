import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components";
import { IndicatorContainer } from "./indicator-container";
import { Layers } from "lucide-react";
import { translate } from "@/i18n";

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
            <p className="group-hover:text-primary">
              {translate("projects.indicator.contribution")}
            </p>
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
