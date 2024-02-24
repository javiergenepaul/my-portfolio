import { translate } from "@/i18n";

export const ServiceSection = () => {
  return (
    <section
      className="h-screen bg-blue-800"
      id="services"
      aria-label="Services"
    >
      <span className="">{translate("hello")}</span>
      {/* <span className="">Service Section</span> */}
    </section>
  );
};
