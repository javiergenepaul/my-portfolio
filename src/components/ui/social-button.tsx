import { SocialMediaLinksInterface } from "@/config";
import { Icon } from "@iconify/react";
import { BounceText } from "../animation";

export const SocialButton = (props: SocialMediaLinksInterface) => {
  const { icon, title, url } = props;
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="flex flex-row items-center gap-2 text-white transition duration-150"
    >
      <Icon icon={icon as any} width="32" height="32" />
      <span>
        <BounceText text={title} />
      </span>
    </a>
  );
};
