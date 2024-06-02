import { FadeAnimation } from "@/components";
import {
  CertificateSection,
  BackgroundSection,
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
        <BackgroundSection />
        <CertificateSection />
        <LanguageSection />
        <TestimonialSection />
        <FooterSection />
      </div>
    </FadeAnimation>
  );
};
