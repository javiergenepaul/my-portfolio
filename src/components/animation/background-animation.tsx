import { useThemeStore } from "@/stores";
import { motion } from "framer-motion";

export const BackgroundAnimation = () => {
  const { darkMode } = useThemeStore();

  return (
    <div
      id="background"
      className="absolute top-0 left-0 h-full w-full overflow-hidden hidden"
    >
      <motion.div
        transition={{
          duration: 0.3,
        }}
        animate={{ opacity: darkMode ? 0 : 1 }}
        className="flex w-full h-full bg-black absolute left-0"
      ></motion.div>
    </div>
  );
};
