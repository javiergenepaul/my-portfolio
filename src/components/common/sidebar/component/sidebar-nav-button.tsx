import { Button } from "@/components";
import { useSiderStore } from "@/stores";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";

export const SidebarNavBtn = () => {
  const { setIsOpen } = useSiderStore();
  return (
    <Button
      className="focus:border-none active:bg-transparent focus:bg-transparent"
      variant={"ghost"}
      size={"icon"}
      onClick={() => setIsOpen(true)}
    >
      <HamburgerMenuIcon width={"30px"} height={"30px"} />
    </Button>
  );
};
