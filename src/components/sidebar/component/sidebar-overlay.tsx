import { useSiderStore } from "@/stores";
import { useSwipeable } from "react-swipeable";
import { Drawer } from "vaul";

export const SidebarOverlay = () => {
  const { setIsOpen } = useSiderStore();
  const handlers = useSwipeable({
    onSwipedLeft: (event) => {
      const swipeDistance = Math.abs(event.deltaX);
      if (swipeDistance >= 200) {
        setIsOpen(true);
      }
    },
    onSwipedRight: (event) => {
      const swipeDistance = Math.abs(event.deltaX);
      if (swipeDistance >= 200) {
        setIsOpen(false);
      }
    },
  });

  return (
    <Drawer.Overlay
      {...handlers}
      onClick={() => setIsOpen(false)}
      className="fixed inset-0 bg-black/60 dark:bg-white/10 dark:backdrop-blur-[2px] backdrop-blur-0 z-[60]"
    />
  );
};
