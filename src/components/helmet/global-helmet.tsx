import { APP_NAME } from "@/config";
import { usePageTitleStore } from "@/stores";
import { Helmet as ReactHelmet } from "react-helmet";

export const GlobalHelmet = () => {
  const { title } = usePageTitleStore();

  return <ReactHelmet title={`${APP_NAME} - ${title}`} />;
};