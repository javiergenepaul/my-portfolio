import { PATH, ProjectInterface } from "@/config";
import { Button } from "@/components";
import { useNavigate } from "react-router-dom";
import { translate } from "@/i18n";
import * as Stack from "../../../config/stack";
import { Suspense, lazy } from "react";
import { ProjectCardSkeleton } from "..";

const LazyProjectCard = lazy(
  () => import("../components/project-card/project-card")
);

interface Data {
  type: "confidential" | "client" | "personal" | "tutorial";
}

export const ProjectSection = () => {
  const navigate = useNavigate();

  const PROJECTS: ProjectInterface[] = [
    {
      title: "YooPH",
      company: "Mach95 Software Developer Corp.",
      date: new Date(),
      description: translate("projects.yoo.description"),
      category: ["delivery app", "ecommerce", "admin dashboard"],
      previewUrl: "https://www.yoo.ph/login",
      codeUrl: undefined,
      type: "confidential",
      image64: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?",
      imageName: "Yoo PH Preview",
      stack: [
        Stack.LARAVEL_STACK,
        Stack.PHP_STACK,
        Stack.BLADE_STACK,
        Stack.BOOTSTRAP_STACK,
        Stack.JQUERY_STACK,
        Stack.JAVASCRIPT_STACK,
        Stack.MVC_STACK,
      ],
    },
    {
      title: translate("projects.siriusWebpos.title"),
      company: translate("projects.siriusWebpos.company"),
      date: new Date(),
      description: translate("projects.siriusWebpos.description"),
      category: [
        translate("projects.siriusWebpos.category.admin"),
        translate("projects.siriusWebpos.category.webPos"),
      ],
      previewUrl: undefined,
      codeUrl: undefined,
      type: "confidential",
      image64: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?",
      imageName: translate("projects.siriusWebpos.imageName"),
      stack: [
        Stack.SPRING_BOOT_STACK,
        Stack.SPRING_API_STACK,
        Stack.SPRING_SECURITY_STACK,
        Stack.SPRING_JDBC_STACK,
        Stack.SPRING_API_STACK,
        Stack.VITE_STACK,
        Stack.JAVA_STACK,
        Stack.JWT_STACK,
        Stack.REACT_STACK,
        Stack.TYPESCRIPT_STACK,
        Stack.MOBX_STACK,
        Stack.ANT_DESIGN_STACK,
        Stack.I18N_STACK,
        Stack.AXIOS_STACK,
        Stack.CSS_STACK,
        Stack.LINUX_STACK,
        Stack.AZURE_STACK,
        Stack.AZURE_PIPELINE_AGENT_STACK,
        Stack.JEST_STACK,
        Stack.CYPRESS_STACK,
        Stack.CENTOS_STACK,
      ],
    },
    {
      title: translate("projects.unifiedYouth.title"),
      company: translate("projects.unifiedYouth.company"),
      date: new Date(),
      description: translate("projects.unifiedYouth.description"),
      category: [translate("projects.unifiedYouth.category.admin")],
      previewUrl: undefined,
      codeUrl: "https://github.com/orgs/Unified-Youth/repositories",
      type: "client",
      image64: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?",
      imageName: translate("projects.unifiedYouth.imageName"),
      stack: [
        Stack.SPRING_BOOT_STACK,
        Stack.SPRING_API_STACK,
        Stack.SPRING_JDBC_STACK,
        Stack.SPRING_SECURITY_STACK,
        Stack.JWT_STACK,
        Stack.SPRING_SECURITY_STACK,
        Stack.JUNIT_STACK,
        Stack.JAVA_STACK,
        Stack.VITE_STACK,
        Stack.REACT_STACK,
        Stack.SHAD_CN_STACK,
        Stack.TAILWIND_STACK,
        Stack.I18N_STACK,
        Stack.REACT_QUERY_STACK,
        Stack.AXIOS_STACK,
        Stack.AWS_STACK,
        Stack.FIGMA_STACK,
        Stack.VITEST_STACK,
        Stack.MICROSERVICES_STACK,
        Stack.I18N_STACK,
      ],
    },
    {
      title: translate("projects.countryScape.title"),
      company: translate("projects.countryScape.company"),
      date: new Date(),
      description: translate("projects.countryScape.description"),
      category: [translate("projects.countryScape.category.booking")],
      codeUrl: "https://github.com/javiergenepaul/country-scape",
      previewUrl: undefined,
      type: "personal",
      image64: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?",
      imageName: translate("projects.countryScape.imageName"),
      stack: [
        Stack.REACT_STACK,
        Stack.TYPESCRIPT_STACK,
        Stack.SHAD_CN_STACK,
        Stack.FIGMA_STACK,
        Stack.LANDING_PAGE_STACK,
        Stack.TAILWIND_STACK,
        Stack.NETLIFY_STACK,
        Stack.I18N_STACK,
      ],
    },
    {
      title: translate("projects.hoobank.title"),
      company: undefined,
      date: new Date(),
      description: translate("projects.hoobank.description"),
      category: [translate("projects.hoobank.category.landing")],
      previewUrl: "https://javz-hoobank-code-along-tutorial.netlify.app/",
      codeUrl:
        "https://github.com/javiergenepaul/hoobank-react-tailwind-yt-tutorial",
      type: "tutorial",
      image64: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?",
      imageName: translate("projects.hoobank.imageName"),
      stack: [
        Stack.VITE_STACK,
        Stack.REACT_STACK,
        Stack.VITEST_STACK,
        Stack.JAVASCRIPT_STACK,
        Stack.TAILWIND_STACK,
        Stack.NETLIFY_STACK,
        Stack.LANDING_PAGE_STACK,
      ],
    },
    {
      title: translate("projects.iqmk.title"),
      company: translate("projects.iqmk.company"),
      date: new Date(),
      description: translate("projects.iqmk.description"),
      category: [translate("projects.iqmk.category.landing")],
      previewUrl: "https://iqmk-demo.netlify.app/",
      codeUrl: "https://github.com/javiergenepaul/IQMK-tailwind",
      type: "confidential",
      image64: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?",
      imageName: translate("projects.iqmk.imageName"),
      stack: [
        Stack.HTML_STACK,
        Stack.TAILWIND_STACK,
        Stack.FIGMA_STACK,
        Stack.JQUERY_STACK,
        Stack.JAVASCRIPT_STACK,
        Stack.LANDING_PAGE_STACK,
        Stack.NETLIFY_STACK,
      ],
    },
    {
      title: translate("projects.pawfectlyYours.title"),
      company: undefined,
      date: new Date(),
      description: translate("projects.pawfectlyYours.description"),
      category: [
        translate("projects.pawfectlyYours.category.ecommerce"),
        translate("projects.pawfectlyYours.category.landing"),
      ],
      codeUrl: "https://github.com/javiergenepaul/pawfectly-yours",
      previewUrl: undefined,
      type: "personal",
      image64: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?",
      imageName: translate("projects.pawfectlyYours.imageName"),
      stack: [
        Stack.SPRING_BOOT_STACK,
        Stack.SPRING_API_STACK,
        Stack.SPRING_JDBC_STACK,
        Stack.SPRING_OAUTH_STACK,
        Stack.SPRING_SECURITY_STACK,
        Stack.JWT_STACK,
        Stack.REACT_STACK,
        Stack.SHAD_CN_STACK,
        Stack.TYPESCRIPT_STACK,
        Stack.TAILWIND_STACK,
        Stack.HEROKU_STACK,
        Stack.MICROSERVICES_STACK,
      ],
    },
  ];

  const priorityOrder: { [key in Data["type"]]: number } = {
    client: 1,
    confidential: 2,
    personal: 3,
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
      <div className="flex flex-col gap-8">
        {sortedProjectsHandler().map(
          (project: ProjectInterface, index: React.Key) => (
            <Suspense key={index} fallback={<ProjectCardSkeleton />}>
              <LazyProjectCard key={index} {...project} />
            </Suspense>
          )
        )}
      </div>
      <div className="flex justify-end pt-8 w-fulls">
        <Button
          className="select-none"
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
