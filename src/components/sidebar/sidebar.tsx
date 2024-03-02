import { Drawer } from "vaul";
import { useSiderStore } from "@/stores";
import { SidebarNavBtn, SidebarContent, SidebarOverlay } from "./component";
import { translate } from "@/i18n";
import { useTranslation } from "react-i18next";

export const SideBar = () => {
  const { isOpen, setIsOpen } = useSiderStore();
  const {} = useTranslation();

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
