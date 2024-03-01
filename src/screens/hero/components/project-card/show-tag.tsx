import { ProjectType } from "@/config";
import { ProjectCardTag } from ".";
import { translate } from "@/i18n";

interface ShowTagInterface {
  type: ProjectType;
}

export const ShowTag = (props: ShowTagInterface) => {
  const { type } = props;

  switch (type) {
    case "confidential":
      return (
        <ProjectCardTag className={"bg-destructive"}>
          {translate("projects.tag.confidential")}
        </ProjectCardTag>
      );
    case "personal":
      return (
        <ProjectCardTag className={"bg-primary"}>
          {translate("projects.tag.personal")}
        </ProjectCardTag>
      );
    case "client":
      return (
        <ProjectCardTag className={"bg-yellow-700"}>
          {translate("projects.tag.client")}
        </ProjectCardTag>
      );
    case "tutorial":
      return (
        <ProjectCardTag className={"bg-slate-500"}>
          {translate("projects.tag.tutorial")}
        </ProjectCardTag>
      );
    default:
      return null;
  }
};
