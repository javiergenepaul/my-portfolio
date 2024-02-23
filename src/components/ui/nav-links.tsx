import { NavLinkInterface } from "@/config";

export const NavLinks = (props: NavLinkInterface) => {
  const { key, name, path } = props;
  return (
    <li className="border-none" key={key}>
      <a className="group flex items-center py-3 outline-none focus:outline-none" href={path}>
        <span className="nav-indicator mr-4 h-px w-8 bg-white transition-all group-hover:w-16 group-hover:bg-slate-200 group-focus-visible:w-16 group-focus-visible:bg-slate-200 motion-reduce:transition-none" />
        <span className="nav-text text-xs font-bold uppercase tracking-widest text-white group-hover:text-slate-200 group-focus-visible:text-slate-200">
          {name}
        </span>
      </a>
    </li>
  );
};