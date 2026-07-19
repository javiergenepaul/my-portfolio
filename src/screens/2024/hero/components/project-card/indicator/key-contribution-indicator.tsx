import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  ScrollArea,
} from "@/components";
import { IndicatorContainer } from "./indicator-container";
import { CheckCircle, Layers } from "lucide-react";
import { translate } from "@/i18n";
import { KeyContributionInterface } from "@/config";

interface KeyContributionIndicatorInterface {
  contributions?: KeyContributionInterface[];
}

export const KeyContributionIndicator = (
  props: KeyContributionIndicatorInterface,
) => {
  const { contributions } = props;
  return (
    contributions && (
      <div className="hidden lg:block">
        <HoverCard>
          <HoverCardTrigger asChild>
            <button
              type="button"
              className="bg-transparent border-0 p-0 text-left"
            >
              <IndicatorContainer>
                <Layers className="group-hover:text-primary" />
                <p className="hidden md:block group-hover:text-primary">
                  {translate("projects.indicator.contribution")}
                </p>
              </IndicatorContainer>
            </button>
          </HoverCardTrigger>
          <HoverCardContent
            className="w-150 overflow-hidden p-0"
            side="right"
          >
            <h3 className="px-4 pt-4 pb-2 text-xl font-bold">
              {translate("projects.keyContributions")}
            </h3>
            <ScrollArea className="max-h-100 *:data-radix-scroll-area-viewport:max-h-100">
              <div className="flex flex-col gap-2 px-4 pb-4">
                {contributions.map(
                  (contribute: KeyContributionInterface, idx: number) => {
                    return (
                      <div
                        key={contribute.name || idx}
                        className="flex gap-2 text-sm text-accent-foreground items-start"
                      >
                        <CheckCircle className="shrink-0" />
                        <div>
                          <strong className="font-bold text-nowrap">
                            {contribute.name}:
                          </strong>
                          <p className="text-muted-foreground">
                            {contribute.description}
                          </p>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </ScrollArea>
          </HoverCardContent>
        </HoverCard>
      </div>
    )
  );
};
