import { usePageTitleStore } from "@/stores";
import { useEffect } from "react";
import {
  ContactSection,
  FooterSection,
  HeaderSection,
  ProjectSection,
  ServiceSection,
} from "./sections";

export const Hero = () => {
  const { setTitle } = usePageTitleStore();

  useEffect(() => {
    setTitle("Home Page");
  }, []);

  return (
    <div className="lg:flex lg:justify-between lg:gap-4">
      <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-2/5 lg:flex-col lg:justify-between lg:py-24">
        <HeaderSection />
      </header>
      <main className="lg:w-3/5 lg:min-h-screen flex flex-col">
        <ServiceSection />
        <ProjectSection />
        <ContactSection />
        <FooterSection />
      </main>
    </div>
  );
};
