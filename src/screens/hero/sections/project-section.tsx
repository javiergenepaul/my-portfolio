import { PATH, PROJECTS, ProjectInterface } from "@/config";
import { Button } from "@/components";
import { useNavigate } from "react-router-dom";
import { translate } from "@/i18n";
import { ProjectCard } from "../components";

interface Data {
  type: "confidential" | "client" | "personal" | "tutorial";
}

export const ProjectSection = () => {
  const navigate = useNavigate();

  const priorityOrder: { [key in Data["type"]]: number } = {
    personal: 1,
    client: 2,
    confidential: 3,
    tutorial: 4,
  };

  const sortedProjectsHandler = (): ProjectInterface[] => {
    return PROJECTS.sort((a, b) => {
      return priorityOrder[a.type] - priorityOrder[b.type];
    });
  };

  return (
    <section
      id="projects"
      className="pt-16 h-fit section snap-start lg:pt-24 lg:px-4"
      aria-label="Projects"
    >
      <div className="flex flex-col gap-4">
        {sortedProjectsHandler().map(
          (project: ProjectInterface, index: React.Key) => {
            return <ProjectCard key={index} {...project} />;
          }
        )}
      </div>
      <div className="flex justify-end w-full pt-8">
        <Button
          variant={"link"}
          onClick={() => {
            navigate(PATH.PROJECTS.path);
          }}
        >
          {translate("projects.button.viewFullArchive")}
        </Button>
      </div>
    </section>
  );
};
