import {
  SocialIcon,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components";
import { SocialMediaLinksInterface } from "../component-props";
import { logEvent } from "@/lib";

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
            onClick={() => {
              logEvent({
                category: "Links",
                action: "Click Social Media Link",
                label: `${title} - link`,
              });
            }}
          >
            <SocialIcon icon={icon} />
          </a>
        </TooltipTrigger>
        <TooltipContent>
          <span>{title}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
