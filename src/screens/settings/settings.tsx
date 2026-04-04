"use client";

import { FadeAnimation, PageTitle } from "@/components";
import { SettingsSidenav } from "./components";
import { PATH } from "@/config";
import { translate } from "@/i18n";
import { useLocaleRefresh } from "@/i18n";

export interface SettingsItemInterface {
  title: string;
  href: string;
}

interface SettingsProps {
  /** Sub-screen content rendered in the content area (replaces <Outlet />). */
  children: React.ReactNode;
}

export const Settings = ({ children }: SettingsProps) => {
  useLocaleRefresh();

  const sidebarNavItems: SettingsItemInterface[] = [
    {
      title: translate("settings.nav.general"),
      href: PATH.SETTINGS.path,
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
          <aside className="lg:w-1/5 shrink-0">
            <SettingsSidenav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 min-w-0 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </FadeAnimation>
  );
};
