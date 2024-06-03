import { PATH, ProjectInterface } from "@/config";
import { Button } from "@/components";
import { useNavigate } from "react-router-dom";
import { translate } from "@/i18n";
import * as Stack from "../../../config/stack";
import { Suspense, lazy } from "react";
import { ProjectCardSkeleton } from "..";
import {
  ProjectTest01,
  ProjectTest02,
  ProjectTest03,
  ProjectTest04,
  ProjectTest05,
} from "@/assets";
import {
  MyPortfolio1,
  MyPortfolio2,
  MyPortfolio3,
  MyPortfolio4,
  MyPortfolio5,
} from "@/assets/mockups";

const LazyProjectCard = lazy(
  () => import("../components/project-card/project-card")
);

interface Data {
  type: "confidential" | "client" | "personal" | "tutorial";
}

export const PROJECTS: ProjectInterface[] = [
  // YooPH
  {
    title: "YooPH",
    company: "Mach95 Software Developer Corp.",
    date: new Date(),
    description: translate("projects.yoo.description"),
    category: ["delivery app", "ecommerce", "admin dashboard"],
    previewUrl: "https://www.yoo.ph/login",
    codeUrl: undefined,
    type: "confidential",
    projectId: "yoo-ph",
    carousel: [
      {
        value: "1",
        image: ProjectTest01,
        name: "test01",
      },
      {
        value: "2",
        image: ProjectTest02,
        name: "test02",
      },
      {
        value: "3",
        image: ProjectTest03,
        name: "test03",
      },
      {
        value: "4",
        image: ProjectTest04,
        name: "test04",
      },
      {
        value: "5",
        image: ProjectTest05,
        name: "test05",
      },
    ],
    stack: [
      Stack.LARAVEL_STACK,
      Stack.PHP_STACK,
      Stack.BLADE_STACK,
      Stack.BOOTSTRAP_STACK,
      Stack.JQUERY_STACK,
      Stack.JAVASCRIPT_STACK,
      Stack.MVC_STACK,
      Stack.GIT_STACK,
    ],
    status: "completed",
  },
  // Sirius Webpos
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
    projectId: "sirius-webpos",
    carousel: [
      {
        value: "1",
        image: ProjectTest01,
        name: "test01",
      },
      {
        value: "2",
        image: ProjectTest02,
        name: "test02",
      },
      {
        value: "3",
        image: ProjectTest03,
        name: "test03",
      },
      {
        value: "4",
        image: ProjectTest04,
        name: "test04",
      },
      {
        value: "5",
        image: ProjectTest05,
        name: "test05",
      },
    ],
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
      Stack.GIT_STACK,
      Stack.REACT_ROUTER_STACK,
    ],
    status: "ongoing",
  },
  // Unified Youth
  {
    title: translate("projects.unifiedYouth.title"),
    company: translate("projects.unifiedYouth.company"),
    date: new Date(),
    description: translate("projects.unifiedYouth.description"),
    category: [translate("projects.unifiedYouth.category.admin")],
    previewUrl: undefined,
    codeUrl: "https://github.com/orgs/Unified-Youth/repositories",
    type: "client",
    projectId: "unified-youth",
    carousel: [
      {
        value: "1",
        image: ProjectTest01,
        name: "test01",
      },
      {
        value: "2",
        image: ProjectTest02,
        name: "test02",
      },
      {
        value: "3",
        image: ProjectTest03,
        name: "test03",
      },
      {
        value: "4",
        image: ProjectTest04,
        name: "test04",
      },
      {
        value: "5",
        image: ProjectTest05,
        name: "test05",
      },
    ],
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
      Stack.REACT_ROUTER_STACK,
    ],
    status: "ongoing",
  },
  // Country Scape
  {
    title: translate("projects.countryScape.title"),
    company: translate("projects.countryScape.company"),
    date: new Date(),
    description: translate("projects.countryScape.description"),
    category: [translate("projects.countryScape.category.booking")],
    codeUrl: "https://github.com/javiergenepaul/country-scape",
    previewUrl: undefined,
    type: "personal",
    projectId: "country-scape",
    carousel: [
      {
        value: "1",
        image: ProjectTest01,
        name: "test01",
      },
      {
        value: "2",
        image: ProjectTest02,
        name: "test02",
      },
      {
        value: "3",
        image: ProjectTest03,
        name: "test03",
      },
      {
        value: "4",
        image: ProjectTest04,
        name: "test04",
      },
      {
        value: "5",
        image: ProjectTest05,
        name: "test05",
      },
    ],
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
    status: "completed",
  },
  // Hoobank
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
    projectId: "hoobank",
    carousel: [
      {
        value: "1",
        image: ProjectTest01,
        name: "test01",
      },
      {
        value: "2",
        image: ProjectTest02,
        name: "test02",
      },
      {
        value: "3",
        image: ProjectTest03,
        name: "test03",
      },
      {
        value: "4",
        image: ProjectTest04,
        name: "test04",
      },
      {
        value: "5",
        image: ProjectTest05,
        name: "test05",
      },
    ],
    stack: [
      Stack.VITE_STACK,
      Stack.REACT_STACK,
      Stack.VITEST_STACK,
      Stack.JAVASCRIPT_STACK,
      Stack.TAILWIND_STACK,
      Stack.NETLIFY_STACK,
      Stack.LANDING_PAGE_STACK,
    ],
    status: "completed",
  },
  // IQMK
  {
    title: translate("projects.iqmk.title"),
    company: translate("projects.iqmk.company"),
    date: new Date(),
    description: translate("projects.iqmk.description"),
    category: [translate("projects.iqmk.category.landing")],
    previewUrl: "https://iqmk-demo.netlify.app/",
    codeUrl: "https://github.com/javiergenepaul/IQMK-tailwind",
    type: "confidential",
    projectId: "iqmk",
    carousel: [
      {
        value: "1",
        image: ProjectTest01,
        name: "test01",
      },
      {
        value: "2",
        image: ProjectTest02,
        name: "test02",
      },
      {
        value: "3",
        image: ProjectTest03,
        name: "test03",
      },
      {
        value: "4",
        image: ProjectTest04,
        name: "test04",
      },
      {
        value: "5",
        image: ProjectTest05,
        name: "test05",
      },
    ],
    stack: [
      Stack.HTML_STACK,
      Stack.TAILWIND_STACK,
      Stack.FIGMA_STACK,
      Stack.JQUERY_STACK,
      Stack.JAVASCRIPT_STACK,
      Stack.LANDING_PAGE_STACK,
      Stack.NETLIFY_STACK,
    ],
    status: "completed",
  },
  // Pawfectly Yours
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
    projectId: "pawfectly-yours",
    carousel: [
      {
        value: "1",
        image: ProjectTest01,
        name: "test01",
      },
      {
        value: "2",
        image: ProjectTest02,
        name: "test02",
      },
      {
        value: "3",
        image: ProjectTest03,
        name: "test03",
      },
      {
        value: "4",
        image: ProjectTest04,
        name: "test04",
      },
      {
        value: "5",
        image: ProjectTest05,
        name: "test05",
      },
    ],
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
      Stack.REACT_ROUTER_STACK,
    ],
    status: "completed",
  },
  // My portfolio
  {
    title: translate("projects.myPortfolio.title"),
    company: undefined,
    date: new Date("2024-02-22"),
    description: translate("projects.myPortfolio.description"),
    category: [
      translate("projects.myPortfolio.category.landing"),
      translate("projects.myPortfolio.category.portfolioWebsite"),
    ],
    codeUrl: "https://github.com/javiergenepaul/my-portfolio",
    previewUrl: "https://paul-javier-portfolio.netlify.app/",
    type: "personal",
    projectId: "my-portfolio",
    carousel: [
      {
        value: "1",
        image: MyPortfolio1,
        name: "test01",
      },
      {
        value: "2",
        image: MyPortfolio2,
        name: "test02",
      },
      {
        value: "3",
        image: MyPortfolio3,
        name: "test03",
      },
      {
        value: "4",
        image: MyPortfolio4,
        name: "test04",
      },
      {
        value: "5",
        image: MyPortfolio5,
        name: "test05",
      },
    ],
    stack: [
      Stack.VITE_STACK,
      Stack.REACT_STACK,
      Stack.TYPESCRIPT_STACK,
      Stack.TAILWIND_STACK,
      Stack.SHAD_CN_STACK,
      Stack.ZUSTAND_STACK,
      Stack.NETLIFY_STACK,
      Stack.FIGMA_STACK,
      Stack.THREE_JS_STACK,
      Stack.FRAMER_MOTION_STACK,
      Stack.I18N_STACK,
      Stack.PNPM_STACK,
      Stack.LANDING_PAGE_STACK,
      Stack.FIGMA_TO_REACT_STACK,
      Stack.PIXEL_PERFECT_STACK,
      Stack.REACT_ROUTER_STACK,
      Stack.VITEST_STACK,
    ],
    status: "completed",
  },
  // Palette Shift
  {
    title: translate("projects.paletteShift.title"),
    description: translate("projects.paletteShift.description"),
    company: undefined,
    date: new Date("2024-03-17"),
    type: "personal",
    projectId: "palette-shift",
    codeUrl: "https://github.com/javiergenepaul/Palette-Shift.git",
    previewUrl: "https://palette-shift.netlify.app/",
    carousel: [
      {
        value: "1",
        image: ProjectTest01,
        name: "test01",
      },
      {
        value: "2",
        image: ProjectTest02,
        name: "test02",
      },
      {
        value: "3",
        image: ProjectTest03,
        name: "test03",
      },
      {
        value: "4",
        image: ProjectTest04,
        name: "test04",
      },
      {
        value: "5",
        image: ProjectTest05,
        name: "test05",
      },
    ],
    category: [
      translate("projects.paletteShift.category.webDevelopment"),
      translate("projects.paletteShift.category.local"),
      translate("projects.paletteShift.category.international"),
      translate("projects.paletteShift.category.accessibility"),
      translate("projects.paletteShift.category.tools"),
      translate("projects.paletteShift.category.libraries"),
    ],
    stack: [
      Stack.VITE_STACK,
      Stack.REACT_STACK,
      Stack.TYPESCRIPT_STACK,
      Stack.TAILWIND_STACK,
      Stack.SHAD_CN_STACK,
      Stack.ZUSTAND_STACK,
      Stack.NETLIFY_STACK,
      Stack.I18N_STACK,
      Stack.PNPM_STACK,
      Stack.LANDING_PAGE_STACK,
      Stack.VITEST_STACK,
      Stack.CSS_STACK,
    ],
    status: "completed",
  },
];

export const ProjectSection = () => {
  const navigate = useNavigate();

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
