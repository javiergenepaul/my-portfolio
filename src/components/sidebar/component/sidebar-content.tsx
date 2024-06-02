import React from "react";
import { PATH, SOCIAL_MEDIA_LINKS, SideMenuInterface } from "@/config";
import { PersonIcon } from "@radix-ui/react-icons";
import { HomeIcon, PieChart, Contact, Code, Settings } from "lucide-react";
import { Drawer } from "vaul";
import { translate } from "@/i18n";
import { SidebarMenu } from "./sidebar-menu";
import { SocialMediaLinksInterface } from "@/screens";
import { SocialIcon } from "@/components";

interface SidebarContentInterface {
  title: string;
}

const SIDE_ICON_SIZE: string = "24px";

export const SidebarContent = (props: SidebarContentInterface) => {
  const { title } = props;

  const SIDE_MENU: SideMenuInterface[] = [
    {
      name: translate("sidebar.sideBarMenu.home"),
      path: PATH.HOME.path,
      icon: <HomeIcon width={SIDE_ICON_SIZE} height={SIDE_ICON_SIZE} />,
    },
    {
      name: translate("sidebar.sideBarMenu.aboutMe"),
      path: PATH.ABOUT.path,
      icon: <PersonIcon width={SIDE_ICON_SIZE} height={SIDE_ICON_SIZE} />,
    },
    {
      name: translate("sidebar.sideBarMenu.projects"),
      path: PATH.PROJECTS.path,
      icon: <PieChart width={SIDE_ICON_SIZE} height={SIDE_ICON_SIZE} />,
    },
    {
      name: translate("sidebar.sideBarMenu.contact"),
      path: PATH.CONTACTS.path,
      icon: <Contact width={SIDE_ICON_SIZE} height={SIDE_ICON_SIZE} />,
    },
    // TODO:: create skill pages
    // {
    //   name: translate("sidebar.sideBarMenu.skills"),
    //   path: PATH.SKILLS.path,
    //   icon: <Code width={SIDE_ICON_SIZE} height={SIDE_ICON_SIZE} />,
    // },
    {
      name: translate("settings.settings"),
      path: PATH.SETTINGS.path,
      icon: <Settings width={SIDE_ICON_SIZE} height={SIDE_ICON_SIZE} />,
    },
  ];

  return (
    <Drawer.Content className="bg-foreground flex flex-col rounded-t-[10px] h-full w-[325px] z-[70] mt-24 fixed bottom-0 right-0">
      <div className="flex-1 h-screen p-4 bg-background">
        <div className="h-full max-w-md mx-auto flex flex-col">
          <div className="flex flex-col gap-4">
            <Drawer.Title className="px-2 font-medium">{title}</Drawer.Title>
            <div className="flex flex-col justify-between px-2">
              <div>
                {SIDE_MENU.map((menu: SideMenuInterface, index: React.Key) => (
                  <React.Fragment key={index}>
                    <SidebarMenu {...menu} />
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-auto pt-auto px-2">
            <div className="flex justify-end gap-4">
              {SOCIAL_MEDIA_LINKS.map(
                (socialMedia: SocialMediaLinksInterface, index: React.Key) => (
                  <a className="flex gap-2" key={index} href={socialMedia.url}>
                    <SocialIcon icon={socialMedia.icon} />
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </Drawer.Content>
  );
};
