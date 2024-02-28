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
import ProfileAvater from "../../../assets/avatar-profile.jpg";
import { translate } from "@/i18n";

export const AboutMeAvatar = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Link
            to={PATH.ABOUT.path}
            className="flex items-center justify-center gap-2 cursor-pointer select-none"
          >
            <Avatar>
              <AvatarImage src={ProfileAvater} />
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
