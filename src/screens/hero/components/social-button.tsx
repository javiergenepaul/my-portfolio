import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components";
import { SocialMediaLinksInterface } from "@/config";
import { Icon } from "@iconify/react";

export const SocialButton = (props: SocialMediaLinksInterface) => {
  const { icon, title, url } = props;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            aria-label={title}
            className="flex flex-row items-center gap-2 transition duration-150"
          >
            <Icon icon={icon as any} width="32" height="32" />
          </a>
        </TooltipTrigger>
        <TooltipContent>
          <span>{title}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
