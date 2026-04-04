"use client";

import { Drawer } from "vaul";
import { useSiderStore } from "@/stores";
import { translate, useLocaleRefresh } from "@/i18n";
import { SidebarNavBtn, SidebarContent, SidebarOverlay } from "./component";

export const SideBar = () => {
  const { isOpen, setIsOpen } = useSiderStore();
  useLocaleRefresh();

  return (
    <Drawer.Root
      direction="right"
      open={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <Drawer.Trigger asChild>
        <SidebarNavBtn />
      </Drawer.Trigger>
      <Drawer.Portal>
        <SidebarOverlay />
        <SidebarContent title={translate("sidebar.menu")} />
      </Drawer.Portal>
    </Drawer.Root>
  );
};
