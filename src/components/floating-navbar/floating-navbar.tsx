import { Code, Contact, Home, PieChart, Settings, User } from "lucide-react";
import { EMERALD_COLOR, PATH } from "@/config";
import FloatingNavButton, {
  FloatingNavButtonInterface,
} from "./floating-nav-button";
import { useLocation } from "react-router-dom";
import { useSettingsStore } from "@/stores";
import { useEffect, useState } from "react";
import { getColor } from "@/lib";
import { twMerge } from "tailwind-merge";
import { translate } from "@/i18n";

export const FloatingNavbar = () => {
  const location = useLocation();
  const { color } = useSettingsStore();

  const [colorPrimary, setColorPrimary] = useState(EMERALD_COLOR);

  useEffect(() => {
    setColorPrimary(getColor(color));
  }, [color]);

  /**
   * Determines if a navigation item is active based on the current path.
   * @param {string|string[]} path - The path or an array of paths to check.
   * @returns {string|undefined} The color value if the path matches the current location, otherwise undefined.
   */
  const isNavActive = (path: string | string[]): string | undefined => {
    if (Array.isArray(path)) {
      return path.includes(location.pathname) ? colorPrimary : undefined;
    } else {
      return location.pathname === path ? colorPrimary : undefined;
    }
  };

  const NAV_ICON_SIZE: string = "1.5rem";

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
    // TODO:: create skill page
    // {
    //   icon: (
    //     <Code
    //       color={isNavActive(PATH.SKILLS.path)}
    //       height={NAV_ICON_SIZE}
    //       width={NAV_ICON_SIZE}
    //     />
    //   ),
    //   path: PATH.SKILLS.path,
    //   name: translate("floatingNav.skills"),
    // },
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
  ];

  return (
    <div
      className={twMerge(
        "hidden lg:block opacity-1",
        location.pathname === PATH.HOME.path ? "opacity-0" : ""
      )}
    >
      <div className="fixed inset-0 z-[999999999999] flex items-center w-full h-full pointer-events-none">
        <nav className="px-2 py-4 border bg-popover rounded-r-xl">
          <ul className="flex flex-col gap-2 pointer-events-auto">
            {FLOATING_NAV_BUTTON.map(
              (item: FloatingNavButtonInterface, index: React.Key) => {
                return <FloatingNavButton key={index} {...item} />;
              }
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
};
