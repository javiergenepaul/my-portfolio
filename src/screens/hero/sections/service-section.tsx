import { translate } from "@/i18n";
import { ServiceCard } from "..";
import { PATH, SERVICE_OFFER, ServiceOfferInterface } from "@/config";
import { Button } from "@/components";
import { useNavigate } from "react-router-dom";

export const ServiceSection = () => {
  const navigate = useNavigate();

  return (
    <section
      className="pt-16 h-fit lg:px-4 lg:pt-24 section snap-start "
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
