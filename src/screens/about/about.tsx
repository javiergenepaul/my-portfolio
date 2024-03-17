import { FadeAnimation } from "@/components";
import {
  CertificateSection,
  ExperienceSection,
  IntroSection,
  LanguageSection,
} from "./sections";

export const About = () => {
  return (
    <FadeAnimation>
      <div className="h-full pb-16 space-y-6">
        <IntroSection />
        <ExperienceSection />
        <CertificateSection />
        <LanguageSection />
      </div>
    </FadeAnimation>
  );
};
