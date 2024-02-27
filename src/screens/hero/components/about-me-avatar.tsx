import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  HoverCardContent,
} from "@/components";
import { PATH } from "@/config";
import { Link } from "react-router-dom";
import ProfileAvater from "../../../assets/avatar-profile.jpg";
import { translate } from "@/i18n";
import { HoverCard, HoverCardTrigger } from "@radix-ui/react-hover-card";

export const AboutMeAvatar = () => {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <Link
          to={PATH.ABOUT.path}
          className="flex items-center justify-center gap-2 cursor-pointer"
        >
          <Avatar>
            <AvatarImage src={ProfileAvater} />
            <AvatarFallback>{translate("header.shortName")}</AvatarFallback>
          </Avatar>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent
        side="top"
        className="flex justify-center w-fit py-2.5 px-8"
      >
        {translate("header.aboutMe")}
      </HoverCardContent>
    </HoverCard>
  );
};
