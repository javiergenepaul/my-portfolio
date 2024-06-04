import { Separator } from "@/components";
import { PATH, SOCIAL_MEDIA_LINKS } from "@/config";
import { translate } from "@/i18n";
import { SocialButton } from "@/screens/hero";

export const FooterSection = () => {
  const FOOTER_NAV_LINKS = [
    {
      label: "Home",
      url: PATH.HOME.path,
    },
    {
      label: "Project",
      url: PATH.PROJECTS.path,
    },
    {
      label: "Contact",
      url: PATH.CONTACTS.path,
    },
    {
      label: "Settings",
      url: PATH.SETTINGS.path,
    },
  ];

  return (
    <footer className="pt-10 flex flex-col md:flex-row gap-4 md:gap-0 justify-between">
      <div className="text-center md:text-start">
        {translate("footer.name")}
      </div>
      <div className="flex gap-4 justify-center">
        {SOCIAL_MEDIA_LINKS.map((socialMedia, key: React.Key) => {
          return (
            <SocialButton
              key={key as string}
              title={socialMedia.title}
              url={socialMedia.url}
              icon={socialMedia.icon}
            />
          );
        })}
      </div>
      <ul className="flex gap-2 justify-center">
        {FOOTER_NAV_LINKS.map((data, index) => {
          return (
            <li className="flex gap-2">
              <a href={data.url} className="hover:text-primary cursor-pointer">
                {data.label}
              </a>
              <Separator
                hidden={index === FOOTER_NAV_LINKS.length - 1}
                orientation="vertical"
              />
            </li>
          );
        })}
      </ul>
    </footer>
  );
};
