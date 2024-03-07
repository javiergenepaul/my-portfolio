import {
  Badge,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components";
import { TechStackInterface } from "@/config";
import { StackDetails } from ".";

export const StackContent = (stack: TechStackInterface) => {
  const { name, url } = stack;

  const onClickBadgeHandler = () => {
    window.open(url, "_blank");
  };

  return (
    <HoverCard>
      <HoverCardTrigger>
        <Badge className="cursor-pointer" onClick={onClickBadgeHandler}>
          {name}
        </Badge>
      </HoverCardTrigger>
      <HoverCardContent side="top">
        <StackDetails {...stack} />
      </HoverCardContent>
    </HoverCard>
  );
};
