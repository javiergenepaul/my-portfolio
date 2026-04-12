import * as Stack from "@/config/stack";
import type { SkillCategory } from "@/config/types";

/**
 * Skill categories — shared across all year portfolios.
 * Each year's layout decides how to present them.
 */
export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    key: "backend",
    label: "Backend",
    stacks: [
      Stack.SPRING_BOOT_STACK,
      Stack.SPRING_SECURITY_STACK,
      Stack.SPRING_JDBC_STACK,
      Stack.SPRING_API_STACK,
      Stack.SPRING_OAUTH_STACK,
      Stack.JAVA_STACK,
      Stack.MYSQL_STACK,
      Stack.LARAVEL_STACK,
      Stack.PHP_STACK,
      Stack.MVC_STACK,
      Stack.MICROSERVICES_STACK,
    ],
  },
  {
    key: "frontend",
    label: "Frontend",
    stacks: [
      Stack.REACT_STACK,
      Stack.NEXT_STACK,
      Stack.TYPESCRIPT_STACK,
      Stack.JAVASCRIPT_STACK,
      Stack.HTML_STACK,
      Stack.CSS_STACK,
      Stack.TAILWIND_STACK,
      Stack.SHAD_CN_STACK,
      Stack.ANT_DESIGN_STACK,
      Stack.ZUSTAND_STACK,
      Stack.MOBX_STACK,
      Stack.FRAMER_MOTION_STACK,
      Stack.THREE_JS_STACK,
      Stack.GSAP_STACK,
      Stack.I18N_STACK,
      Stack.AXIOS_STACK,
      Stack.REACT_QUERY_STACK,
      Stack.REACT_ROUTER_STACK,
      Stack.VITE_STACK,
    ],
  },
  {
    key: "design",
    label: "Design & UI",
    stacks: [
      Stack.FIGMA_STACK,
      Stack.FIGMA_TO_HTML_STACK,
      Stack.FIGMA_TO_REACT_STACK,
      Stack.PIXEL_PERFECT_STACK,
      Stack.ATTENTION_TO_DETAILS_STACK,
      Stack.LANDING_PAGE_STACK,
      Stack.FRONTEND_STACK,
    ],
  },
  {
    key: "devops",
    label: "DevOps & Cloud",
    stacks: [
      Stack.GIT_STACK,
      Stack.LINUX_STACK,
      Stack.AZURE_STACK,
      Stack.AZURE_PIPELINE_AGENT_STACK,
      Stack.AWS_STACK,
      Stack.NGINX_STACK,
      Stack.CENTOS_STACK,
      Stack.FIREBASE_STACK,
      Stack.NETLIFY_STACK,
      Stack.HEROKU_STACK,
    ],
  },
  {
    key: "testing",
    label: "Testing",
    stacks: [
      Stack.JEST_STACK,
      Stack.VITEST_STACK,
      Stack.CYPRESS_STACK,
      Stack.JUNIT_STACK,
      Stack.POSTMAN_STACK,
    ],
  },
  {
    key: "tools",
    label: "Tools & Package Managers",
    stacks: [Stack.PNPM_STACK, Stack.NPM_STACK, Stack.YARN_STACK],
  },
];
