import { translate } from "@/i18n";
import type { ServiceOfferInterface } from "@/config/types";
import * as Stack from "@/config/stack";

/**
 * Service offerings — shared across all year portfolios.
 * Factory function so translate() runs at render time.
 */
export const getServices = (): ServiceOfferInterface[] => [
  {
    title: translate("services.backend.title"),
    description: translate("services.backend.description"),
    stack: [
      Stack.SPRING_BOOT_STACK,
      Stack.SPRING_SECURITY_STACK,
      Stack.SPRING_JDBC_STACK,
      Stack.SPRING_API_STACK,
      Stack.JAVA_STACK,
      Stack.MYSQL_STACK,
      Stack.POSTMAN_STACK,
      Stack.LINUX_STACK,
      Stack.AZURE_STACK,
      Stack.FIREBASE_STACK,
      Stack.GIT_STACK,
      Stack.NGINX_STACK,
      Stack.CENTOS_STACK,
      Stack.NETLIFY_STACK,
      Stack.MVC_STACK,
      Stack.PHP_STACK,
      Stack.LARAVEL_STACK,
      Stack.MICROSERVICES_STACK,
    ],
  },
  {
    title: translate("services.frontend.title"),
    description: translate("services.frontend.description"),
    stack: [
      Stack.VITE_STACK,
      Stack.REACT_STACK,
      Stack.TYPESCRIPT_STACK,
      Stack.JAVASCRIPT_STACK,
      Stack.HTML_STACK,
      Stack.CSS_STACK,
      Stack.JQUERY_STACK,
      Stack.BLADE_STACK,
      Stack.TAILWIND_STACK,
      Stack.SHAD_CN_STACK,
      Stack.ANT_DESIGN_STACK,
      Stack.ZUSTAND_STACK,
      Stack.MOBX_STACK,
      Stack.CHART_JS_STACK,
      Stack.GSAP_STACK,
      Stack.FRAMER_MOTION_STACK,
      Stack.I18N_STACK,
      Stack.AXIOS_STACK,
      Stack.REACT_QUERY_STACK,
      Stack.NPM_STACK,
      Stack.PNPM_STACK,
      Stack.YARN_STACK,
      Stack.NEXT_UI_STACK,
      Stack.BOOTSTRAP_STACK,
      Stack.THREE_JS_STACK,
      Stack.REACT_ROUTER_STACK,
      Stack.VITEST_STACK,
    ],
  },
  {
    title: translate("services.designImplementation.title"),
    description: translate("services.designImplementation.description"),
    stack: [
      Stack.FIGMA_STACK,
      Stack.FRONTEND_STACK,
      Stack.FIGMA_TO_HTML_STACK,
      Stack.FIGMA_TO_REACT_STACK,
      Stack.ATTENTION_TO_DETAILS_STACK,
      Stack.PIXEL_PERFECT_STACK,
      Stack.LANDING_PAGE_STACK,
    ],
  },
];
