import { PATH } from "@/config";
import { translate } from "@/i18n";
import { TestIcon } from "./test";
import { FadeAnimation, PageTitle } from "@/components";

export const About = () => {
  return (
    <FadeAnimation>
      <div className="py-10 pt-0 pb-16 space-y-6 lg:pt-10 ">
        <PageTitle
          pageName={translate("about.title")}
          path={PATH.HOME.path}
          description={translate("about.description")}
        />
        <h1>{translate("availableSoon")}</h1>
        <div className="w-[300px] h-[300px]">
          <TestIcon />
        </div>
      </div>
    </FadeAnimation>
  );
};
