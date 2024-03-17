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

  const FLOATING_NAV_BUTTON: FloatingNavButtonInterface[] = [
    {
      icon: (
        <Home
          color={isNavActive(PATH.HOME.path)}
          height={"28px"}
          width={"28px"}
        />
      ),
      path: PATH.HOME.path,
      name: "Home",
    },
    {
      icon: (
        <User
          color={isNavActive(PATH.ABOUT.path)}
          height={"28px"}
          width={"28px"}
        />
      ),
      path: PATH.ABOUT.path,
      name: "About Me",
    },
    {
      icon: (
        <PieChart
          color={isNavActive(PATH.PROJECTS.path)}
          height={"28px"}
          width={"28px"}
        />
      ),
      path: PATH.PROJECTS.path,
      name: "Projects",
    },
    {
      icon: (
        <Code
          color={isNavActive(PATH.SKILLS.path)}
          height={"28px"}
          width={"28px"}
        />
      ),
      path: PATH.SKILLS.path,
      name: "Skills",
    },
    {
      icon: (
        <Contact
          color={isNavActive(PATH.CONTACTS.path)}
          height={"28px"}
          width={"28px"}
        />
      ),
      path: PATH.CONTACTS.path,
      name: "Contact Me",
    },
    {
      icon: (
        <Settings
          color={isNavActive([
            PATH.SETTINGS.path,
            PATH.SETTINGS_APPEARNCE.path,
            PATH.SETTINGS_GENERAL.path,
          ])}
          height={"28px"}
          width={"28px"}
        />
      ),
      path: PATH.SETTINGS.path,
      name: "Settings",
    },
  ];

  return (
    <div
      className={twMerge(
        "hidden lg:block",
        location.pathname === PATH.HOME.path ? "lg:hidden" : ""
      )}
    >
      <div className="fixed inset-0 z-[999999999] flex items-center w-full h-full pointer-events-none">
        <nav className="px-2 py-4 bg-popover rounded-r-xl">
          <ul className="flex flex-col gap-2 pointer-events-auto">
            {FLOATING_NAV_BUTTON.map((item: FloatingNavButtonInterface) => {
              return <FloatingNavButton {...item} />;
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
};
