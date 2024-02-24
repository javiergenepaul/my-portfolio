import { Avatar, AvatarFallback, AvatarImage } from "@/components";
import { PATH } from "@/config";
import { Link } from "react-router-dom";
import ProfileAvater from "../../../assets/avatar-profile.jpg";
import { translate } from "@/i18n";

export const AboutMeAvatar = () => {
  return (
    <Link
      to={PATH.ABOUT.path}
      className="flex items-center justify-center gap-2 cursor-pointer"
    >
      <Avatar>
        <AvatarImage src={ProfileAvater} />
        <AvatarFallback>{translate("header.shortName")}</AvatarFallback>
      </Avatar>
    </Link>
  );
};
