import { motion, Variants } from "framer-motion";
import { FadeAnimationProps } from "./animation-props";

export const FadeAnimation = (props: FadeAnimationProps) => {
  const { children } = props;

  const duration: number = 1;

  const fadeVariants: Variants = {
    initial: {
      opacity: 0,
      transition: {
        duration: duration,
        ease: "easeOut",
      },
    },
    animate: {
      opacity: 1,
      transition: {
        duration: duration,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
    },
  };

  return (
    <motion.div
      variants={fadeVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
};
