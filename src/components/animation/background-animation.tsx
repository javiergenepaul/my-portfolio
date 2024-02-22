import { useThemeStore } from "@/stores";
import { motion } from "framer-motion";

export const BackgroundAnimation = () => {
  const { darkMode } = useThemeStore();

  return (
    <div
      id="background"
      className="absolute top-0 left-0 h-full w-full overflow-hidden"
    >
      <motion.div
        style={{ position: "absolute", left: "-100%" }}
        animate={{
          left: darkMode ? "0%" : "-100%",
        }}
        transition={{
          duration: 0.3,
        }}
        className="flex w-[200%] h-full"
      >
        <div className="bg-black w-1/2" />
        <div className="bg-white w-1/2" />
      </motion.div>
    </div>
  );
};
