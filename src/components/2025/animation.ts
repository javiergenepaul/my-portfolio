export const ease = [0.22, 1, 0.36, 1] as const;

export const pageAnim = {
  initial: { opacity: 0, y: 18, filter: "blur(6px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease },
  },
  exit: {
    opacity: 0,
    y: -10,
    filter: "blur(3px)",
    transition: { duration: 0.22, ease: "easeIn" as const },
  },
};

export const listAnim = {
  animate: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } },
};

export const itemAnim = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.36, ease } },
};

export const iconAnim = {
  initial: { opacity: 0, scale: 0.7 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.3, ease } },
};
