"use client";

import { KeyContributionInterface, PATH, ProjectInterface } from "@/config";
import { Button } from "@/components";
import { useRouter } from "next/navigation";
import { translate } from "@/i18n";
import { Suspense, lazy } from "react";
import { ProjectCardSkeleton } from "..";

import * as Stack from "../../../config/stack";
import * as Mockup from "@/assets/mockups";

const LazyProjectCard = lazy(
  () => import("../components/project-card/project-card")
);

interface Data {
  type: "confidential" | "client" | "personal" | "tutorial";
}

/**
 * Generates an array of key contributions for a project.
 * @param {object} props - The properties object.
 * @param {number} props.count - The number of key contributions to generate.
 * @param {string} props.projectName - The name of the project.
 * @returns {KeyContributionInterface[]} An array of key contributions.
 */
const generateKeyContributions = (props: {
  count: number;
  projectName: string;
}): KeyContributionInterface[] => {
  return [...Array(props.count)].map((_, i) => ({
    name: translate(
      `projects.${props.projectName}.keyContributions.${i + 1}.name` as any
    ),
    description: translate(
      `projects.${props.projectName}.keyContributions.${
        i + 1
      }.description` as any
    ),
  }));
};

export const PROJECTS: ProjectInterface[] = [
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
    status: "completed",
    carousel: [
      {
        value: "1",
        image: Mockup.SiriusMockup1,
        name: "test01",
      },
      {
        value: "2",
        image: Mockup.SiriusMockup2,
        name: "test02",
      },
      {
        value: "3",
        image: Mockup.SiriusMockup3,
        name: "test03",
      },
      {
        value: "4",
        image: Mockup.SiriusMockup4,
        name: "test04",
      },
      {
        value: "5",
        image: Mockup.SiriusMockup5,
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
    keyContribution: generateKeyContributions({
      count: 14,
      projectName: "siriusWebpos",
    }),
  },
  // sirius mru
  {
    title: "Sirius MRU",
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
    projectId: "sirius-mru",
    status: "completed",
    carousel: [],
    stack: [],
    hidden: true,
  },
  // sirius pvc
  {
    title: "Sirius MRU",
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
    projectId: "sirius-pvc",
    status: "completed",
    carousel: [],
    stack: [],
    hidden: true,
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
    status: "completed",
    carousel: [
      {
        value: "1",
        image: Mockup.PaletteShift1,
        name: "palette-shift-mockup-1",
      },
      {
        value: "2",
        image: Mockup.PaletteShift2,
        name: "palette-shift-mockup-2",
      },
      {
        value: "3",
        image: Mockup.PaletteShift3,
        name: "palette-shift-mockup-3",
      },
      {
        value: "4",
        image: Mockup.PaletteShift4,
        name: "palette-shift-mockup-4",
      },
      {
        value: "5",
        image: Mockup.PaletteShift5,
        name: "palette-shift-mockup-5",
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
    keyContribution: generateKeyContributions({
      count: 3,
      projectName: "paletteShift",
    }),
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
        image: Mockup.IqmkMockup1,
        name: "test01",
      },
      {
        value: "2",
        image: Mockup.IqmkMockup2,
        name: "test02",
      },
      {
        value: "3",
        image: Mockup.IqmkMockup3,
        name: "test03",
      },
      {
        value: "4",
        image: Mockup.IqmkMockup4,
        name: "test04",
      },
      {
        value: "5",
        image: Mockup.IqmkMockup5,
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
    keyContribution: generateKeyContributions({
      count: 2,
      projectName: "iqmk",
    }),
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
        image: Mockup.MyPortfolio1,
        name: "my-portfolio-1",
      },
      {
        value: "2",
        image: Mockup.MyPortfolio2,
        name: "my-portfolio-2",
      },
      {
        value: "3",
        image: Mockup.MyPortfolio3,
        name: "my-portfolio-3",
      },
      {
        value: "4",
        image: Mockup.MyPortfolio4,
        name: "my-portfolio-4",
      },
      {
        value: "5",
        image: Mockup.MyPortfolio5,
        name: "my-portfolio-5",
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
    keyContribution: generateKeyContributions({
      count: 5,
      projectName: "myPortfolio",
    }),
  },
  // YooPH
  {
    title: "YooPH",
    company: "Mach95 Software Developer Corp.",
    date: new Date(),
    description: translate("projects.yoo.description"),
    category: [
      translate("projects.yoo.category.deliveryApp"),
      translate("projects.yoo.category.ecommerce"),
      translate("projects.yoo.category.admin"),
    ],
    previewUrl: "https://www.yoo.ph/login",
    codeUrl: undefined,
    type: "confidential",
    projectId: "yoo-ph",
    status: "completed",
    carousel: [
      {
        value: "1",
        image: Mockup.YooMockup1,
        name: "test01",
      },
      {
        value: "2",
        image: Mockup.YooMockup2,
        name: "test02",
      },
      {
        value: "3",
        image: Mockup.YooMockup3,
        name: "test03",
      },
      {
        value: "4",
        image: Mockup.YooMockup4,
        name: "test04",
      },
      {
        value: "5",
        image: Mockup.YooMockup5,
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
    keyContribution: generateKeyContributions({ count: 5, projectName: "yoo" }),
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
    status: "completed",
    carousel: [
      {
        value: "1",
        image: Mockup.HoobankMockup1,
        name: "hoobank-mockup-1",
      },
      {
        value: "2",
        image: Mockup.HoobankMockup2,
        name: "hoobank-mockup-2",
      },
      {
        value: "3",
        image: Mockup.HoobankMockup3,
        name: "hoobank-mockup-3",
      },
      {
        value: "4",
        image: Mockup.HoobankMockup4,
        name: "hoobank-mockup-4",
      },
      {
        value: "5",
        image: Mockup.HoobankMockup5,
        name: "hoobank-mockup-5",
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
    keyContribution: generateKeyContributions({
      count: 3,
      projectName: "hoobank",
    }),
  },
  // TODO:: Country Scape
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
    carousel: [],
    hidden: true,
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
  // pawfectly yours
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
    carousel: [],
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
    hidden: true,
  },
  // RL Portfolio
  {
    title: translate("projects.rlPortfolio.title"),
    company: undefined,
    date: new Date(),
    description: translate("projects.rlPortfolio.description"),
    category: [translate("projects.rlPortfolio.category.landing")],
    codeUrl:
      "https://github.com/javiergenepaul/rochenette-legaspina-portfolio-2025",
    previewUrl:
      "https://rochenette-legaspina-portfolio-2025.vercel.app/2025/en",
    type: "personal",
    projectId: "rl-portfolio",
    carousel: [
      {
        value: "1",
        image: Mockup.RLPortfolo1,
        name: "rl-portfolio-mockup-1",
      },
    ],
    stack: [
      Stack.NEXT_STACK,
      Stack.REACT_STACK,
      Stack.SHAD_CN_STACK,
      Stack.TYPESCRIPT_STACK,
      Stack.TAILWIND_STACK,
    ],
    status: "completed",
    hidden: false,
  },
  // Exo Portal
  {
    title: translate("projects.exoPortal.title"),
    company: undefined,
    date: new Date(),
    description: translate("projects.exoPortal.description"),
    category: [translate("projects.exoPortal.category.saas")],
    codeUrl: "https://github.com/exo-portal",
    previewUrl: undefined,
    type: "personal",
    projectId: "exo-portal",
    carousel: [],
    stack: [],
    status: "ongoing",
    hidden: true,
  },
  // Exo UI Portal Nuxt
  {
    title: translate("projects.exoPortal.ui.nuxt.title"),
    company: undefined,
    date: new Date(),
    description: translate("projects.exoPortal.ui.nuxt.description"),
    category: [translate("projects.exoPortal.ui.nuxt.category.saas")],
    codeUrl: "https://github.com/exo-portal",
    previewUrl: undefined,
    type: "personal",
    projectId: "exo-ui-nuxt",
    carousel: [],
    stack: [],
    status: "ongoing",
    hidden: true,
  },
  // Exo UI Portal Next
  {
    title: translate("projects.exoPortal.ui.next.title"),
    company: undefined,
    date: new Date(),
    description: translate("projects.exoPortal.ui.next.description"),
    category: [translate("projects.exoPortal.ui.next.category.saas")],
    codeUrl: "https://github.com/exo-portal/exo-ui-next",
    previewUrl: undefined,
    type: "personal",
    projectId: "exo-ui-next",
    carousel: [],
    stack: [],
    status: "completed",
    hidden: true,
  },
  // Exo Common Portal
  {
    title: translate("projects.exoPortal.common.title"),
    company: undefined,
    date: new Date(),
    description: translate("projects.exoPortal.common.description"),
    category: [translate("projects.exoPortal.common.category.saas")],
    codeUrl: "https://github.com/exo-portal/exo-common",
    previewUrl: undefined,
    type: "personal",
    projectId: "exo-common",
    carousel: [],
    stack: [],
    status: "completed",
    hidden: true,
  },
  // Exo Authentication Portal
  {
    title: translate("projects.exoPortal.auth.title"),
    company: undefined,
    date: new Date(),
    description: translate("projects.exoPortal.auth.description"),
    category: [translate("projects.exoPortal.auth.category.saas")],
    codeUrl: "https://github.com/exo-portal/exo-auth",
    previewUrl: undefined,
    type: "personal",
    projectId: "exo-auth",
    carousel: [],
    stack: [],
    status: "completed",
    hidden: true,
  },
];

export const ProjectSection = () => {
  const router = useRouter();

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
            router.push(PATH.PROJECTS.path);
          }}
        >
          {translate("projects.button.viewFullArchive")}
        </Button>
      </div>
    </section>
  );
};
