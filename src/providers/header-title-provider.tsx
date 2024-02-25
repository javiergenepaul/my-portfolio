import { PATH } from "@/config";
import { translate } from "@/i18n";
import { usePageTitleStore } from "@/stores";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface HeaderTitleProviderInterface {
  children: React.ReactNode;
}

export const HeaderTitleProvider = (props: HeaderTitleProviderInterface) => {
  const { children } = props;
  let location = useLocation();
  const { setTitle } = usePageTitleStore();

  useEffect(() => {
    const foundPath = Object.values(PATH).find(
      (item) => item.path === location.pathname
    );

    if (foundPath) {
      setTitle(foundPath.name);
    } else {
      setTitle(translate("path.pageNotFound"));
    }
  }, [location]);

  return children;
};
