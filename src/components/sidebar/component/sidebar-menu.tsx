import { SideMenuInterface } from "@/config";
import { useSiderStore } from "@/stores";
import { Separator } from "@radix-ui/react-separator";
import { Link } from "react-router-dom";

interface SideBarMenuInterface extends SideMenuInterface {}

export const SidebarMenu = (props: SideBarMenuInterface) => {
  const { path, name, icon } = props;
  const { setIsOpen } = useSiderStore();
  return (
    <>
      <Link
        to={path}
        className="flex items-center gap-4 py-1.5"
        onClick={() => setIsOpen(false)}
      >
        {icon}
        {name}
      </Link>
      <Separator className="my-2" />
    </>
  );
};
