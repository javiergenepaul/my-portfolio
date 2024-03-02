import { HamburgerMenuIcon, HomeIcon, PersonIcon } from "@radix-ui/react-icons";
import { Drawer } from "vaul";
import { Button, Separator } from "../ui";
import { Link } from "react-router-dom";
import { useSiderStore } from "@/stores";
import { PATH, SideMenuInterface } from "@/config";
import { PieChart, Contact, Code } from "lucide-react";
import React from "react";
import { useSwipeable } from "react-swipeable";

export const SideBar = () => {
  const { isOpen, setIsOpen } = useSiderStore();

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

  const handlers = useSwipeable({
    onSwipedLeft: () => setIsOpen(true),
    onSwipedRight: () => setIsOpen(false),
  });

  return (
    <Drawer.Root
      direction="right"
      open={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <Drawer.Trigger asChild>
        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={() => setIsOpen(!open)}
        >
          <HamburgerMenuIcon width={"30px"} height={"30px"} />
        </Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay
          {...handlers}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/10 dark:bg-white/10 backdrop-blur-sm"
        />
        <Drawer.Content className="bg-foreground flex flex-col rounded-t-[10px] h-full w-[275px] z-[70] mt-24 fixed bottom-0 right-0">
          <div className="flex-1 h-full p-4 bg-background">
            <div className="max-w-md mx-auto">
              <Drawer.Title className="px-2 mb-4 font-medium">
                Menu
              </Drawer.Title>
              <div className="px-2 py-4 ">
                {SIDE_MENU.map((menu: SideMenuInterface, index: React.Key) => (
                  <React.Fragment key={index}>
                    <Link
                      to={menu.path}
                      key={index}
                      className="flex items-center gap-4 py-1.5"
                      onClick={() => setIsOpen(false)}
                    >
                      {menu.icon}
                      {menu.name}
                    </Link>
                    <Separator className="my-2" />
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
