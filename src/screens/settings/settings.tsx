import { FadeAnimation, PageTitle } from "@/components";
import { SettingsSidenav } from "./components";
import { Outlet } from "react-router-dom";
import { PATH } from "@/config";
import { translate } from "@/i18n";
import { useTranslation } from "react-i18next";

export interface SettingsItemInterface {
  title: string;
  href: string;
}

export const Settings = () => {
  const {} = useTranslation();
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
      <div className="space-y-6 select-none lg:py-16">
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
