import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components";
import { Icon } from "@iconify/react/dist/iconify.js";

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
          <Icon
            className="cursor-default"
            icon="ooui:user-contributions-ltr"
            width="1.2rem"
            height="1.2rem"
          />
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
