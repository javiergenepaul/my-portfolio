import { Code, Contact, Home, PieChart, Settings, User } from "lucide-react";
<<<<<<< HEAD
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
=======
import { PATH } from "@/config";
import FloatingNavButton, {
  FloatingNavButtonInterface,
} from "./floating-nav-button";

export const FloatingNavbar = () => {
  const FLOATING_NAV_BUTTON: FloatingNavButtonInterface[] = [
    {
      icon: <Home height={"28px"} width={"28px"} />,
>>>>>>> master
      path: PATH.HOME.path,
      name: "Home",
    },
    {
<<<<<<< HEAD
      icon: (
        <User
          color={isNavActive(PATH.ABOUT.path)}
          height={"28px"}
          width={"28px"}
        />
      ),
=======
      icon: <User height={"28px"} width={"28px"} />,
>>>>>>> master
      path: PATH.ABOUT.path,
      name: "About Me",
    },
    {
<<<<<<< HEAD
      icon: (
        <PieChart
          color={isNavActive(PATH.PROJECTS.path)}
          height={"28px"}
          width={"28px"}
        />
      ),
=======
      icon: <PieChart height={"28px"} width={"28px"} />,
>>>>>>> master
      path: PATH.PROJECTS.path,
      name: "Projects",
    },
    {
<<<<<<< HEAD
      icon: (
        <Code
          color={isNavActive(PATH.SKILLS.path)}
          height={"28px"}
          width={"28px"}
        />
      ),
=======
      icon: <Code height={"28px"} width={"28px"} />,
>>>>>>> master
      path: PATH.SKILLS.path,
      name: "Skills",
    },
    {
<<<<<<< HEAD
      icon: (
        <Contact
          color={isNavActive(PATH.CONTACTS.path)}
          height={"28px"}
          width={"28px"}
        />
      ),
=======
      icon: <Contact height={"28px"} width={"28px"} />,
>>>>>>> master
      path: PATH.CONTACTS.path,
      name: "Contact Me",
    },
    {
<<<<<<< HEAD
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
=======
      icon: <Settings height={"28px"} width={"28px"} />,
>>>>>>> master
      path: PATH.SETTINGS.path,
      name: "Settings",
    },
  ];

  return (
<<<<<<< HEAD
    <div
      className={twMerge(
        "hidden lg:block",
        location.pathname === PATH.HOME.path ? "lg:hidden" : ""
      )}
    >
      <div className="fixed inset-0 z-[999999999] flex items-center w-full h-full pointer-events-none">
        <nav className="px-2 py-4 border bg-popover rounded-r-xl">
=======
    <div className="hidden lg:block">
      <div className="fixed inset-0 flex items-center w-full h-full pointer-events-none">
        <div className="px-2 py-4 bg-popover rounded-r-xl">
>>>>>>> master
          <ul className="flex flex-col gap-2 pointer-events-auto">
            {FLOATING_NAV_BUTTON.map((item: FloatingNavButtonInterface) => {
              return <FloatingNavButton {...item} />;
            })}
          </ul>
<<<<<<< HEAD
        </nav>
=======
        </div>
>>>>>>> master
      </div>
    </div>
  );
};
