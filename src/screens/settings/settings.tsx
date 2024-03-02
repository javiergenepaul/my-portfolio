import { Separator } from "@/components";
import { SettingsSidenav } from "./components";
import { Outlet } from "react-router-dom";
import { PATH } from "@/config";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export interface SettingsItemInterface {
  title: string;
  href: string;
}

export const Settings = () => {
  const sidebarNavItems: SettingsItemInterface[] = [
    {
      title: "General",
      href: `${PATH.SETTINGS.path}`,
    },
    {
      title: "Appearance",
      href: `${PATH.SETTINGS.path}/appearance`,
    },
  ];

  return (
    <div className="p-10 pt-0 pb-16 space-y-6 lg:pt-10 ">
      <div className="space-y-0.5">
        <Link
          to={PATH.HOME.path}
          className="inline-flex items-center mb-2 font-semibold leading-tight text-teal-300 cursor-pointer group"
        >
          {
            <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-2" />
          }
          Paul Javier
        </Link>
        <h1 className="text-4xl font-bold tracking-tight text-slate-200 sm:text-5xl">
          Settings
        </h1>
        <p className="text-muted-foreground">Manage settings</p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <SettingsSidenav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{<Outlet />}</div>
      </div>
    </div>
  );
};
