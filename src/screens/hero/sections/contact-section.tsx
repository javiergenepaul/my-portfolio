import { Card, CardContent, CardHeader, CardTitle } from "@/components";
import { translate } from "@/i18n";
import { ContactForm } from "../components/contact";
import ContactLogo from "../../../assets/contact-logo.svg";

export const ContactSection = () => {
  return (
    <section
      id="contacts"
      className="pt-16 lg:px-4 lg:pt-24 h-fit section snap-start"
      aria-label="Contacts"
    >
      <Card className="py-8">
        <CardHeader className="gap-10 pb-10 select-none">
          <img 
            src={ContactLogo}
            alt="jav-logo.svg"
            className="w-[74px] h-[74px]"
          />
          <CardTitle>{translate("contact.keepInTouch")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ContactForm />
        </CardContent>
      </Card>
    </section>
  );
};
