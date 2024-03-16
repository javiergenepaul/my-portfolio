import { translate } from "@/i18n";
import { ServiceOfferInterface } from "@/config";
import * as Stack from "../../../config/stack";
import { Suspense, lazy } from "react";
import { ServiceCardSkeleton } from "../components";

const LazyServiceCard = lazy(
  () => import("../components/service-card/service-card")
);

export const ServiceSection = () => {
  const SERVICE_OFFER: ServiceOfferInterface[] = [
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
        Stack.MICROSERVICES_STACK
        // Stack.SPRING_OAUTH_STACK, //TODO:: enable this when done
        // Stack.JUNIT_STACK, //TODO:: when done practicing enable this
        // Stack.MOCKITO_STACK, //TODO:: when done practicing enable this
        // Stack.AWS_STACK, //TODO:: enable this when done
        // Stack.AZURE_PIPELINE_AGENT_STACK, // TODO:: when done practicing enable this
        // Stack.HEROKU_STACK, //TODO:: enable this when done
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
        // Stack.JEST_STACK, //TODO:: update later
        // Stack.VITEST_STACK, //TODO:: update later
        // Stack.CYPRESS_STACK, //TODO:: update later
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
          (service: ServiceOfferInterface, index: React.Key) => (
            <Suspense key={index} fallback={<ServiceCardSkeleton />}>
              <LazyServiceCard {...service} />
            </Suspense>
          )
        )}
      </div>
    </section>
  );
};
