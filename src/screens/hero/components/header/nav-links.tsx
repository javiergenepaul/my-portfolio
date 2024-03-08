import { useNavLinkStore } from "@/stores";
import { twMerge } from "tailwind-merge";
import { BounceText } from "@/components";
import { NavLinkInterface } from "../component-props";
import { useTranslation } from "react-i18next";

export const NavLinks = (props: NavLinkInterface) => {
  const { name, path, selectedId } = props;
  const { selectedNav } = useNavLinkStore();
  const isActive: boolean = selectedNav === selectedId;
  const {} = useTranslation();

  const selectedClass = (): { lineClass: string; nameClass: string } => {
    return {
      lineClass: isActive
        ? "w-16 bg-foreground dark:bg-white"
        : "bg-foreground/50 dark:bg-slate-400",
      nameClass: isActive
        ? "text-foreground dark:text-white"
        : "dark:text-slate-400 text-foreground/50",
    };
  };

  return (
    <li className="border-none">
      <a
        className="flex items-center py-3 outline-none select-none group focus:outline-none"
        href={path}
      >
        <span
          className={twMerge(
            "nav-indicator mr-4 h-px w-8 transition-all group-hover:w-16 group-hover:bg-foreground group-focus-visible:bg-foreground dark:group-hover:bg-slate-200 group-focus-visible:w-16 dark:group-focus-visible:bg-slate-200 motion-reduce:transition-none",
            selectedClass().lineClass
          )}
        />
        <span
          className={twMerge(
            "nav-text text-xs font-bold uppercase tracking-widest group-hover:text-foreground group-focus-visible:text-foreground dark:group-hover:text-slate-200 dark:group-focus-visible:text-slate-200",
            selectedClass().nameClass
          )}
        >
          <BounceText text={name} />
        </span>
      </a>
    </li>
  );
};
