import React from "react";
import { PATH, SideMenuInterface } from "@/config";
import { PersonIcon } from "@radix-ui/react-icons";
import { HomeIcon, PieChart, Contact, Code } from "lucide-react";
import { Drawer } from "vaul";
import { SidebarLangOptionGroup } from "./sidebar-lang-option-group";
import { translate } from "@/i18n";
import { SidebarMenu } from "./sidebar-menu";

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
    {
      name: translate("sidebar.sideBarMenu.skills"),
      path: PATH.SKILLS.path,
      icon: <Code width={SIDE_ICON_SIZE} height={SIDE_ICON_SIZE} />,
    },
  ];

  return (
    <Drawer.Content className="bg-foreground flex flex-col rounded-t-[10px] h-full w-[325px] z-[70] mt-24 fixed bottom-0 right-0">
      <div className="flex-1 h-full p-4 pb-16 bg-background">
        <div className="h-full max-w-md mx-auto">
          <Drawer.Title className="px-2 mb-4 font-medium">{title}</Drawer.Title>
          <div className="flex flex-col justify-between h-full px-2 py-4">
            <div className="">
              {SIDE_MENU.map((menu: SideMenuInterface, index: React.Key) => (
                <React.Fragment key={index}>
                  <SidebarMenu {...menu} />
                </React.Fragment>
              ))}
            </div>
            <SidebarLangOptionGroup />
          </div>
        </div>
      </div>
    </Drawer.Content>
  );
};
