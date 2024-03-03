import { translate } from "@/i18n";
import { ServiceCard } from "..";
import { ServiceOfferInterface } from "@/config";
import * as Stack from "../../../config/stack";

export const ServiceSection = () => {
  const SERVICE_OFFER: ServiceOfferInterface[] = [
    {
      title: translate("services.backend.title"),
      description: translate("services.backend.description"),
      stack: [
        Stack.SPRING_BOOT_STACK,
        Stack.SPRING_SECURITY_STACK,
        Stack.SPRING_OAUTH_STACK,
        Stack.SPRING_JDBC_STACK,
        Stack.SPRING_API_STACK,
        Stack.JAVA_STACK,
        Stack.MYSQL_STACK,
        Stack.JUNIT_STACK,
        Stack.MOCKITO_STACK,
        Stack.POSTMAN_STACK,
        Stack.LINUX_STACK,
        Stack.AZURE_STACK,
        Stack.AWS_STACK,
        Stack.AZURE_PIPELINE_AGENT_STACK,
        Stack.FIREBASE_STACK,
        Stack.GIT_STACK,
        Stack.NGINX_STACK,
        Stack.CENTOS_STACK,
        Stack.NETLIFY_STACK,
        Stack.HEROKU_STACK,
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
        Stack.MUI_STACK,
        Stack.CHAKRA_STACK,
        Stack.ANT_DESIGN_STACK,
        Stack.NEXT_UI_STACK,
        Stack.ZUSTAND_STACK,
        Stack.MOBX_STACK,
        Stack.CHART_JS_STACK,
        Stack.GSAP_STACK,
        Stack.THREE_JS_STACK,
        Stack.FRAMER_MOTION_STACK,
        Stack.CYPRESS_STACK,
        Stack.I18N_STACK,
        Stack.AXIOS_STACK,
        Stack.REACT_QUERY_STACK,
        Stack.NPM_STACK,
        Stack.PNPM_STACK,
        Stack.YARN_STACK,
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

  return (
    <section
      className="pt-16 h-fit lg:px-4 lg:pt-24 section snap-start "
      id="services"
      aria-label={translate("header.ariaLabel.serviceSection")}
    >
      <div className="flex flex-col gap-8">
        {SERVICE_OFFER.map(
          (service: ServiceOfferInterface, index: React.Key) => {
            return <ServiceCard key={index} {...service} />;
          }
        )}
      </div>
    </section>
  );
};
