import { ServiceOfferInterface } from "@/config";
import { getServices } from "@/config/data/services";
import { translate } from "@/i18n";
import { Suspense, lazy } from "react";
import { ServiceCardSkeleton } from "../components";

const LazyServiceCard = lazy(
  () => import("../components/service-card/service-card"),
);

export const ServiceSection = () => {
  const SERVICE_OFFER: ServiceOfferInterface[] = getServices();

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
