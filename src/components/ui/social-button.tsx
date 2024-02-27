import { SocialMediaLinksInterface } from "@/config";
import { Icon } from "@iconify/react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from ".";

export const SocialButton = (props: SocialMediaLinksInterface) => {
  const { icon, title, url } = props;
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          aria-label={title}
          className="flex flex-row items-center gap-2 transition duration-150"
        >
          <Icon icon={icon as any} width="32" height="32" />
        </a>
      </HoverCardTrigger>
      <HoverCardContent side="top" className="flex justify-center px-8 py-2.5 w-fit">{title}</HoverCardContent>
    </HoverCard>
  );
};
