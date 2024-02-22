import { SocialMediaLinksInterface } from "@/config";
import { Icon } from "@iconify/react";
import { BounceText } from "../animation";

const SocialButton = (props: SocialMediaLinksInterface) => {
  const { icon, title, url } = props;
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="flex flex-row gap-2 items-center text-white transition duration-150"
    >
      <Icon icon={icon as any} width="26" height="26" />
      <span>
        <BounceText text={title} />
      </span>
      <Icon icon="fa6-solid:arrow-up-right-from-square" />
    </a>
  );
};

export default SocialButton;
