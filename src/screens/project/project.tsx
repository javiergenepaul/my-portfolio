import { FadeAnimation, PageTitle } from "@/components";
import { PATH } from "@/config";
import { translate } from "@/i18n";
import { ProjectTable, ProjectViewMode } from "./components";

export const Project = () => {
  return (
    <FadeAnimation>
      <div className="py-10 pt-0 pb-16 space-y-6 lg:pt-10 ">
        <PageTitle
          pageName={translate("projects.title")}
          path={PATH.HOME.path}
          description={translate("projects.description")}
        />
        <ProjectViewMode />
        <ProjectTable />
      </div>
    </FadeAnimation>
  );
};
