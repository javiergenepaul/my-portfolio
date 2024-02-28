import { translate } from "@/i18n";
import {
  NavLinkInterface,
  ServiceOfferInterface,
  SocialMediaLinksInterface,
} from "./types";
import * as url from "./url";

export const NAV_LINKS: NavLinkInterface[] = [
  {
    key: "services",
    name: translate("header.navLinks.services"),
    path: "#services",
    selectedId: "services",
  },
  {
    key: "projects",
    name: translate("header.navLinks.projects"),
    path: "#projects",
    selectedId: "projects",
  },
  {
    key: "contacts",
    name: translate("header.navLinks.contacts"),
    path: "#contacts",
    selectedId: "contacts",
  },
];

export const SOCIAL_MEDIA_LINKS: SocialMediaLinksInterface[] = [
  {
    key: "github",
    icon: "fa6-brands:square-github",
    title: translate("header.socialMediaLinks.github"),
    url: url.GITHUB_URL,
  },
  {
    key: "linkedIn",
    icon: "fa6-brands:linkedin",
    title: translate("header.socialMediaLinks.linkedIn"),
    url: url.LINKED_IN_URL,
  },
  {
    key: "upwork",
    icon: "fa6-brands:upwork",
    title: translate("header.socialMediaLinks.upwork"),
    url: url.UPWORK_URL,
  },
];

export const SERVICE_OFFER: ServiceOfferInterface[] = [
  {
    key: "frontend",
    title: translate("services.frontend.title"),
    description: translate("services.frontend.description"),
    stack: [
      {
        name: translate("services.stack.vite"),
        isFavorite: true,
        url: url.VITE_URL,
      },
      {
        name: translate("services.stack.react"),
        isFavorite: true,
        url: url.REACT_URL,
      },
      {
        name: translate("services.stack.typescript"),
        isFavorite: true,
        url: url.TYPESCRIPT_URL,
      },
      {
        name: translate("services.stack.javascript"),
        isFavorite: true,
        url: url.JAVASCRIPT_URL,
      },
      {
        name: translate("services.stack.html"),
        isFavorite: false,
        url: url.HTML_URL,
      },
      {
        name: translate("services.stack.css"),
        isFavorite: false,
        url: url.CSS_URL,
      },
      {
        name: translate("services.stack.tailwind"),
        isFavorite: true,
        url: url.TAILWIND_URL,
      },
      {
        name: translate("services.stack.shadCn"),
        isFavorite: true,
        url: url.SHAD_CN_URL,
      },
      {
        name: translate("services.stack.mui"),
        isFavorite: false,
        url: url.MUI_URL,
      },
      {
        name: translate("services.stack.chakraUi"),
        isFavorite: false,
        url: url.CHAKRA_URL,
      },
      {
        name: translate("services.stack.antDesign"),
        isFavorite: false,
        url: url.ANT_DESIGN_URL,
      },
      {
        name: translate("services.stack.nextUi"),
        isFavorite: false,
        url: url.NEXT_UI_URL,
      },
      {
        name: translate("services.stack.zustand"),
        isFavorite: true,
        url: url.ZUSTAND_URL,
      },
      {
        name: translate("services.stack.mobx"),
        isFavorite: false,
        url: url.MOBX_URL,
      },
      {
        name: translate("services.stack.chartJs"),
        isFavorite: false,
        url: url.CHART_JS,
      },
      {
        name: translate("services.stack.gsap"),
        isFavorite: true,
        url: url.GSAP_URL,
      },
      {
        name: translate("services.stack.threeJs"),
        isFavorite: true,
        url: url.THREE_JS_URL,
      },
      {
        name: translate("services.stack.framerMotion"),
        isFavorite: true,
        url: url.FRAMER_MOTION_URL,
      },
      {
        name: translate("services.stack.jest"),
        isFavorite: true,
        url: url.JEST_URL,
      },
      {
        name: translate("services.stack.enzyme"),
        isFavorite: true,
        url: url.ENZYME_URL,
      },
      {
        name: translate("services.stack.cypress"),
        isFavorite: true,
        url: url.CYPRESS_URL,
      },
      {
        name: translate("services.stack.i18n"),
        isFavorite: true,
        url: url.I18NEXT_URL,
      },
      {
        name: translate("services.stack.axios"),
        isFavorite: true,
        url: url.AXIOS_URL,
      },
      {
        name: translate("services.stack.reactQuery"),
        isFavorite: true,
        url: url.REACT_QUERY_URL,
      },
      {
        name: translate("services.stack.npm"),
        isFavorite: false,
        url: url.NPM_URL,
      },
      {
        name: translate("services.stack.pnpm"),
        isFavorite: true,
        url: url.PNPM_URL,
      },
      {
        name: translate("services.stack.yarn"),
        isFavorite: true,
        url: url.YARN_URL,
      },
    ],
  },
  {
    key: "backend",
    title: translate("services.backend.title"),
    description: translate("services.backend.description"),
    stack: [
      {
        name: translate("services.stack.springBoot"),
        isFavorite: true,
        url: url.SPRING_BOOT_URL,
      },
      {
        name: translate("services.stack.springSecurity"),
        isFavorite: true,
        url: url.SPRING_SECURITY_URL,
      },
      {
        name: translate("services.stack.springSecurityOAuth"),
        isFavorite: true,
        url: url.SPRING_SECURITY_OAUTH_URL,
      },
      {
        name: translate("services.stack.springJDBC"),
        isFavorite: true,
        url: url.SPRING_JDBC_URL,
      },
      {
        name: translate("services.stack.api"),
        isFavorite: true,
        url: url.SPRING_REST_URL,
      },
      {
        name: translate("services.stack.jwt"),
        isFavorite: true,
        url: url.JWT_URL,
      },
      {
        name: translate("services.stack.java"),
        isFavorite: true,
        url: url.JAVA_URL,
      },
      {
        name: translate("services.stack.mySQL"),
        isFavorite: true,
        url: url.MYSQL_URL,
      },
      {
        name: translate("services.stack.junit"),
        isFavorite: false,
        url: url.JUNIT_URL,
      },
      {
        name: translate("services.stack.mockito"),
        isFavorite: false,
        url: url.MOCKITO_URL,
      },

      {
        name: translate("services.stack.postman"),
        isFavorite: false,
        url: url.POSTMAN_URL,
      },
      {
        name: translate("services.stack.linux"),
        isFavorite: false,
        url: url.LINUX_URL,
      },
      {
        name: translate("services.stack.azure"),
        isFavorite: false,
        url: url.AZURE_URL,
      },
      {
        name: translate("services.stack.aws"),
        isFavorite: false,
        url: url.AWS_URL,
      },
      {
        name: translate("services.stack.azurePipelineAgent"),
        isFavorite: false,
        url: url.AZURE_PIPELINE_AGENT_URL,
      },
      {
        name: translate("services.stack.firebase"),
        isFavorite: false,
        url: url.FIREBASE_URL,
      },
      {
        name: translate("services.stack.git"),
        isFavorite: false,
        url: url.GIT_URL,
      },
      {
        name: translate("services.stack.nginx"),
        isFavorite: false,
        url: url.NGINX_URL,
      },
      {
        name: translate("services.stack.centOS"),
        isFavorite: false,
        url: url.CENT_OS_URL,
      },
      {
        name: translate("services.stack.netlify"),
        isFavorite: false,
        url: url.NETLIFY_URL,
      },
      {
        name: translate("services.stack.heroku"),
        isFavorite: false,
        url: url.HEROKU_URL,
      },
    ],
  },
  {
    key: "ui",
    title: translate("services.designImplementation.title"),
    description: translate("services.designImplementation.description"),
    stack: [
      {
        name: translate("services.stack.figma"),
        isFavorite: true,
        url: url.FIGMA_URL,
      },
      {
        name: translate("services.stack.frontend"),
        isFavorite: false,
        url: undefined,
      },
    ],
  },
];

export const TYPE_ROLES: string[] = [
  translate("header.typeRole.fullStack"),
  translate("header.typeRole.reactTypescript"),
  translate("header.typeRole.springBoot"),
  translate("header.typeRole.uiuxAdvocate"),
  translate("header.typeRole.uiLibraryEnthusiasts"),
];
