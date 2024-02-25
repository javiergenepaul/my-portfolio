import { SelectedNavLink, useNavLinkStore, usePageTitleStore } from "@/stores";
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
  const { setSelectedNav, setOnScrollNav } = useNavLinkStore();

  useEffect(() => {
    window.history.scrollRestoration = "manual";
  }, []);

  useEffect(() => {
    setTitle("Home Page");
    setSelectedNav("services");
  }, []);

  const isSectionPartiallyInView = (data: {
    sectionTop: number;
    sectionBottom: number;
  }): boolean => {
    const { sectionTop, sectionBottom } = data;
    const sectionHeight = sectionBottom - sectionTop;
    const margin = sectionHeight * 0.2;

    const inside: boolean =
      sectionTop + margin < scrollY && sectionBottom + margin > scrollY;

    return inside;
  };

  useEffect(() => {
    const handleScroll = (): void => {
      const sections = document.querySelectorAll<HTMLElement>(".section");
      sections.forEach((section: HTMLElement) => {
        if (isInViewport(section)) {
          setOnScrollNav(section.id as SelectedNavLink);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isInViewport = (element: HTMLElement): boolean => {
    const rect = element.getBoundingClientRect();

    return isSectionPartiallyInView({
      sectionTop: rect.top,
      sectionBottom: rect.bottom,
    });
  };

  return (
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
  );
};
