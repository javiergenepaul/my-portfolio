import {
  Avatar,
  Tooltip,
  AvatarImage,
  TooltipTrigger,
  AvatarFallback,
  TooltipContent,
  TooltipProvider,
} from "@/components";
import { PATH } from "@/config";
import { Link } from "react-router-dom";
import { translate } from "@/i18n";
import { AvatarProfile } from "@/assets";

export const AboutMeAvatar = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Link
            to={PATH.ABOUT.path}
            className="items-center justify-center hidden gap-2 cursor-pointer select-none lg:flex"
          >
            <Avatar>
              <AvatarImage src={AvatarProfile} />
              <AvatarFallback>{translate("header.shortName")}</AvatarFallback>
            </Avatar>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <span>{translate("header.aboutMe")}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
