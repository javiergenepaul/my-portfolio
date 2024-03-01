import { SelectedNavLink, useNavLinkStore } from "@/stores";
import { useEffect } from "react";
import {
  ContactSection,
  FooterSection,
  HeaderSection,
  ProjectSection,
  ServiceSection,
} from "./sections";
import { FadeAnimation } from "@/components";

export const Hero = () => {
  const { setSelectedNav, setOnScrollNav } = useNavLinkStore();

  useEffect(() => {
    window.history.scrollRestoration = "manual";
  }, []);

  useEffect(() => {
    setSelectedNav("services");
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>(".section");

    const handleScroll = (): void => {
      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY || window.pageYOffset;
      const middleScrollPosition = scrollY + viewportHeight / 2;

      sections.forEach((section: HTMLElement) => {
        const rect = section.getBoundingClientRect();
        const scrollTop =
          window.scrollY ||
          window.pageYOffset ||
          document.documentElement.scrollTop;
        const top = rect.top + scrollTop;
        const bottom = rect.bottom + scrollTop;

        if (top < middleScrollPosition && bottom > middleScrollPosition) {
          setOnScrollNav(section.id as SelectedNavLink);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <FadeAnimation>
      <div className="lg:flex lg:justify-between lg:gap-4">
        <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-2/5 lg:flex-col lg:justify-between lg:py-24">
          <HeaderSection />
        </header>
        <main className="flex flex-col lg:w-3/5 lg:min-h-screen snap-y">
          <ServiceSection />
          <ProjectSection />
          <ContactSection />
          <FooterSection />
        </main>
      </div>
    </FadeAnimation>
  );
};
