import { FadeAnimation, PageTitle } from "@/components";
import { SettingsSidenav } from "./components";
import { Outlet } from "react-router-dom";
import { PATH } from "@/config";
import { translate } from "@/i18n";

export interface SettingsItemInterface {
  title: string;
  href: string;
}

export const Settings = () => {
  const sidebarNavItems: SettingsItemInterface[] = [
    {
      title: translate("settings.nav.general"),
      href: `${PATH.SETTINGS.path}`,
    },
    {
      title: translate("settings.nav.appearance"),
      href: `${PATH.SETTINGS.path}/appearance`,
    },
  ];

  return (
    <FadeAnimation>
      <div className="p-10 pt-0 pb-16 space-y-6 lg:pt-10 ">
        <PageTitle
          pageName={translate("settings.settings")}
          path={PATH.HOME.path}
          description={translate("settings.description")}
        />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SettingsSidenav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{<Outlet />}</div>
        </div>
      </div>
    </FadeAnimation>
  );
};
