"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  SKILL_CATEGORIES,
  getExperience,
  getEducation,
  getProjects,
} from "@/config";
import { useLocaleRefresh } from "@/i18n";
import { useSettingsStore } from "@/stores/settings-store";
import { CContext, makePalette } from "./context";
import { ease, pageAnim } from "./animation";
import { useIsMobile } from "./hooks";
import { SidebarPanel } from "./components";
import {
  AboutSection,
  ExperienceSection,
  SkillsSection,
  ProjectsSection,
  TestimonialsSection,
  LanguagesSection,
  BooksSection,
  ContactSection,
} from "./sections";

const ParticleBg = dynamic(() => import("./particle-bg"), { ssr: false });

export function Portfolio2025() {
  useLocaleRefresh();
  const [active, setActive] = useState("about");

  const theme = useSettingsStore((s) => s.theme);
  const isLight =
    theme === "light" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      !window.matchMedia("(prefers-color-scheme: dark)").matches);
  const C = makePalette(isLight);
  const isMobile = useIsMobile();

  const experience = getExperience().filter((e) => e.isWork);
  const education = getEducation().filter(
    (e) => e.level === "tertiary" || e.level === "vocational",
  );
  const projects = getProjects().filter((p) => !p.hidden);

  // Reset scroll on tab switch
  useEffect(() => {
    const el = document.getElementById("p25-scroll");
    if (el) el.scrollTop = 0;
  }, [active]);

  return (
    <CContext.Provider value={C}>
      {/* Skip to main content — screen reader / keyboard shortcut */}
      <a
        href="#p25-scroll"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-99999 focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold focus:no-underline"
        style={{ backgroundColor: "#E11D48", color: "#fff" }}
      >
        Skip to content
      </a>
      <div
        className="min-h-screen lg:h-screen lg:overflow-hidden flex items-start lg:items-center justify-center p-4 sm:p-6 lg:py-10 lg:px-6"
        style={{
          position: "relative",
          background: `radial-gradient(ellipse 80% 60% at 20% 40%, rgba(190,18,60,0.22) 0%, transparent 60%),
                     radial-gradient(ellipse 60% 50% at 80% 70%, rgba(225,29,72,0.12) 0%, transparent 55%),
                     ${C.page}`,
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Three.js background */}
        <ParticleBg />

        {/* Card */}
        <motion.div
          className="w-full max-w-xl lg:max-w-7xl rounded-3xl flex flex-col lg:flex-row overflow-hidden"
          style={{ position: "relative", zIndex: 1 }}
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          {/* Animated glow border */}
          <motion.div
            style={{
              position: "absolute",
              inset: -1,
              borderRadius: "25px",
              background: `linear-gradient(135deg, ${C.indigoDark}, transparent, ${C.indigo}, transparent, ${C.indigoDark})`,
              backgroundSize: "300% 300%",
              zIndex: 0,
              pointerEvents: "none",
            }}
            animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />

          {/* Inner card */}
          <div
            className="w-full flex flex-col lg:flex-row overflow-hidden"
            style={{
              position: "relative",
              zIndex: 1,
              borderRadius: "24px",
              border: `1px solid ${C.borderSidebar}`,
            }}
          >
            {/* Sidebar */}
            <div
              className="lg:w-80 shrink-0 flex flex-col lg:overflow-y-auto"
              style={
                {
                  backgroundColor: C.sidebar,
                  scrollbarWidth: "none",
                } as React.CSSProperties
              }
            >
              <SidebarPanel active={active} goto={setActive} />
            </div>

            {/* Main */}
            <main
              id="p25-scroll"
              className="flex-1 overflow-y-auto lg:max-h-[90vh]"
              style={{ backgroundColor: C.main }}
              aria-label="Portfolio content"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  {...pageAnim}
                  style={{
                    padding: isMobile ? "20px 16px 28px" : "48px 52px 44px",
                  }}
                >
                  {active === "about" && <AboutSection />}
                  {active === "experience" && (
                    <ExperienceSection
                      experience={experience}
                      education={education}
                    />
                  )}
                  {active === "skills" && (
                    <SkillsSection skillGroups={SKILL_CATEGORIES} />
                  )}
                  {active === "projects" && (
                    <ProjectsSection projects={projects} />
                  )}
                  {active === "testimonials" && <TestimonialsSection />}
                  {active === "languages" && <LanguagesSection />}
                  {active === "books" && <BooksSection />}
                  {active === "contact" && <ContactSection />}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </motion.div>
      </div>
    </CContext.Provider>
  );
}
