import { useThemeStore } from "@/stores";
import { motion } from "framer-motion";

export const BackgroundAnimation = () => {
  const { getTheme } = useThemeStore();

  return (
    <div
      id="background"
      className="absolute top-0 left-0 hidden w-full h-full overflow-hidden"
    >
      <motion.div
        transition={{
          duration: 0.3,
        }}
        animate={{ opacity: getTheme() ? 0 : 1 }}
        className="absolute left-0 flex w-full h-full bg-black"
      ></motion.div>
    </div>
  );
};
