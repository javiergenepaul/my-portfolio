import {
  Badge,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components";
import { TechStackInterface } from "@/config";
import { StackDetails } from ".";

export const StackContent = (stack: TechStackInterface) => {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <Badge>
          {stack.url ? (
            <a href={stack.url} target="_blank" rel="noreferrer">
              {stack.name}
            </a>
          ) : (
            stack.name
          )}
        </Badge>
      </HoverCardTrigger>
      <HoverCardContent side="top">
        <StackDetails {...stack} />
      </HoverCardContent>
    </HoverCard>
  );
};
