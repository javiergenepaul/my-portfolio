import { MetaBG } from "@/assets";
import { PATH } from "@/config";
import { translate } from "@/i18n";
import { usePageTitleStore } from "@/stores";
import { Helmet as ReactHelmet } from "react-helmet";

export const GlobalHelmet = () => {
  const { title } = usePageTitleStore();

  return (
    <ReactHelmet title={translate("appName", { title: title })}>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={"test description"} />
      <meta property="og:image" content={MetaBG} />
      <meta property="og:url" content={PATH.HOME.path} />
    </ReactHelmet>
  );
};
