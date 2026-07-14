import { lazy, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components";
import { translate } from "@/i18n";
import ContactLogo from "@/assets/contact-logo.svg";

// The contact form pulls in react-hook-form + zod + @hookform/resolvers. It
// sits below the fold on the hero, so defer it into its own chunk rather than
// shipping it in the landing route's First Load JS. A min-height placeholder
// reserves its space to avoid layout shift while the chunk loads.
const ContactForm = lazy(() =>
  import("../components/contact/contact-form").then((m) => ({
    default: m.ContactForm,
  })),
);

export const ContactSection = () => {
  return (
    <section
      id="contacts"
      className="pt-16 lg:px-4 lg:pt-24 h-fit section snap-start"
      aria-label="Contacts"
    >
      <Card className="py-8">
        <CardHeader className="gap-10 pb-10 select-none">
          <img src={ContactLogo} alt="jav-logo.svg" className="w-18.5 h-18.5" />
          <CardTitle>{translate("contact.keepInTouch")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="min-h-105" aria-hidden />}>
            <ContactForm />
          </Suspense>
        </CardContent>
      </Card>
    </section>
  );
};
