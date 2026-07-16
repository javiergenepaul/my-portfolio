"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { getExperience, getEducation, getProjects } from "@/config";
import { useLocaleRefresh } from "@/i18n";
import { useContent } from "@/lib/content/use-content";
import { rowsToSkillCategories } from "@/lib/content/portfolio";
import { useSettingsStore } from "@/stores/settings-store";
import { useLanguageStore } from "@/stores/language-store";
import { CContext, makePalette } from "./context";
import { ease, pageAnim } from "./animation";
import { useIsMobile, useIsCompact } from "./hooks";
import { SidebarPanel } from "./components";
import {
  AboutSection,
  ExperienceSection,
  SkillsSection,
  ProjectsSection,
  TestimonialsSection,
  LanguagesSection,
  BooksSection,
  CertificatesSection,
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
  const isCompact = useIsCompact();

  const experience = getExperience().filter((e) => e.isWork);
  const education = getEducation().filter(
    (e) => e.level === "tertiary" || e.level === "vocational",
  );
  const projects = getProjects().filter((p) => !p.hidden);
  const skillCategories = rowsToSkillCategories(
    useContent("skills"),
    useLanguageStore((s) => s.language),
  );

  // Reset scroll on tab switch
  useEffect(() => {
    const el = document.getElementById("p25-scroll");
    if (el) el.scrollTop = 0;
  }, [active]);

  return (
    <CContext.Provider value={C}>
      <div
        className="min-h-screen lg:h-screen lg:overflow-hidden flex items-start lg:items-center justify-center p-4 sm:p-6 lg:py-3 lg:px-3 2xl:py-10 2xl:px-6"
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
          className="w-full max-w-xl lg:max-w-6xl 2xl:max-w-7xl rounded-3xl flex flex-col lg:flex-row overflow-hidden"
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
              className="lg:w-64 2xl:w-80 shrink-0 flex flex-col"
              style={
                {
                  backgroundColor: C.sidebar,
                  overflow: "hidden",
                } as React.CSSProperties
              }
            >
              <SidebarPanel active={active} goto={setActive} />
            </div>

            {/* Main */}
            <main
              id="p25-scroll"
              className="flex-1 overflow-y-auto lg:max-h-[94vh] 2xl:max-h-[90vh]"
              style={{ backgroundColor: C.main }}
              aria-label="Portfolio content"
            >
              <h1
                style={{
                  position: "absolute",
                  width: "1px",
                  height: "1px",
                  padding: 0,
                  margin: "-1px",
                  overflow: "hidden",
                  clip: "rect(0, 0, 0, 0)",
                  whiteSpace: "nowrap",
                  border: 0,
                }}
              >
                Gene Paul Mar Javier 2025 Portfolio
              </h1>
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  {...pageAnim}
                  style={{
                    padding: isMobile
                      ? "20px 16px 28px"
                      : isCompact
                        ? "28px 32px 28px"
                        : "48px 52px 44px",
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
                    <SkillsSection skillGroups={skillCategories} />
                  )}
                  {active === "projects" && (
                    <ProjectsSection projects={projects} />
                  )}
                  {active === "testimonials" && <TestimonialsSection />}
                  {active === "languages" && <LanguagesSection />}
                  {active === "books" && <BooksSection />}
                  {active === "certificates" && <CertificatesSection />}
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
