<<<<<<< HEAD
import { FadeAnimation } from "@/components";
=======
import { FadeAnimation, FloatingNavbar } from "@/components";
>>>>>>> master
import {
  CertificateSection,
  ExperienceSection,
  IntroSection,
<<<<<<< HEAD
  LanguageSection,
=======
>>>>>>> master
} from "./sections";

export const About = () => {
  return (
    <FadeAnimation>
<<<<<<< HEAD
      <div className="h-full pb-16 space-y-6">
        <IntroSection />
        <ExperienceSection />
        <CertificateSection />
        <LanguageSection />
=======
      <FloatingNavbar />
      <div className="pb-16 space-y-6 h-full">
        <IntroSection />
        <ExperienceSection />
        <CertificateSection />
>>>>>>> master
      </div>
    </FadeAnimation>
  );
};
