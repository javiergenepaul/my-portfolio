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
  alt: "spring-boot-stack-icon.svg",
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
  alt: "spring-security-stack-icon.svg",
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
  alt: "spring-oauth-stack-icon.svg",
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
  alt: "spring-jdbc-stack-icon.svg",
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
  alt: "api-stack-icon.svg",
};

export const JWT_STACK: TechStackInterface = {
  name: "jwt",
  isFavorite: true,
  url: url.JWT_URL,
  rate: 8,
  dateStarted: moment("2022-12-12"),
  dateEnded: "present",
  isStudying: false,
  icon: StackIcon.JwtStackIcon,
  alt: "jwt-stack-icon.svg",
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
  alt: "java-stack-icon.svg",
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
  alt: "mysql-stack-icon.svg",
};

export const JUNIT_STACK: TechStackInterface = {
  name: "junit",
  isFavorite: false,
  url: url.JUNIT_URL,
  rate: 5,
  dateStarted: moment("2024-02-01"),
  dateEnded: "present",
  isStudying: true,
  icon: StackIcon.JunitStackIcon,
  alt: "junit-stack-icon.svg",
};

// export const MOCKITO_STACK: TechStackInterface = {
//   name: "mockito",
//   isFavorite: false,
//   url: url.MOCKITO_URL,
//   rate: 5,
//   dateStarted: moment("2024-02-01"),
//   dateEnded: "present",
//   isStudying: true,
// };

export const POSTMAN_STACK: TechStackInterface = {
  name: "postman",
  isFavorite: true,
  url: url.POSTMAN_URL,
  rate: 10,
  dateStarted: moment("2021-08-01"),
  dateEnded: "present",
  isStudying: false,
  icon: StackIcon.PostmanStackIcon,
  alt: "postman-stack-icon.svg",
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
  alt: "linux-stack-icon.svg",
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
  alt: "azure-stack-icon.svg",
};

export const AWS_STACK: TechStackInterface = {
  name: "aws",
  isFavorite: false,
  url: url.AWS_URL,
  rate: 5,
  dateStarted: moment("2023-03-01"),
  dateEnded: "present",
  isStudying: true,
  icon: StackIcon.AwsStackIcon,
  alt: "aws-stack-icon.svg",
};

export const AZURE_PIPELINE_AGENT_STACK: TechStackInterface = {
  name: "azurePipelineAgent",
  isFavorite: false,
  url: url.AZURE_PIPELINE_AGENT_URL,
  rate: 5,
  dateStarted: moment("2023-02-01"),
  dateEnded: "present",
  isStudying: true,
  icon: StackIcon.AzurePipelineAgentStackIcon,
  alt: "azure-pipeline-agent-stack-icon.svg",
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
  alt: "firebase-stack-icon.svg",
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
  alt: "git-stack-icon.svg",
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
  alt: "nginx-stack-icon.svg",
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
  alt: "centos-stack-icon.svg",
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
  alt: "netlify-stack-icon.svg",
};

export const HEROKU_STACK: TechStackInterface = {
  name: "heroku",
  isFavorite: false,
  url: url.HEROKU_URL,
  rate: 5,
  dateStarted: moment(),
  dateEnded: "present",
  isStudying: true,
  icon: StackIcon.HerokuStackIcon,
  alt: "heroku-stack-icon.svg",
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
  alt: "laravel-stack-icon.svg",
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
  alt: "php-stack-icon.svg",
};

export const BOOTSTRAP_STACK: TechStackInterface = {
  name: "bootstrap",
  isFavorite: false,
  url: url.BOOTSTRAP_URL,
  rate: 8,
  dateStarted: moment("2021-08-01"),
  dateEnded: moment("2022-12-12"),
  isStudying: false,
  icon: StackIcon.BoostrapStackIcon,
  alt: "bootstrap-stack-icon.svg",
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
  alt: "mvc-stack-icon.svg",
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
  alt: "vite-stack-icon.svg",
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
  alt: "react-stack-icon.svg",
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
  alt: "typescript-stack-icon.svg",
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
  alt: "javascript-stack-icon.svg",
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
  alt: "html-stack-icon.svg",
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
  alt: "css-stack-icon.svg",
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
  alt: "jquery-stack-icon.svg",
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
  alt: "laravel-stack-icon.svg",
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
  alt: "tailwind-stack-icon.svg",
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
  alt: "shadcnui-stack-icon.svg",
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
  alt: "mui-stack-icon.svg",
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
  alt: "chakra-ui-stack-icon.svg",
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
  alt: "ant-design-stack-icon.svg",
};

export const NEXT_UI_STACK: TechStackInterface = {
  name: "nextUi",
  isFavorite: false,
  url: url.NEXT_UI_URL,
  rate: 5,
  dateStarted: moment("2024-02-01"),
  dateEnded: moment("2024-03-01"),
  isStudying: false,
  icon: StackIcon.NextUiStackIcon,
  alt: "next-ui-stack-icon.svg",
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
  alt: "zustand-stack-icon.svg",
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
  alt: "mobx-stack-icon.svg",
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
  alt: "chart-js-stack-icon.svg",
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
  alt: "gsap-stack-icon.svg",
};

export const THREE_JS_STACK: TechStackInterface = {
  name: "threeJs",
  isFavorite: false,
  url: url.THREE_JS_URL,
  rate: 5,
  dateStarted: moment("2024-02-01"),
  dateEnded: "present",
  isStudying: true,
  icon: StackIcon.ThreeJsStackIcon,
  alt: "three-js-stack-icon.svg",
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
  alt: "framer-motion-stack-icon.svg",
};

export const JEST_STACK: TechStackInterface = {
  name: "jest",
  isFavorite: true,
  url: url.JEST_URL,
  rate: 8,
  dateStarted: moment("2024-02-01"),
  dateEnded: "present",
  isStudying: false,
  icon: StackIcon.JestStackIcon,
  alt: "jest-stack-icon.svg",
};

// export const ENZYME_STACK: TechStackInterface = {
//   name: "enzyme",
//   isFavorite: true,
//   url: url.ENZYME_URL,
//   rate: 8,
//   dateStarted: moment("2024-02-01"),
//   dateEnded: "present",
//   isStudying: true,
// };

export const CYPRESS_STACK: TechStackInterface = {
  name: "cypress",
  isFavorite: true,
  url: url.CYPRESS_URL,
  rate: 8,
  dateStarted: moment("2024-02-01"),
  dateEnded: "present",
  isStudying: true,
  icon: StackIcon.CypressStackIcon,
  alt: "cypress-stack-icon.svg",
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
  alt: "i18next-stack-icon.svg",
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
  alt: "axios-stack-icon.svg",
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
  alt: "react-query-stack-icon.svg",
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
  alt: "npm-stack-icon.svg",
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
  alt: "pnpm-stack-icon.svg",
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
  alt: "yarn-stack-icon.svg",
};

export const VITEST_STACK: TechStackInterface = {
  name: "vitest",
  isFavorite: true,
  url: url.VITEST_URL,
  rate: 8,
  dateStarted: moment("2022-06-01"),
  dateEnded: "present",
  isStudying: true,
  icon: StackIcon.VitestStackIcon,
  alt: "vitest-stack-icon.svg",
};

export const MICROSERVICES_STACK: TechStackInterface = {
  name: "microservices",
  isFavorite: true,
  url: "undefined",
  rate: 8,
  dateStarted: moment("2022-12-12"),
  dateEnded: "present",
  isStudying: false,
  icon: StackIcon.MIcroservicesStackIcon,
  alt: "microservices-stack-icon.svg",
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
  alt: "figma-stack-icon.svg",
};

export const FRONTEND_STACK: TechStackInterface = {
  name: "frontend",
  isFavorite: true,
  url: undefined,
  rate: 8,
  dateStarted: moment("2022-06-01"),
  dateEnded: "present",
  isStudying: false,
  icon: StackIcon.FrontEndStackIcon,
  alt: "front-end-stack-icon.svg",
};

export const FIGMA_TO_HTML_STACK: TechStackInterface = {
  name: "figmaToHTML",
  isFavorite: true,
  url: undefined,
  rate: 8,
  dateStarted: moment("2022-06-01"),
  dateEnded: "present",
  isStudying: false,
  icon: StackIcon.FigmaHtmlStackIcon,
  alt: "figma-html-stack-icon.svg",
};

export const FIGMA_TO_REACT_STACK: TechStackInterface = {
  name: "figmaToReact",
  isFavorite: true,
  url: undefined,
  rate: 8,
  dateStarted: moment("2022-06-01"),
  dateEnded: "present",
  isStudying: false,
  icon: StackIcon.FigmaReactStackIcon,
  alt: "figma-react-stack-icon.svg",
};

export const ATTENTION_TO_DETAILS_STACK: TechStackInterface = {
  name: "attentionToDetails",
  isFavorite: true,
  url: undefined,
  rate: 8,
  dateStarted: moment("2022-06-01"),
  dateEnded: "present",
  isStudying: false,
  icon: StackIcon.AttentionToDetailsStackIcon,
  alt: "attention-to-details-stack-icon.svg",
};

export const PIXEL_PERFECT_STACK: TechStackInterface = {
  name: "pixelPerfect",
  isFavorite: true,
  url: undefined,
  rate: 8,
  dateStarted: moment("2022-06-01"),
  dateEnded: "present",
  isStudying: false,
  icon: StackIcon.PixelPerfectStackIcon,
  alt: "pixel-perfect-stack-icon.svg",
};

export const LANDING_PAGE_STACK: TechStackInterface = {
  name: "landingPage",
  isFavorite: true,
  url: undefined,
  rate: 8,
  dateStarted: moment("2022-06-01"),
  dateEnded: "present",
  isStudying: false,
  icon: StackIcon.LandingPageStackIcon,
  alt: "landing-page-stack-icon.svg",
};
