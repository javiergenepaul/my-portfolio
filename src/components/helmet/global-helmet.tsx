import { translate } from "@/i18n";
import { usePageTitleStore } from "@/stores";
import { Helmet as ReactHelmet } from "react-helmet";

export const GlobalHelmet = () => {
  const { title } = usePageTitleStore();

  return <ReactHelmet title={translate("appName", { title: title })} />;
};
