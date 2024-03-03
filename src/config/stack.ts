import { translate } from "@/i18n";
import { TechStackInterface } from "./types";
import * as url from "./url";

// BACKEND STACK
export const SPRING_BOOT_STACK: TechStackInterface = {
  name: translate("services.stack.springBoot"),
  isFavorite: true,
  url: url.SPRING_BOOT_URL,
};

export const SPRING_SECURITY_STACK: TechStackInterface = {
  name: translate("services.stack.springBoot"),
  isFavorite: true,
  url: url.SPRING_BOOT_URL,
};

export const SPRING_OAUTH_STACK: TechStackInterface = {
  name: translate("services.stack.springSecurityOAuth"),
  isFavorite: true,
  url: url.SPRING_SECURITY_OAUTH_URL,
};

export const SPRING_JDBC_STACK: TechStackInterface = {
  name: translate("services.stack.springJDBC"),
  isFavorite: true,
  url: url.SPRING_JDBC_URL,
};

export const SPRING_API_STACK: TechStackInterface = {
  name: translate("services.stack.api"),
  isFavorite: true,
  url: url.SPRING_REST_URL,
};

export const JWT_STACK: TechStackInterface = {
  name: translate("services.stack.jwt"),
  isFavorite: true,
  url: url.JWT_URL,
};

export const JAVA_STACK: TechStackInterface = {
  name: translate("services.stack.java"),
  isFavorite: true,
  url: url.JAVA_URL,
};

export const MYSQL_STACK: TechStackInterface = {
  name: translate("services.stack.mySQL"),
  isFavorite: true,
  url: url.MYSQL_URL,
};

export const JUNIT_STACK: TechStackInterface = {
  name: translate("services.stack.junit"),
  isFavorite: false,
  url: url.JUNIT_URL,
};

export const MOCKITO_STACK: TechStackInterface = {
  name: translate("services.stack.mockito"),
  isFavorite: false,
  url: url.MOCKITO_URL,
};

export const POSTMAN_STACK: TechStackInterface = {
  name: translate("services.stack.postman"),
  isFavorite: false,
  url: url.POSTMAN_URL,
};

export const LINUX_STACK: TechStackInterface = {
  name: translate("services.stack.linux"),
  isFavorite: false,
  url: url.LINUX_URL,
};

export const AZURE_STACK: TechStackInterface = {
  name: translate("services.stack.azure"),
  isFavorite: false,
  url: url.AZURE_URL,
};

export const AWS_STACK: TechStackInterface = {
  name: translate("services.stack.aws"),
  isFavorite: false,
  url: url.AWS_URL,
};

export const AZURE_PIPELINE_AGENT_STACK = {
  name: translate("services.stack.azurePipelineAgent"),
  isFavorite: false,
  url: url.AZURE_PIPELINE_AGENT_URL,
};

export const FIREBASE_STACK = {
  name: translate("services.stack.firebase"),
  isFavorite: false,
  url: url.FIREBASE_URL,
};

export const GIT_STACK = {
  name: translate("services.stack.git"),
  isFavorite: false,
  url: url.GIT_URL,
};

export const NGINX_STACK = {
  name: translate("services.stack.nginx"),
  isFavorite: false,
  url: url.NGINX_URL,
};

export const CENTOS_STACK = {
  name: translate("services.stack.centOS"),
  isFavorite: false,
  url: url.CENT_OS_URL,
};

export const NETLIFY_STACK = {
  name: translate("services.stack.netlify"),
  isFavorite: false,
  url: url.NETLIFY_URL,
};

export const HEROKU_STACK = {
  name: translate("services.stack.heroku"),
  isFavorite: false,
  url: url.HEROKU_URL,
};

export const LARAVEL_STACK = {
  name: translate("services.stack.laravel"),
  isFavorite: false,
  url: url.LARAVEL_URL,
};

export const PHP_STACK = {
  name: translate("services.stack.php"),
  isFavorite: false,
  url: url.PHP_URL,
};

export const BOOTSTRAP_STACK = {
  name: translate("services.stack.bootstrap"),
  isFavorite: false,
  url: url.BOOTSTRAP_URL,
};

export const MVC_STACK = {
  name: translate("services.stack.mvc"),
  isFavorite: false,
  url: undefined,
};

// FRONT END STACK
export const VITE_STACK: TechStackInterface = {
  name: translate("services.stack.vite"),
  isFavorite: true,
  url: url.VITE_URL,
};

export const REACT_STACK: TechStackInterface = {
  name: translate("services.stack.react"),
  isFavorite: true,
  url: url.REACT_URL,
};

export const TYPESCRIPT_STACK: TechStackInterface = {
  name: translate("services.stack.typescript"),
  isFavorite: true,
  url: url.TYPESCRIPT_URL,
};

export const JAVASCRIPT_STACK: TechStackInterface = {
  name: translate("services.stack.javascript"),
  isFavorite: true,
  url: url.JAVASCRIPT_URL,
};

export const HTML_STACK: TechStackInterface = {
  name: translate("services.stack.html"),
  isFavorite: false,
  url: url.HTML_URL,
};

export const CSS_STACK: TechStackInterface = {
  name: translate("services.stack.css"),
  isFavorite: false,
  url: url.CSS_URL,
};

export const JQUERY_STACK: TechStackInterface = {
  name: translate("services.stack.jquery"),
  isFavorite: false,
  url: url.JQUERY_URL,
};

export const BLADE_STACK: TechStackInterface = {
  name: translate("services.stack.blade"),
  isFavorite: false,
  url: url.BLADE_URL,
};

export const TAILWIND_STACK: TechStackInterface = {
  name: translate("services.stack.tailwind"),
  isFavorite: true,
  url: url.TAILWIND_URL,
};

export const SHAD_CN_STACK: TechStackInterface = {
  name: translate("services.stack.shadCn"),
  isFavorite: true,
  url: url.SHAD_CN_URL,
};

export const MUI_STACK: TechStackInterface = {
  name: translate("services.stack.mui"),
  isFavorite: false,
  url: url.MUI_URL,
};

export const CHAKRA_STACK: TechStackInterface = {
  name: translate("services.stack.chakraUi"),
  isFavorite: false,
  url: url.CHAKRA_URL,
};

export const ANT_DESIGN_STACK: TechStackInterface = {
  name: translate("services.stack.antDesign"),
  isFavorite: false,
  url: url.ANT_DESIGN_URL,
};

export const NEXT_UI_STACK: TechStackInterface = {
  name: translate("services.stack.nextUi"),
  isFavorite: false,
  url: url.NEXT_UI_URL,
};

export const ZUSTAND_STACK: TechStackInterface = {
  name: translate("services.stack.zustand"),
  isFavorite: true,
  url: url.ZUSTAND_URL,
};

export const MOBX_STACK: TechStackInterface = {
  name: translate("services.stack.mobx"),
  isFavorite: false,
  url: url.MOBX_URL,
};

export const CHART_JS_STACK: TechStackInterface = {
  name: translate("services.stack.chartJs"),
  isFavorite: false,
  url: url.CHART_JS,
};

export const GSAP_STACK: TechStackInterface = {
  name: translate("services.stack.gsap"),
  isFavorite: true,
  url: url.GSAP_URL,
};

export const THREE_JS_STACK: TechStackInterface = {
  name: translate("services.stack.threeJs"),
  isFavorite: true,
  url: url.THREE_JS_URL,
};

export const FRAMER_MOTION_STACK: TechStackInterface = {
  name: translate("services.stack.framerMotion"),
  isFavorite: true,
  url: url.FRAMER_MOTION_URL,
};

export const JEST_STACK: TechStackInterface = {
  name: translate("services.stack.jest"),
  isFavorite: true,
  url: url.JEST_URL,
};

export const ENZYME_STACK: TechStackInterface = {
  name: translate("services.stack.enzyme"),
  isFavorite: true,
  url: url.ENZYME_URL,
};

export const CYPRESS_STACK: TechStackInterface = {
  name: translate("services.stack.cypress"),
  isFavorite: true,
  url: url.CYPRESS_URL,
};

export const I18N_STACK: TechStackInterface = {
  name: translate("services.stack.i18n"),
  isFavorite: true,
  url: url.I18NEXT_URL,
};

export const AXIOS_STACK: TechStackInterface = {
  name: translate("services.stack.axios"),
  isFavorite: true,
  url: url.AXIOS_URL,
};

export const REACT_QUERY_STACK: TechStackInterface = {
  name: translate("services.stack.reactQuery"),
  isFavorite: true,
  url: url.REACT_QUERY_URL,
};

export const NPM_STACK: TechStackInterface = {
  name: translate("services.stack.npm"),
  isFavorite: false,
  url: url.NPM_URL,
};

export const PNPM_STACK: TechStackInterface = {
  name: translate("services.stack.pnpm"),
  isFavorite: true,
  url: url.PNPM_URL,
};

export const YARN_STACK: TechStackInterface = {
  name: translate("services.stack.yarn"),
  isFavorite: true,
  url: url.YARN_URL,
};

export const VITEST_STACK: TechStackInterface = {
  name: translate("services.stack.vitest"),
  isFavorite: true,
  url: url.VITEST_URL,
};

export const MICROSERVICES_STACK: TechStackInterface = {
  name: translate("services.stack.microservices"),
  isFavorite: true,
  url: "undefined",
};

// user interface
export const FIGMA_STACK: TechStackInterface = {
  name: translate("services.stack.figma"),
  isFavorite: true,
  url: url.FIGMA_URL,
};

export const FRONTEND_STACK: TechStackInterface = {
  name: translate("services.stack.frontend"),
  isFavorite: false,
  url: undefined,
};

export const FIGMA_TO_HTML_STACK: TechStackInterface = {
  name: translate("services.stack.figmaToHTML"),
  isFavorite: false,
  url: undefined,
};

export const FIGMA_TO_REACT_STACK: TechStackInterface = {
  name: translate("services.stack.figmaToReact"),
  isFavorite: false,
  url: undefined,
};

export const ATTENTION_TO_DETAILS_STACK: TechStackInterface = {
  name: translate("services.stack.attentionToDetails"),
  isFavorite: false,
  url: undefined,
};

export const PIXEL_PERFECT_STACK: TechStackInterface = {
  name: translate("services.stack.pixelPerfect"),
  isFavorite: false,
  url: undefined,
};

export const LANDING_PAGE_STACK: TechStackInterface = {
  name: translate("services.stack.landingPage"),
  isFavorite: false,
  url: undefined,
};
