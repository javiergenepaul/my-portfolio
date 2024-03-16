import moment from "moment";
import { TechStackInterface } from "./types";
import * as url from "./url";
import * as StackIcon from "@/assets/stack-icon";

// BACKEND STACK
export const SPRING_BOOT_STACK: TechStackInterface = {
  name: "springBoot",
  isFavorite: true,
  url: url.SPRING_BOOT_URL,
  rate: 8,
  dateStarted: moment("2022-12-12"),
  dateEnded: "present",
  isStudying: false,
  icon: StackIcon.SpringBootStackIcon,
};

export const SPRING_SECURITY_STACK: TechStackInterface = {
  name: "springSecurity",
  isFavorite: true,
  url: url.SPRING_BOOT_URL,
  rate: 8,
  dateStarted: moment("2022-12-12"),
  dateEnded: "present",
  isStudying: false,
  icon: StackIcon.SpringSecurityStackIcon,
};

export const SPRING_OAUTH_STACK: TechStackInterface = {
  name: "springSecurityOAuth",
  isFavorite: true,
  url: url.SPRING_SECURITY_OAUTH_URL,
  rate: 8,
  dateStarted: moment("2022-12-12"),
  dateEnded: "present",
  isStudying: true,
  icon: StackIcon.SpringOauthStackIcon,
};

export const SPRING_JDBC_STACK: TechStackInterface = {
  name: "springJDBC",
  isFavorite: true,
  url: url.SPRING_JDBC_URL,
  rate: 8,
  dateStarted: moment("2022-12-12"),
  dateEnded: "present",
  isStudying: false,
  icon: StackIcon.SpringJDBCStackIcon,
};

export const SPRING_API_STACK: TechStackInterface = {
  name: "api",
  isFavorite: true,
  url: url.SPRING_REST_URL,
  rate: 8,
  dateStarted: moment("2022-12-12"),
  dateEnded: "present",
  isStudying: false,
  icon: StackIcon.ApiStackIcon,
};

export const JWT_STACK: TechStackInterface = {
  name: "jwt",
  isFavorite: true,
  url: url.JWT_URL,
  rate: 8,
  dateStarted: moment("2022-12-12"),
  dateEnded: "present",
  isStudying: false,
};

export const JAVA_STACK: TechStackInterface = {
  name: "java",
  isFavorite: true,
  url: url.JAVA_URL,
  rate: 8,
  dateStarted: moment("2022-12-01"),
  dateEnded: "present",
  isStudying: false,
  icon: StackIcon.JavaStackIcon,
};

export const MYSQL_STACK: TechStackInterface = {
  name: "mySQL",
  isFavorite: true,
  url: url.MYSQL_URL,
  rate: 8,
  dateStarted: moment("2022-12-01"),
  dateEnded: "present",
  isStudying: false,
  icon: StackIcon.MySQLStackIcon,
};

export const JUNIT_STACK: TechStackInterface = {
  name: "junit",
  isFavorite: false,
  url: url.JUNIT_URL,
  rate: 5,
  dateStarted: moment("2024-02-01"),
  dateEnded: "present",
  isStudying: true,
};

export const MOCKITO_STACK: TechStackInterface = {
  name: "mockito",
  isFavorite: false,
  url: url.MOCKITO_URL,
  rate: 5,
  dateStarted: moment("2024-02-01"),
  dateEnded: "present",
  isStudying: true,
};

export const POSTMAN_STACK: TechStackInterface = {
  name: "postman",
  isFavorite: true,
  url: url.POSTMAN_URL,
  rate: 10,
  dateStarted: moment("2021-08-01"),
  dateEnded: "present",
  isStudying: false,
  icon: StackIcon.PostmanStackIcon,
};

export const LINUX_STACK: TechStackInterface = {
  name: "linux",
  isFavorite: false,
  url: url.LINUX_URL,
  rate: 8,
  dateStarted: moment("2021-08-01"),
  dateEnded: "present",
  isStudying: false,
  icon: StackIcon.LinuxStackIcon,
};

export const AZURE_STACK: TechStackInterface = {
  name: "azure",
  isFavorite: false,
  url: url.AZURE_URL,
  rate: 5,
  dateStarted: moment("2023-02-01"),
  dateEnded: "present",
  isStudying: true,
  icon: StackIcon.AzureStackIcon,
};

export const AWS_STACK: TechStackInterface = {
  name: "aws",
  isFavorite: false,
  url: url.AWS_URL,
  rate: 5,
  dateStarted: moment("2023-03-01"),
  dateEnded: "present",
  isStudying: true,
};

export const AZURE_PIPELINE_AGENT_STACK: TechStackInterface = {
  name: "azurePipelineAgent",
  isFavorite: false,
  url: url.AZURE_PIPELINE_AGENT_URL,
  rate: 5,
  dateStarted: moment("2023-02-01"),
  dateEnded: "present",
  isStudying: true,
};

export const FIREBASE_STACK: TechStackInterface = {
  name: "firebase",
  isFavorite: false,
  url: url.FIREBASE_URL,
  rate: 5,
  dateStarted: moment("2021-08-01"),
  dateEnded: moment("2022-12-12"),
  isStudying: false,
  icon: StackIcon.FirebaseStackIcon,
};

export const GIT_STACK: TechStackInterface = {
  name: "git",
  isFavorite: false,
  url: url.GIT_URL,
  rate: 8,
  dateStarted: moment("2021-08-01"),
  dateEnded: "present",
  isStudying: false,
  icon: StackIcon.GitStackIcon,
};

export const NGINX_STACK: TechStackInterface = {
  name: "nginx",
  isFavorite: false,
  url: url.NGINX_URL,
  rate: 5,
  dateStarted: moment("2023-02-01"),
  dateEnded: "present",
  isStudying: true,
  icon: StackIcon.NginxStackIcon,
};

export const CENTOS_STACK: TechStackInterface = {
  name: "centOS",
  isFavorite: false,
  url: url.CENT_OS_URL,
  rate: 5,
  dateStarted: moment("2023-02-01"),
  dateEnded: "present",
  isStudying: true,
  icon: StackIcon.CentosStackIcon,
};

export const NETLIFY_STACK: TechStackInterface = {
  name: "netlify",
  isFavorite: false,
  url: url.NETLIFY_URL,
  rate: 10,
  dateStarted: moment("2024-03-01"),
  dateEnded: "present",
  isStudying: false,
  icon: StackIcon.NetlifyStackIcon,
};

export const HEROKU_STACK: TechStackInterface = {
  name: "heroku",
  isFavorite: false,
  url: url.HEROKU_URL,
  rate: 5,
  dateStarted: moment(),
  dateEnded: "present",
  isStudying: true,
};

export const LARAVEL_STACK: TechStackInterface = {
  name: "laravel",
  isFavorite: false,
  url: url.LARAVEL_URL,
  rate: 7,
  dateStarted: moment("2021-08-01"),
  dateEnded: moment("2022-12-12"),
  isStudying: false,
  icon: StackIcon.LaravelStackIcon,
};

export const PHP_STACK: TechStackInterface = {
  name: "php",
  isFavorite: false,
  url: url.PHP_URL,
  rate: 7,
  dateStarted: moment("2021-08-01"),
  dateEnded: moment("2022-12-12"),
  isStudying: false,
  icon: StackIcon.PHPStackIcon,
};

export const BOOTSTRAP_STACK: TechStackInterface = {
  name: "bootstrap",
  isFavorite: false,
  url: url.BOOTSTRAP_URL,
  rate: 8,
  dateStarted: moment("2021-08-01"),
  dateEnded: moment("2022-12-12"),
  isStudying: false,
};

export const MVC_STACK: TechStackInterface = {
  name: "mvc",
  isFavorite: false,
  url: undefined,
  rate: 9,
  dateStarted: moment("2021-08-01"),
  dateEnded: moment("2022-12-12"),
  isStudying: false,
  icon: StackIcon.MVCStackIcon,
};

// FRONT END STACK
export const VITE_STACK: TechStackInterface = {
  name: "vite",
  isFavorite: true,
  url: url.VITE_URL,
  rate: 9,
  dateStarted: moment("2022-06-01"),
  dateEnded: "present",
  isStudying: false,
  icon: StackIcon.ViteStackIcon,
};

export const REACT_STACK: TechStackInterface = {
  name: "react",
  isFavorite: true,
  url: url.REACT_URL,
  rate: 10,
  dateStarted: moment("2022-06-01"),
  dateEnded: "present",
  isStudying: false,
  icon: StackIcon.ReactStackIcon,
};

export const TYPESCRIPT_STACK: TechStackInterface = {
  name: "typescript",
  isFavorite: true,
  url: url.TYPESCRIPT_URL,
  rate: 10,
  dateStarted: moment("2022-12-12"),
  dateEnded: "present",
  isStudying: false,
  icon: StackIcon.TypeScriptStackIcon,
};

export const JAVASCRIPT_STACK: TechStackInterface = {
  name: "javascript",
  isFavorite: true,
  url: url.JAVASCRIPT_URL,
  rate: 10,
  dateStarted: moment("2021-08-01"),
  dateEnded: "present",
  isStudying: false,
  icon: StackIcon.JavaScriptStackIcon,
};

export const HTML_STACK: TechStackInterface = {
  name: "html",
  isFavorite: false,
  url: url.HTML_URL,
  rate: 10,
  dateStarted: moment("2021-08-01"),
  dateEnded: "present",
  isStudying: false,
  icon: StackIcon.HtmlStackIcon,
};

export const CSS_STACK: TechStackInterface = {
  name: "css",
  isFavorite: false,
  url: url.CSS_URL,
  rate: 9,
  dateStarted: moment("2021-08-01"),
  dateEnded: "present",
  isStudying: false,
  icon: StackIcon.CssStackIcon,
};

export const JQUERY_STACK: TechStackInterface = {
  name: "jquery",
  isFavorite: false,
  url: url.JQUERY_URL,
  rate: 9,
  dateStarted: moment("2021-08-01"),
  dateEnded: moment("2022-12-12"),
  isStudying: false,
  icon: StackIcon.JqueryStackIcon,
};

export const BLADE_STACK: TechStackInterface = {
  name: "blade",
  isFavorite: false,
  url: url.BLADE_URL,
  rate: 8,
  dateStarted: moment("2021-08-01"),
  dateEnded: moment("2022-12-12"),
  isStudying: false,
  icon: StackIcon.LaravelStackIcon,
};

export const TAILWIND_STACK: TechStackInterface = {
  name: "tailwind",
  isFavorite: true,
  url: url.TAILWIND_URL,
  rate: 10,
  dateStarted: moment("2022-06-01"),
  dateEnded: "present",
  isStudying: false,
  icon: StackIcon.TailwindStackIcon,
};

export const SHAD_CN_STACK: TechStackInterface = {
  name: "shadCn",
  isFavorite: true,
  url: url.SHAD_CN_URL,
  rate: 8,
  dateStarted: moment("2024-02-01"),
  dateEnded: "present",
  isStudying: false,
  icon: StackIcon.ShadCNStackIcon,
};

export const MUI_STACK: TechStackInterface = {
  name: "mui",
  isFavorite: false,
  url: url.MUI_URL,
  rate: 6,
  dateStarted: moment("2022-06-01"),
  dateEnded: moment("2022-12-01"),
  isStudying: false,
  icon: StackIcon.MUIStackIcon,
};

export const CHAKRA_STACK: TechStackInterface = {
  name: "chakraUi",
  isFavorite: false,
  url: url.CHAKRA_URL,
  rate: 6,
  dateStarted: moment("2022-06-01"),
  dateEnded: moment("2022-12-01"),
  isStudying: false,
  icon: StackIcon.ChakraUIStackIcon,
};

export const ANT_DESIGN_STACK: TechStackInterface = {
  name: "antDesign",
  isFavorite: false,
  url: url.ANT_DESIGN_URL,
  rate: 8,
  dateStarted: moment("2022-12-12"),
  dateEnded: "present",
  isStudying: false,
  icon: StackIcon.AntDesignStackIcon,
};

export const NEXT_UI_STACK: TechStackInterface = {
  name: "nextUi",
  isFavorite: false,
  url: url.NEXT_UI_URL,
  rate: 5,
  dateStarted: moment("2024-02-01"),
  dateEnded: moment("2024-03-01"),
  isStudying: false,
};

export const ZUSTAND_STACK: TechStackInterface = {
  name: "zustand",
  isFavorite: true,
  url: url.ZUSTAND_URL,
  rate: 8,
  dateStarted: moment("2024-02-01"),
  dateEnded: "present",
  isStudying: false,
  icon: StackIcon.ZustandStackIcon,
};

export const MOBX_STACK: TechStackInterface = {
  name: "mobx",
  isFavorite: false,
  url: url.MOBX_URL,
  rate: 8,
  dateStarted: moment("2022-12-12"),
  dateEnded: "present",
  isStudying: false,
  icon: StackIcon.MobxStackIcon,
};

export const CHART_JS_STACK: TechStackInterface = {
  name: "chartJs",
  isFavorite: false,
  url: url.CHART_JS,
  rate: 6,
  dateStarted: moment("2023-01-01"),
  dateEnded: moment("2024-02-01"),
  isStudying: false,
  icon: StackIcon.ChartJsStackIcon,
};

export const GSAP_STACK: TechStackInterface = {
  name: "gsap",
  isFavorite: true,
  url: url.GSAP_URL,
  rate: 5,
  dateStarted: moment("2024-02-01"),
  dateEnded: "present",
  isStudying: true,
  icon: StackIcon.GsapStackIcon,
};

export const THREE_JS_STACK: TechStackInterface = {
  name: "threeJs",
  isFavorite: true,
  url: url.THREE_JS_URL,
  rate: 8,
  dateStarted: moment("2024-02-01"),
  dateEnded: "present",
  isStudying: false,
};

export const FRAMER_MOTION_STACK: TechStackInterface = {
  name: "framerMotion",
  isFavorite: true,
  url: url.FRAMER_MOTION_URL,
  rate: 8,
  dateStarted: moment("2024-02-01"),
  dateEnded: "present",
  isStudying: false,
  icon: StackIcon.FramerMotionStackIcon,
};

export const JEST_STACK: TechStackInterface = {
  name: "jest",
  isFavorite: true,
  url: url.JEST_URL,
  rate: 8,
  dateStarted: moment("2024-02-01"),
  dateEnded: "present",
  isStudying: false,
};

export const ENZYME_STACK: TechStackInterface = {
  name: "enzyme",
  isFavorite: true,
  url: url.ENZYME_URL,
  rate: 8,
  dateStarted: moment("2024-02-01"),
  dateEnded: "present",
  isStudying: true,
};

export const CYPRESS_STACK: TechStackInterface = {
  name: "cypress",
  isFavorite: true,
  url: url.CYPRESS_URL,
  rate: 8,
  dateStarted: moment("2024-02-01"),
  dateEnded: "present",
  isStudying: true,
};

export const I18N_STACK: TechStackInterface = {
  name: "i18n",
  isFavorite: true,
  url: url.I18NEXT_URL,
  rate: 8,
  dateStarted: moment("2022-12-12"),
  dateEnded: "present",
  isStudying: false,
  icon: StackIcon.I18NextStackIcon,
};

export const AXIOS_STACK: TechStackInterface = {
  name: "axios",
  isFavorite: true,
  url: url.AXIOS_URL,
  rate: 8,
  dateStarted: moment("2022-12-12"),
  dateEnded: "present",
  isStudying: false,
  icon: StackIcon.AxiosStackIcon,
  // alt: "axios-stack-icon.svg",
};

export const REACT_QUERY_STACK: TechStackInterface = {
  name: "reactQuery",
  isFavorite: true,
  url: url.REACT_QUERY_URL,
  rate: 8,
  dateStarted: moment("2024-02-01"),
  dateEnded: "present",
  isStudying: true,
  icon: StackIcon.ReactQueryStackIcon,
};

export const NPM_STACK: TechStackInterface = {
  name: "npm",
  isFavorite: false,
  url: url.NPM_URL,
  rate: 8,
  dateStarted: moment("2022-06-01"),
  dateEnded: "present",
  isStudying: false,
  icon: StackIcon.NpmStackIcon,
};

export const PNPM_STACK: TechStackInterface = {
  name: "pnpm",
  isFavorite: true,
  url: url.PNPM_URL,
  rate: 8,
  dateStarted: moment("2022-12-12"),
  dateEnded: "present",
  isStudying: false,
  icon: StackIcon.PnpmStackIcon,
};

export const YARN_STACK: TechStackInterface = {
  name: "yarn",
  isFavorite: true,
  url: url.YARN_URL,
  rate: 8,
  dateStarted: moment("2022-12-12"),
  dateEnded: "present",
  isStudying: false,
  icon: StackIcon.YarnStackIcon,
};

export const VITEST_STACK: TechStackInterface = {
  name: "vitest",
  isFavorite: true,
  url: url.VITEST_URL,
  rate: 8,
  dateStarted: moment("2022-06-01"),
  dateEnded: "present",
  isStudying: true,
};

export const MICROSERVICES_STACK: TechStackInterface = {
  name: "microservices",
  isFavorite: true,
  url: "undefined",
  rate: 8,
  dateStarted: moment("2022-12-12"),
  dateEnded: "present",
  isStudying: false,
};

// user interface
export const FIGMA_STACK: TechStackInterface = {
  name: "figma",
  isFavorite: true,
  url: url.FIGMA_URL,
  rate: 8,
  dateStarted: moment("2022-06-01"),
  dateEnded: "present",
  isStudying: false,
  icon: StackIcon.FigmaStackIcon,
};

export const FRONTEND_STACK: TechStackInterface = {
  name: "frontend",
  isFavorite: false,
  url: undefined,
  rate: 8,
  dateStarted: moment("2022-06-01"),
  dateEnded: "present",
  isStudying: false,
  icon: StackIcon.FrontEndStackIcon,
};

export const FIGMA_TO_HTML_STACK: TechStackInterface = {
  name: "figmaToHTML",
  isFavorite: false,
  url: undefined,
  rate: 8,
  dateStarted: moment("2022-06-01"),
  dateEnded: "present",
  isStudying: false,
  icon: StackIcon.FigmaHtmlStackIcon,
};

export const FIGMA_TO_REACT_STACK: TechStackInterface = {
  name: "figmaToReact",
  isFavorite: false,
  url: undefined,
  rate: 8,
  dateStarted: moment("2022-06-01"),
  dateEnded: "present",
  isStudying: false,
};

export const ATTENTION_TO_DETAILS_STACK: TechStackInterface = {
  name: "attentionToDetails",
  isFavorite: false,
  url: undefined,
  rate: 8,
  dateStarted: moment("2022-06-01"),
  dateEnded: "present",
  isStudying: false,
};

export const PIXEL_PERFECT_STACK: TechStackInterface = {
  name: "pixelPerfect",
  isFavorite: false,
  url: undefined,
  rate: 8,
  dateStarted: moment("2022-06-01"),
  dateEnded: "present",
  isStudying: false,
};

export const LANDING_PAGE_STACK: TechStackInterface = {
  name: "landingPage",
  isFavorite: false,
  url: undefined,
  rate: 8,
  dateStarted: moment("2022-06-01"),
  dateEnded: "present",
  isStudying: false,
};
