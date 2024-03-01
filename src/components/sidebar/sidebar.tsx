import { HamburgerMenuIcon, PersonIcon } from "@radix-ui/react-icons";
import { Drawer } from "vaul";
import { Button, Separator } from "../ui";
import { PATH } from "@/config";
import { Code, Contact, HomeIcon, PieChart } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

interface SideMenuInterface {
  name: string;
  path: string;
  icon: React.ReactNode;
}

export const SideBar = () => {
  const SIDE_MENU: SideMenuInterface[] = [
    {
      name: "Home",
      path: PATH.HOME.path,
      icon: <HomeIcon width={"24px"} height={"24px"} />,
    },
    {
      name: "About Me",
      path: PATH.ABOUT.path,
      icon: <PersonIcon width={"24px"} height={"24px"} />,
    },
    {
      name: "Projects",
      path: PATH.PROJECTS.path,
      icon: <PieChart width={"24px"} height={"24px"} />,
    },
    {
      name: "Contacts",
      path: PATH.CONTACTS.path,
      icon: <Contact width={"24px"} height={"24px"} />,
    },
    {
      name: "Skills",
      path: PATH.SKILLS.path,
      icon: <Code width={"24px"} height={"24px"} />,
    },
  ];

  const [open, setOpen] = useState<boolean>(false);

  return (
    <Drawer.Root direction="right" open={open} onClose={() => setOpen(false)}>
      <Drawer.Trigger asChild>
        <Button variant={"ghost"} size={"icon"} onClick={() => setOpen(!open)}>
          <HamburgerMenuIcon width={"30px"} height={"30px"} />
        </Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/10 dark:bg-white/10 backdrop-blur-sm"
        />
        <Drawer.Content className="bg-foreground flex flex-col rounded-t-[10px] h-full w-[275px] z-[70] mt-24 fixed bottom-0 right-0">
          <div className="flex-1 h-full p-4 bg-background">
            <div className="max-w-md mx-auto">
              <Drawer.Title className="mb-4 font-medium">
                My Portfolio
              </Drawer.Title>
              <div className="p-4 px-2 ">
                {SIDE_MENU.map((menu: SideMenuInterface, index: React.Key) => (
                  <div>
                    <Link
                      to={menu.path}
                      key={index}
                      className="flex items-center gap-4 py-1.5"
                      onClick={() => setOpen(false)}
                    >
                      {menu.icon}
                      {menu.name}
                    </Link>
                    <Separator className="my-2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
