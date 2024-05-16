import { FadeAnimation } from "@/components";
import {
  CertificateSection,
  ExperienceSection,
  FooterSection,
  IntroSection,
  LanguageSection,
  TestimonialSection,
} from "./sections";
import { useEffect } from "react";

export const About = () => {
  useEffect(() => {
    window.history.scrollRestoration = "manual";
  }, []);

  return (
    <FadeAnimation>
      <div className="h-full pb-16 space-y-6">
        <IntroSection />
        <ExperienceSection />
        <CertificateSection />
        <LanguageSection />
        <TestimonialSection />
        <FooterSection />
      </div>
    </FadeAnimation>
  );
};
