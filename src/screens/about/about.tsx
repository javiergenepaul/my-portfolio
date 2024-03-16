import { FadeAnimation, FloatingNavbar } from "@/components";
import {
  CertificateSection,
  ExperienceSection,
  IntroSection,
} from "./sections";

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
