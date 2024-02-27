import { NavLinkInterface } from "@/config";
import { useNavLinkStore } from "@/stores";
import { twMerge } from "tailwind-merge";

export const NavLinks = (props: NavLinkInterface) => {
  const { key, name, path, selectedId } = props;
  const { selectedNav } = useNavLinkStore();
  const isActive: boolean = selectedNav === selectedId;

  const selectedClass = (): { lineClass: string; nameClass: string } => {
    return {
      lineClass: isActive ? "w-16 bg-white" : "bg-slate-400",
      nameClass: isActive ? "text-slate-200 text-white" : "text-slate-400",
    };
  };

  return (
    <li className="border-none" key={key}>
      <a
        className="flex items-center py-3 outline-none select-none group focus:outline-none"
        href={path}
      >
        <span
          className={twMerge(
            "nav-indicator mr-4 h-px w-8 transition-all group-hover:w-16 group-hover:bg-slate-200 group-focus-visible:w-16 group-focus-visible:bg-slate-200 motion-reduce:transition-none",
            selectedClass().lineClass
          )}
        />
        <span
          className={twMerge(
            "nav-text text-xs font-bold uppercase tracking-widest group-hover:text-slate-200 group-focus-visible:text-slate-200",
            selectedClass().nameClass
          )}
        >
          {name}
        </span>
      </a>
    </li>
  );
};
