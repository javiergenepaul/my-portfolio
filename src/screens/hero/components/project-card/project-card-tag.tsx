import { twMerge } from "tailwind-merge";

interface TagInterface {
  className: string;
  children: React.ReactNode;
}

export const ProjectCardTag = (props: TagInterface) => {
  const { className, children } = props;
  return (
    <div
      className={twMerge(
        "absolute right-[-40px] z-50 w-40 px-4 py-1 text-xs text-center rotate-45 top-[28px] text-white select-none",
        className
      )}
    >
      {children}
    </div>
  );
};
