import { FadeAnimation } from "@/components";
import {
  CertificateSection,
  ExperienceSection,
  IntroSection,
} from "./sections";
import { FloatingNavbar } from "@/components/floating-navbar/floating-navbar";

export const About = () => {
  return (
    <FadeAnimation>
      <FloatingNavbar />
      <div className="pb-16 space-y-6 h-full">
        <IntroSection />
        <ExperienceSection />
        <CertificateSection />
      </div>
    </FadeAnimation>
  );
};
