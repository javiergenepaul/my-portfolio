"use client";

import React, { useState } from "react";
import { PATH, SideMenuInterface } from "@/config";
import { useSocials } from "@/lib/content/use-content";
import { PersonIcon } from "@radix-ui/react-icons";
import { HomeIcon, PieChart, Contact, Settings, FileText } from "lucide-react";
import { Drawer } from "vaul";
import { translate } from "@/i18n";
import { SidebarMenu } from "./sidebar-menu";
import { SidebarQuickAccess } from "./sidebar-quick-access";
import { SocialIcon } from "@/components";
import { ResumeModal } from "@/components/common/resume-modal";

interface SidebarContentInterface {
  title: string;
}

const SIDE_ICON_SIZE: string = "24px";

export const SidebarContent = (props: SidebarContentInterface) => {
  const { title } = props;
  const [resumeOpen, setResumeOpen] = useState(false);
  const SOCIAL_MEDIA_LINK_DATA = useSocials();

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
      name: translate("settings.settings"),
      path: PATH.SETTINGS.path,
      icon: <Settings width={SIDE_ICON_SIZE} height={SIDE_ICON_SIZE} />,
    },
    {
      name: "Resume Builder",
      path: PATH.RESUME.path,
      icon: <FileText width={SIDE_ICON_SIZE} height={SIDE_ICON_SIZE} />,
      onClick: () => setResumeOpen(true),
    },
  ];

  return (
    <>
      <Drawer.Content className="bg-foreground flex flex-col rounded-t-[10px] h-full w-81.25 z-70 mt-24 fixed bottom-0 right-0">
        <div className="flex-1 h-screen p-4 bg-background">
          <div className="h-full max-w-md mx-auto flex flex-col">
            <div className="flex flex-col gap-4">
              <Drawer.Title className="px-2 font-medium">{title}</Drawer.Title>
              <div className="flex flex-col justify-between px-2">
                <div>
                  {SIDE_MENU.map(
                    (menu: SideMenuInterface, index: React.Key) => (
                      <React.Fragment key={index}>
                        <SidebarMenu {...menu} />
                      </React.Fragment>
                    ),
                  )}
                </div>
              </div>
            </div>
            <div className="mt-auto pt-4 flex flex-col gap-4">
              <SidebarQuickAccess />
              <div className="flex justify-end gap-4 px-2">
                {SOCIAL_MEDIA_LINK_DATA.map((socialMedia, index: React.Key) => (
                  <a className="flex gap-2" key={index} href={socialMedia.url}>
                    <SocialIcon
                      icon={
                        socialMedia.icon as React.ComponentProps<
                          typeof SocialIcon
                        >["icon"]
                      }
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Drawer.Content>

      <ResumeModal
        open={resumeOpen}
        onClose={() => setResumeOpen(false)}
        year={2024}
        defaultColor="emerald"
      />
    </>
  );
};
