"use client";

import { PATH, ProjectInterface } from "@/config";
import { Button } from "@/components";
import { useRouter } from "next/navigation";
import { translate, useLocaleRefresh } from "@/i18n";
import { useLanguageStore } from "@/stores/language-store";
import { useContent } from "@/lib/content/use-content";
import { rowsToProjects } from "@/lib/content/portfolio";
import { triggerNavigationStart } from "@/components/common/navigation/NavigationProgress";
import { Suspense, lazy } from "react";
import { ProjectCardSkeleton } from "..";

const LazyProjectCard = lazy(
  () => import("../components/project-card/project-card"),
);

export const ProjectSection = () => {
  useLocaleRefresh();
  const router = useRouter();
  const locale = useLanguageStore((s) => s.language);

  const priorityOrder: { [key: string]: number } = {
    client: 1,
    confidential: 2,
    personal: 3,
    tutorial: 4,
  };

  const projects = rowsToProjects(
    useContent("projects"),
    useContent("skills"),
    locale,
  );
  const sortedProjects = (): ProjectInterface[] =>
    [...projects].sort((a, b) => priorityOrder[a.type] - priorityOrder[b.type]);

  return (
    <section
      id="projects"
      className="pt-16 h-fit section snap-start lg:pt-24 lg:px-4"
      aria-label="Projects"
    >
      <div className="flex flex-col gap-8">
        {sortedProjects().map((project: ProjectInterface, index: React.Key) => (
          <Suspense key={index} fallback={<ProjectCardSkeleton />}>
            <LazyProjectCard key={index} {...project} />
          </Suspense>
        ))}
      </div>
      <div className="flex justify-end pt-8 w-fulls">
        <Button
          className="select-none"
          variant={"link"}
          onClick={() => {
            triggerNavigationStart();
            router.push(PATH.PROJECTS.path);
          }}
        >
          {translate("projects.button.viewFullArchive")}
        </Button>
      </div>
    </section>
  );
};
