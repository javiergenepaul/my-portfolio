"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Code, Contact, Home, Settings, User, FileText } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { EMERALD_COLOR, PATH } from "@/config";
import { useSettingsStore } from "@/stores";
import { getColor } from "@/lib";
import { translate } from "@/i18n";
import FloatingNavButton, {
  FloatingNavButtonInterface,
} from "./floating-nav-button";
import { ResumeModal } from "@/components/common/resume-modal";

export const FloatingNavbar = () => {
  const pathname = usePathname();
  const { color } = useSettingsStore();
  const [colorPrimary, setColorPrimary] = useState(EMERALD_COLOR);
  const [resumeOpen, setResumeOpen] = useState(false);

  useEffect(() => {
    setColorPrimary(getColor(color));
  }, [color]);

  const isNavActive = (path: string | string[]): string | undefined => {
    if (Array.isArray(path)) {
      return path.includes(pathname) ? colorPrimary : undefined;
    }
    return pathname === path ? colorPrimary : undefined;
  };

  const NAV_ICON_SIZE = "1.5rem";

  const FLOATING_NAV_BUTTON: FloatingNavButtonInterface[] = [
    {
      icon: (
        <Home
          color={isNavActive(PATH.HOME.path)}
          height={NAV_ICON_SIZE}
          width={NAV_ICON_SIZE}
        />
      ),
      path: PATH.HOME.path,
      name: translate("floatingNav.home"),
    },
    {
      icon: (
        <User
          color={isNavActive(PATH.ABOUT.path)}
          height={NAV_ICON_SIZE}
          width={NAV_ICON_SIZE}
        />
      ),
      path: PATH.ABOUT.path,
      name: translate("floatingNav.aboutMe"),
    },
    {
      icon: (
        <Code
          color={isNavActive(PATH.PROJECTS.path)}
          height={NAV_ICON_SIZE}
          width={NAV_ICON_SIZE}
        />
      ),
      path: PATH.PROJECTS.path,
      name: translate("floatingNav.project"),
    },
    {
      icon: (
        <Contact
          color={isNavActive(PATH.CONTACTS.path)}
          height={NAV_ICON_SIZE}
          width={NAV_ICON_SIZE}
        />
      ),
      path: PATH.CONTACTS.path,
      name: translate("floatingNav.contactMe"),
    },
    {
      icon: (
        <Settings
          color={isNavActive([
            PATH.SETTINGS.path,
            PATH.SETTINGS_APPEARNCE.path,
            PATH.SETTINGS_GENERAL.path,
          ])}
          height={NAV_ICON_SIZE}
          width={NAV_ICON_SIZE}
        />
      ),
      path: PATH.SETTINGS.path,
      name: translate("floatingNav.settings"),
    },
    {
      icon: (
        <FileText
          color={isNavActive(PATH.RESUME.path)}
          height={NAV_ICON_SIZE}
          width={NAV_ICON_SIZE}
        />
      ),
      path: PATH.RESUME.path,
      name: "Resume Builder",
      onClick: () => setResumeOpen(true),
    },
  ];

  return (
    <>
      <div
        className={twMerge(
          "hidden lg:block opacity-1",
          pathname === PATH.HOME.path ? "opacity-0" : "",
        )}
      >
        <div className="fixed inset-0 z-999999999999 flex items-center w-full h-full pointer-events-none">
          <nav className="px-2 py-4 border bg-popover rounded-r-xl">
            <ul className="flex flex-col gap-2 pointer-events-auto">
              {FLOATING_NAV_BUTTON.map((item, index) => (
                <FloatingNavButton key={index} {...item} />
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <ResumeModal
        open={resumeOpen}
        onClose={() => setResumeOpen(false)}
        year={2024}
        defaultColor="emerald"
      />
    </>
  );
};
