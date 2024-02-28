import { motion, useAnimationControls } from "framer-motion";
import { useState } from "react";
import { RubberAnimationInterface } from "./animation-props";
import { twMerge } from "tailwind-merge";

export const RubberAnimation = (props: RubberAnimationInterface) => {
  const { children, className } = props;
  const controls = useAnimationControls();
  const [isPlaying, setIsPlaying] = useState(false);

  const rubberBand = () => {
    controls.start({
      transform: [
        "scale3d(1, 1, 1)",
        "scale3d(1.4, 0.55, 1)",
        "scale3d(0.75, 1.25 , 1)",
        "scale3d(1.25, 0.85, 1)",
        "scale3d(0.9, 1.05, 1)",
        "scale3d(1, 1, 1)",
      ],
      transition: {
        ease: "easeOut",
        times: [0, 0.4, 0.6, 0.7, 0.8, 0.9],
        duration: 1,
      },
    });
    setIsPlaying(true);
  };

  return (
    <motion.span
      className={twMerge(
        "inline-block cursor-pointer hover:text-primar",
        className
      )}
      // className={`inline-block cursor-pointer hover:text-primary ${
      //   isUnderline && "underline"
      // }`}
      animate={controls}
      onMouseOver={() => !isPlaying && rubberBand()}
      onAnimationComplete={() => setIsPlaying(false)}
    >
      {children}
    </motion.span>
  );
};
