"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { PATH } from "@/config";
import { translate } from "@/i18n";
import { usePageTitleStore } from "@/stores";

interface HeaderTitleProviderProps {
  children: React.ReactNode;
}

/**
 * Syncs the current Next.js pathname to the page-title Zustand store.
 * Replaces the react-router-dom useLocation() hook with usePathname().
 */
export const HeaderTitleProvider = ({ children }: HeaderTitleProviderProps) => {
  const pathname = usePathname();
  const { setTitle } = usePageTitleStore();

  useEffect(() => {
    const foundPath = Object.values(PATH).find((item) => item.path === pathname);
    setTitle(foundPath ? foundPath.name : translate("path.pageNotFound"));
  }, [pathname, setTitle]);

  return <>{children}</>;
};
