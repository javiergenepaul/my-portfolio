import { translate } from "@/i18n";
import { ServiceCard } from "..";
import { SERVICE_OFFER, ServiceOfferInterface } from "@/config";

export const ServiceSection = () => {
  return (
    <section
      className="py-16 h-fit lg:px-4 lg:py-24 section snap-start "
      id="services"
      aria-label={translate("header.ariaLabel.serviceSection")}
    >
      <div className="flex flex-col gap-4">
        {SERVICE_OFFER.map((service: ServiceOfferInterface) => {
          return <ServiceCard {...service} />;
        })}
      </div>
    </section>
  );
};
