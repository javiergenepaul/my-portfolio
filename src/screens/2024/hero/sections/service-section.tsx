"use client";

import { ServiceOfferInterface } from "@/config";
import { translate, useLocaleRefresh } from "@/i18n";
import { useLanguageStore } from "@/stores/language-store";
import { useContent } from "@/lib/content/use-content";
import { rowsToServices } from "@/lib/content/portfolio";
import { Suspense, lazy } from "react";
import { ServiceCardSkeleton } from "../components";

const LazyServiceCard = lazy(
  () => import("../components/service-card/service-card"),
);

export const ServiceSection = () => {
  useLocaleRefresh();
  const locale = useLanguageStore((s) => s.language);
  const SERVICE_OFFER = rowsToServices(
    useContent("services"),
    useContent("skills"),
    locale,
  );

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
          ),
        )}
      </div>
    </section>
  );
};
