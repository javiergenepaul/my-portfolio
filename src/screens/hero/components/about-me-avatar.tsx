import { Avatar, AvatarFallback, AvatarImage, BounceText } from "@/components";
import { PATH } from "@/config";
import { Link } from "react-router-dom";

export const AboutMeAvatar = () => {
  return (
    <Link
      to={PATH.ABOUT.path}
      className="flex gap-2 justify-center items-center cursor-pointer"
    >
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>PJ</AvatarFallback>
      </Avatar>
      <span className="text-white">
        <BounceText text="Me"/>
      </span>
    </Link>
  );
};
