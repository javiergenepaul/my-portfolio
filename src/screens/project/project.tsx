import { FadeAnimation, PageTitle } from "@/components";
import { PATH } from "@/config";
import { translate } from "@/i18n";

export const Project = () => {
  return (
    <FadeAnimation>
      <div className="py-10 pt-0 pb-16 space-y-6 lg:pt-10 ">
        <PageTitle
          pageName={translate("projects.title")}
          path={PATH.HOME.path}
          description={translate("projects.description")}
        />
        <h1>{translate("availableSoon")}</h1>
      </div>
    </FadeAnimation>
  );
};
