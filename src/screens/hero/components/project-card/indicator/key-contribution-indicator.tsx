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
            width="1rem"
            height="1rem"
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
