import { PROJECTS, ProjectInterface } from "@/config";
import { ProjectCard } from "../components/project-card";

interface Data {
  type: "confidential" | "client" | "personal";
}

export const ProjectSection = () => {
  const priorityOrder: { [key in Data["type"]]: number } = {
    personal: 1,
    client: 2,
    confidential: 3,
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
        {sortedProjectsHandler().map((project: ProjectInterface) => {
          return <ProjectCard {...project} />;
        })}
      </div>
    </section>
  );
};
