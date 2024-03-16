import { Code, Contact, Home, PieChart, Settings, User } from "lucide-react";
import { PATH } from "@/config";
import FloatingNavButton, {
  FloatingNavButtonInterface,
} from "./floating-nav-button";

export const FloatingNavbar = () => {
  const FLOATING_NAV_BUTTON: FloatingNavButtonInterface[] = [
    {
      icon: <Home height={"28px"} width={"28px"} />,
      path: PATH.HOME.path,
      name: "Home",
    },
    {
      icon: <User height={"28px"} width={"28px"} />,
      path: PATH.ABOUT.path,
      name: "About Me",
    },
    {
      icon: <PieChart height={"28px"} width={"28px"} />,
      path: PATH.PROJECTS.path,
      name: "Projects",
    },
    {
      icon: <Code height={"28px"} width={"28px"} />,
      path: PATH.SKILLS.path,
      name: "Skills",
    },
    {
      icon: <Contact height={"28px"} width={"28px"} />,
      path: PATH.CONTACTS.path,
      name: "Contact Me",
    },
    {
      icon: <Settings height={"28px"} width={"28px"} />,
      path: PATH.SETTINGS.path,
      name: "Settings",
    },
  ];

  return (
    <div className="fixed inset-0 flex items-center w-full h-full pointer-events-none">
      <div className="px-2 py-4 bg-popover rounded-r-xl">
        <ul className="flex flex-col gap-2 pointer-events-auto">
          {FLOATING_NAV_BUTTON.map((item: FloatingNavButtonInterface) => {
            return <FloatingNavButton {...item} />;
          })}
        </ul>
      </div>
    </div>
  );
};
