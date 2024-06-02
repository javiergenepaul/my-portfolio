import { PATH, SOCIAL_MEDIA_LINKS } from "@/config";
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
    <footer className="pt-10 flex justify-between">
      <div className="">@2024 - Gene Paul Mar Javier</div>
      <div className="flex gap-4">
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
      <div className="">
        <ul className="flex gap-4">
          {FOOTER_NAV_LINKS.map((data) => {
            return (
              <li>
                <a
                  href={data.url}
                  className="hover:text-primary cursor-pointer"
                >
                  {data.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </footer>
  );
};
