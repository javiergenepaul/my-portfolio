import { translate } from "@/i18n";
import { usePageTitleStore } from "@/stores";
import { Helmet as ReactHelmet } from "react-helmet";
import { useTranslation } from "react-i18next";

export const GlobalHelmet = () => {
  const { title } = usePageTitleStore();
  const {} = useTranslation();

  return <ReactHelmet title={translate("appName", { title: title })} />;
};
