import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components";
import { IndicatorContainer } from "./indicator-container";
import { CheckCircle, Layers } from "lucide-react";
import { translate } from "@/i18n";
import { KeyContributionInterface } from "@/config";

interface KeyContributionIndicatorInterface {
  contributions?: KeyContributionInterface[];
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
            <p className="hidden md:block group-hover:text-primary">
              {translate("projects.indicator.contribution")}
            </p>
          </IndicatorContainer>
        </HoverCardTrigger>
        <HoverCardContent className="w-[600px]" side="right">
          <h3 className="text-xl font-bold">
            {translate("projects.keyContributions")}
          </h3>
          {contributions.map((contribute: KeyContributionInterface) => {
            return (
              <p className="flex gap-2 text-sm text-accent-foreground items-start">
                <CheckCircle />
                <div className="">
                  <strong className="font-bold text-nowrap">
                    {contribute.name}
                  </strong>
                  : {contribute.description}
                </div>
              </p>
            );
          })}
        </HoverCardContent>
      </HoverCard>
    )
  );
};
