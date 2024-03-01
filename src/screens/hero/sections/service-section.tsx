import { translate } from "@/i18n";
import { ServiceCard } from "..";
import { SERVICE_OFFER, ServiceOfferInterface } from "@/config";

export const ServiceSection = () => {
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
