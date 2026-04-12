"use client";

import { useState, useEffect, createContext, useContext } from "react";
import dynamic from "next/dynamic";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  MapPin,
  ArrowUpRight,
  BookOpen,
  Quote,
  ExternalLink,
  Code2,
  Briefcase,
  GraduationCap,
  Sun,
  Moon,
  Monitor,
  FileText,
} from "lucide-react";
import { ResumeModal } from "@/components/resume-modal";
import { translate, useLocaleRefresh } from "@/i18n";
import type { TxKeyPath } from "@/i18n";
import {
  FULL_NAME,
  JOB_TITLE,
  EMAIL_ADDRESS,
  getExperience,
  getEducation,
  SKILL_CATEGORIES,
  getProjects,
  TESTIMONIALS,
  LANGUAGES,
  BOOKS,
  CAREER_START_DATE,
} from "@/config";
import { GITHUB_URL, LINKED_IN_URL } from "@/config/url";
import { useSettingsStore } from "@/stores/settings-store";
import AvatarProfile from "@/assets/avatar-profile.jpg";
import AboutMeImg from "@/assets/about-me.png";

const ParticleBg = dynamic(() => import("./particle-bg"), { ssr: false });

// ── Palette ───────────────────────────────────────────────────────────────────

function makePalette(isLight: boolean) {
  return {
    // Page / sidebar — sidebar is intentionally always dark
    page: isLight ? "#FFF1F2" : "#060108",
    sidebar: "#0C0509",
    sidebarHover: "#1C0510",
    main: isLight ? "#FFFFFF" : "#0F172A",
    // Accent colours (same in both modes)
    indigo: "#FB7185",
    indigoDark: "#E11D48",
    indigoLight: isLight ? "rgba(251,113,133,0.1)" : "rgba(251,113,133,0.15)",
    mint: "#FDA4AF",
    mintDark: "#BE123C",
    mintLight: isLight ? "rgba(253,164,175,0.12)" : "rgba(253,164,175,0.18)",
    amber: "#FBBF24",
    amberLight: isLight ? "rgba(251,191,36,0.1)" : "rgba(251,191,36,0.14)",
    // Content text
    textDark: isLight ? "#0F172A" : "#F1F5F9",
    textMid: isLight ? "#334155" : "#CBD5E1",
    textMuted: isLight ? "#64748B" : "#94A3B8",
    // Sidebar text (always dark sidebar)
    textSidebar: "#F8FAFC",
    textSidebarDim: "#94A3B8",
    // Borders & cards
    border: isLight ? "#E2E8F0" : "#1E293B",
    borderSidebar: "#2A0910",
    card: isLight ? "#F8FAFC" : "#1E293B",
  };
}

type Palette = ReturnType<typeof makePalette>;
const CContext = createContext<Palette>(makePalette(false));
const useC = () => useContext(CContext);

// ── Animation variants ────────────────────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1] as const;

const pageAnim = {
  initial: { opacity: 0, y: 18, filter: "blur(6px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease },
  },
  exit: {
    opacity: 0,
    y: -10,
    filter: "blur(3px)",
    transition: { duration: 0.22, ease: "easeIn" as const },
  },
};

const listAnim = {
  animate: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } },
};

const itemAnim = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.36, ease } },
};

const iconAnim = {
  initial: { opacity: 0, scale: 0.7 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.3, ease } },
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

// ── Nav & static ──────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "about", label: "About", num: "01" },
  { id: "experience", label: "Edu & Exp", num: "02" },
  { id: "skills", label: "Tech Stack", num: "03" },
  { id: "projects", label: "Projects", num: "04" },
  { id: "testimonials", label: "Testimonials", num: "05" },
  { id: "languages", label: "Languages", num: "06" },
  { id: "books", label: "Books", num: "07" },
  { id: "contact", label: "Contact", num: "08" },
];

const SIDEBAR_STATS = [
  {
    label: "Yrs Exp",
    value: `${moment().diff(moment(CAREER_START_DATE), "years")}+`,
  },
  { label: "Projects", value: "15+" },
  { label: "Stacks", value: "30+" },
];

const LEVEL_PCT: Record<string, number> = {
  Native: 100,
  Fluent: 90,
  Conversational: 65,
  Basic: 25,
};

function makeTypeColors(
  C: Palette,
): Record<string, { bg: string; color: string; border: string }> {
  return {
    confidential: {
      bg: "rgba(239,68,68,0.08)",
      color: "#DC2626",
      border: "rgba(239,68,68,0.2)",
    },
    client: {
      bg: C.indigoLight,
      color: C.indigoDark,
      border: "rgba(225,29,72,0.2)",
    },
    personal: {
      bg: C.mintLight,
      color: C.mintDark,
      border: "rgba(190,18,60,0.2)",
    },
    tutorial: {
      bg: C.amberLight,
      color: "#B45309",
      border: "rgba(251,191,36,0.2)",
    },
  };
}

function makeThemeColors(
  C: Palette,
): Record<string, { bg: string; color: string; border: string }> {
  return {
    Purpose: {
      bg: C.indigoLight,
      color: C.indigoDark,
      border: "rgba(225,29,72,0.2)",
    },
    Humility: {
      bg: C.mintLight,
      color: C.mintDark,
      border: "rgba(190,18,60,0.2)",
    },
    Systems: {
      bg: C.amberLight,
      color: "#B45309",
      border: "rgba(251,191,36,0.2)",
    },
    Resilience: {
      bg: "rgba(99,102,241,0.08)",
      color: "#4F46E5",
      border: "rgba(99,102,241,0.2)",
    },
    Stoicism: {
      bg: "rgba(20,184,166,0.08)",
      color: "#0D9488",
      border: "rgba(20,184,166,0.2)",
    },
    Focus: {
      bg: "rgba(168,85,247,0.08)",
      color: "#9333EA",
      border: "rgba(168,85,247,0.2)",
    },
    Leadership: {
      bg: "rgba(249,115,22,0.08)",
      color: "#EA580C",
      border: "rgba(249,115,22,0.2)",
    },
    Productivity: {
      bg: "rgba(16,185,129,0.08)",
      color: "#059669",
      border: "rgba(16,185,129,0.2)",
    },
  };
}

type SkillTab = "backend" | "frontend" | "others";
// accent / glow are constant accent colours that don't change with theme
const SKILL_TABS: {
  id: SkillTab;
  label: string;
  accent: string;
  glow: string;
}[] = [
  {
    id: "backend",
    label: "Backend",
    accent: "#E11D48",
    glow: "rgba(225,29,72,0.2)",
  },
  {
    id: "frontend",
    label: "Frontend",
    accent: "#BE123C",
    glow: "rgba(190,18,60,0.18)",
  },
  {
    id: "others",
    label: "Others",
    accent: "#B45309",
    glow: "rgba(180,83,9,0.18)",
  },
];

function fmt(s: moment.Moment, e: moment.Moment | "present") {
  return `${s.format("MMM YYYY")} — ${e === "present" ? "Present" : (e as moment.Moment).format("MMM YYYY")}`;
}

// ── Main component ────────────────────────────────────────────────────────────

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
                  {active === "about" && <AboutPage />}
                  {active === "experience" && (
                    <ExperiencePage
                      experience={experience}
                      education={education}
                    />
                  )}
                  {active === "skills" && (
                    <SkillsPage skillGroups={SKILL_CATEGORIES} />
                  )}
                  {active === "projects" && (
                    <ProjectsPage projects={projects} />
                  )}
                  {active === "testimonials" && <TestimonialsPage />}
                  {active === "languages" && <LanguagesPage />}
                  {active === "books" && <BooksPage />}
                  {active === "contact" && <ContactPage />}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </motion.div>
      </div>
    </CContext.Provider>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

function SidebarPanel({
  active,
  goto,
}: {
  active: string;
  goto: (id: string) => void;
}) {
  const C = useC();
  const isMobile = useIsMobile();
  return (
    <>
      {/* Profile */}
      <div
        style={{
          padding: isMobile ? "16px 16px 12px" : "36px 24px 20px",
          textAlign: "center",
        }}
      >
        {/* Avatar with pulsing rings */}
        <div
          style={{
            display: "inline-block",
            position: "relative",
            marginBottom: "18px",
          }}
        >
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              style={{
                position: "absolute",
                inset: `-${i * 12}px`,
                borderRadius: "50%",
                border: `1px solid rgba(225,29,72,${0.4 - i * 0.1})`,
              }}
              animate={{ scale: [1, 1.12], opacity: [0.6, 0] }}
              transition={{
                duration: 2.2,
                delay: i * 0.5,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ))}
          <motion.div
            style={{
              borderRadius: "50%",
              padding: "3px",
              background: `linear-gradient(135deg, ${C.indigoDark}, ${C.indigo})`,
              boxShadow: `0 0 32px rgba(225,29,72,0.5)`,
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div
              style={{
                width: isMobile ? "72px" : "108px",
                height: isMobile ? "72px" : "108px",
                borderRadius: "50%",
                overflow: "hidden",
              }}
            >
              <img
                src={AvatarProfile as unknown as string}
                alt={FULL_NAME}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "top",
                }}
              />
            </div>
          </motion.div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          style={{
            color: C.textSidebar,
            fontSize: "16px",
            fontWeight: 800,
            lineHeight: 1.3,
            margin: 0,
          }}
        >
          {FULL_NAME}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          style={{
            fontSize: "12px",
            fontWeight: 600,
            marginTop: "5px",
            color: C.indigo,
          }}
        >
          {JOB_TITLE}
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          style={{
            display: "flex",
            marginTop: "18px",
            gap: "1px",
            borderRadius: "12px",
            overflow: "hidden",
            border: `1px solid ${C.borderSidebar}`,
          }}
        >
          {SIDEBAR_STATS.map(({ label, value }) => (
            <div
              key={label}
              style={{
                flex: 1,
                padding: "10px 6px",
                textAlign: "center",
                backgroundColor: C.sidebarHover,
              }}
            >
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: 800,
                  color: C.indigo,
                  margin: 0,
                }}
              >
                {value}
              </p>
              <p
                style={{
                  fontSize: "10px",
                  color: C.textSidebarDim,
                  margin: 0,
                  letterSpacing: "0.04em",
                }}
              >
                {label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      <Separator />

      {/* Social */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          padding: "14px 0",
        }}
      >
        {[
          { href: GITHUB_URL, Icon: Github, label: "GitHub" },
          { href: LINKED_IN_URL, Icon: Linkedin, label: "LinkedIn" },
          { href: `mailto:${EMAIL_ADDRESS}`, Icon: Mail, label: "Email" },
        ].map(({ href, Icon, label }) => (
          <motion.a
            key={label}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            aria-label={label}
            whileHover={{ scale: 1.12, backgroundColor: C.indigoDark }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: C.sidebarHover,
              color: C.textSidebarDim,
              border: `1px solid ${C.borderSidebar}`,
              textDecoration: "none",
            }}
          >
            <Icon size={16} />
          </motion.a>
        ))}
      </motion.div>

      <Separator />

      {/* Nav */}
      <nav
        aria-label="Portfolio sections"
        style={
          isMobile
            ? {
                padding: "8px 0",
                overflowX: "auto",
                display: "flex",
                flexDirection: "row",
                scrollbarWidth: "none",
              }
            : { padding: "14px 10px", flex: 1 }
        }
      >
        {NAV_ITEMS.map(({ id, label, num }, i) => {
          const on = active === id;
          if (isMobile) {
            return (
              <motion.button
                key={id}
                onClick={() => goto(id)}
                whileTap={{ scale: 0.95 }}
                aria-current={on ? "page" : undefined}
                style={{
                  padding: "8px 14px",
                  borderRadius: "20px",
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  fontSize: "12px",
                  fontWeight: 700,
                  backgroundColor: on ? C.indigoDark : "transparent",
                  color: on ? "#fff" : C.textSidebarDim,
                  marginLeft: i === 0 ? "8px" : "4px",
                  marginRight: i === NAV_ITEMS.length - 1 ? "8px" : "0",
                  transition: "background-color 0.15s, color 0.15s",
                }}
              >
                {label}
              </motion.button>
            );
          }
          return (
            <motion.button
              key={id}
              onClick={() => goto(id)}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.04, duration: 0.3 }}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
              aria-current={on ? "page" : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "11px 14px",
                borderRadius: "10px",
                width: "100%",
                textAlign: "left",
                cursor: "pointer",
                borderTop: "none",
                borderRight: "none",
                borderBottom: "none",
                backgroundColor: on ? C.sidebarHover : "transparent",
                borderLeft: `2px solid ${on ? C.indigoDark : "transparent"}`,
                transition: "background-color 0.15s, border-left-color 0.15s",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: on ? C.indigoDark : C.borderSidebar,
                }}
              >
                {num}
              </span>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: on ? C.textSidebar : C.textSidebarDim,
                }}
              >
                {label}
              </span>
              {on && (
                <motion.div
                  layoutId="nav-dot"
                  style={{
                    marginLeft: "auto",
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor: C.indigoDark,
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      <div
        style={{
          padding: "10px 20px 16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {/* Theme toggle */}
        <ThemeToggle />
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "10px",
            color: C.textSidebarDim,
          }}
        >
          <MapPin size={9} /> Cebu, Philippines
        </span>
      </div>
    </>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useSettingsStore();
  const OPTS = [
    { value: "light", Icon: Sun },
    { value: "system", Icon: Monitor },
    { value: "dark", Icon: Moon },
  ] as const;
  return (
    <div
      role="group"
      aria-label="Color theme"
      style={{
        display: "flex",
        gap: "2px",
        padding: "3px",
        backgroundColor: "#1C0510",
        borderRadius: "8px",
        border: "1px solid #2A0910",
      }}
    >
      {OPTS.map(({ value, Icon }) => {
        const on = theme === value;
        return (
          <motion.button
            key={value}
            onClick={() => setTheme(value)}
            whileTap={{ scale: 0.92 }}
            aria-label={`${value.charAt(0).toUpperCase() + value.slice(1)} theme`}
            aria-pressed={on}
            title={value.charAt(0).toUpperCase() + value.slice(1)}
            style={{
              width: "26px",
              height: "22px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: on ? "#E11D48" : "transparent",
              color: on ? "#fff" : "#94A3B8",
              transition: "background-color 0.15s, color 0.15s",
            }}
          >
            <Icon size={11} />
          </motion.button>
        );
      })}
    </div>
  );
}

// ── Page: About ───────────────────────────────────────────────────────────────

function AboutPage() {
  const C = useC();
  const isMobile = useIsMobile();
  const [resumeOpen, setResumeOpen] = useState(false);

  const HIGHLIGHTS = [
    {
      icon: "⚡",
      title: "Full-Stack Dev",
      desc: "End-to-end features from database schema to polished UI, with a focus on clean, production-ready code.",
    },
    {
      icon: "🎨",
      title: "UI / UX Focused",
      desc: "I care about the details — responsive layouts, fluid animations, and interfaces that feel great to use.",
    },
    {
      icon: "🤝",
      title: "Remote-Ready",
      desc: "Comfortable in async, distributed teams. Strong communicator who ships reliably without hand-holding.",
    },
  ];

  return (
    <>
      <Label text="01 — About" />
      <h2
        style={{
          fontSize: isMobile ? "24px" : "34px",
          fontWeight: 900,
          letterSpacing: "-0.5px",
          margin: "4px 0 20px",
          color: C.textDark,
        }}
      >
        About Me<span style={{ color: C.indigoDark }}>.</span>
      </h2>

      <motion.div
        variants={listAnim}
        initial="initial"
        animate="animate"
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
      >
        {/* Intro + photo */}
        <motion.div
          variants={itemAnim}
          style={{
            display: "flex",
            gap: "24px",
            alignItems: "flex-start",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: "14px",
                lineHeight: 1.85,
                color: C.textMid,
                margin: "0 0 12px",
              }}
            >
              {translate("about.intro.intruduction")}
            </p>
            <p
              style={{
                fontSize: "14px",
                lineHeight: 1.85,
                color: C.textMuted,
                margin: 0,
              }}
            >
              When I'm not shipping code I'm reading, exploring system design,
              or tinkering with side projects that scratch a creative itch.
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.04, rotate: 1.5 }}
            transition={{ type: "spring", stiffness: 300 }}
            style={{
              width: "112px",
              height: "144px",
              flexShrink: 0,
              display: isMobile ? "none" : undefined,
              borderRadius: "14px",
              overflow: "hidden",
              border: `2px solid ${C.indigoDark}44`,
              boxShadow: `0 8px 24px rgba(225,29,72,0.18)`,
            }}
          >
            <img
              src={AboutMeImg as unknown as string}
              alt={FULL_NAME}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top",
              }}
            />
          </motion.div>
        </motion.div>

        {/* What I do highlights */}
        <motion.div variants={itemAnim}>
          <p
            style={{
              fontSize: "12px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: C.textMuted,
              margin: "0 0 12px",
            }}
          >
            What I bring
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
              gap: "10px",
            }}
          >
            {HIGHLIGHTS.map(({ icon, title, desc }) => (
              <motion.div
                key={title}
                whileHover={{
                  y: -3,
                  boxShadow: `0 8px 24px rgba(225,29,72,0.12)`,
                }}
                style={{
                  padding: "18px 14px",
                  borderRadius: "16px",
                  border: `1px solid ${C.border}`,
                  backgroundColor: C.card,
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <span style={{ fontSize: "24px", lineHeight: 1 }}>{icon}</span>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: C.textDark,
                    margin: 0,
                  }}
                >
                  {title}
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    lineHeight: 1.6,
                    color: C.textMuted,
                    margin: 0,
                  }}
                >
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact details */}
        <motion.div
          variants={itemAnim}
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: "10px",
            padding: "18px",
            borderRadius: "16px",
            backgroundColor: C.card,
            border: `1px solid ${C.border}`,
          }}
        >
          {[
            {
              Icon: Mail,
              text: EMAIL_ADDRESS,
              href: `mailto:${EMAIL_ADDRESS}`,
            },
            { Icon: MapPin, text: "Cebu, Philippines", href: undefined },
            {
              Icon: Github,
              text: "github.com/javiergenepaul",
              href: GITHUB_URL,
            },
            {
              Icon: Linkedin,
              text: "linkedin/gene-paul-mar-javier",
              href: LINKED_IN_URL,
            },
          ].map(({ Icon, text, href }) =>
            href ? (
              <motion.a
                key={text}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                whileHover={{ color: C.indigoDark, x: 2 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13px",
                  color: C.textMuted,
                  textDecoration: "none",
                }}
              >
                <Icon
                  size={13}
                  style={{ color: C.indigoDark, flexShrink: 0 }}
                />
                <span
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {text}
                </span>
              </motion.a>
            ) : (
              <span
                key={text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13px",
                  color: C.textMuted,
                }}
              >
                <Icon
                  size={13}
                  style={{ color: C.indigoDark, flexShrink: 0 }}
                />
                {text}
              </span>
            ),
          )}
        </motion.div>

        {/* Resume CTA */}
        <motion.button
          variants={itemAnim}
          onClick={() => setResumeOpen(true)}
          whileHover={{
            scale: 1.02,
            boxShadow: `0 12px 32px rgba(225,29,72,0.45)`,
          }}
          whileTap={{ scale: 0.98 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            padding: "15px 24px",
            borderRadius: "14px",
            border: "none",
            cursor: "pointer",
            background: `linear-gradient(135deg, ${C.indigoDark}, ${C.indigo})`,
            color: "#fff",
            fontSize: "14px",
            fontWeight: 700,
            boxShadow: `0 8px 24px rgba(225,29,72,0.35)`,
            width: "100%",
          }}
        >
          <FileText size={16} />
          Build My Resume
        </motion.button>

        <ResumeModal
          open={resumeOpen}
          onClose={() => setResumeOpen(false)}
          year={2025}
          accentColor="#E11D48"
          defaultColor="scarlet"
        />
      </motion.div>
    </>
  );
}

// ── Page: Education & Experience ──────────────────────────────────────────────

function ExperiencePage({
  experience,
  education,
}: {
  experience: ReturnType<typeof getExperience>;
  education: ReturnType<typeof getEducation>;
}) {
  const C = useC();
  const isMobile = useIsMobile();
  return (
    <>
      <Label text="02 — Education & Experience" />
      <h2
        style={{
          fontSize: isMobile ? "24px" : "34px",
          fontWeight: 900,
          letterSpacing: "-0.5px",
          margin: "4px 0 24px",
          color: C.textDark,
        }}
      >
        My Journey<span style={{ color: C.indigo }}>.</span>
      </h2>

      {/* Education */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "14px",
        }}
      >
        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "10px",
            backgroundColor: C.indigoLight,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <GraduationCap size={16} style={{ color: C.indigoDark }} />
        </div>
        <SectionLabel>Education</SectionLabel>
      </div>

      <motion.div
        variants={listAnim}
        initial="initial"
        animate="animate"
        style={{
          position: "relative",
          paddingLeft: "16px",
          marginBottom: "32px",
        }}
      >
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          style={{
            position: "absolute",
            left: 0,
            top: "4px",
            bottom: "4px",
            width: "2px",
            borderRadius: "2px",
            background: `linear-gradient(to bottom, ${C.indigoDark}, ${C.indigo}33)`,
            transformOrigin: "top",
          }}
        />
        {education.map((edu, i) => (
          <motion.div
            key={i}
            variants={itemAnim}
            whileHover={{ x: 3, boxShadow: `0 4px 20px rgba(225,29,72,0.12)` }}
            style={{
              position: "relative",
              marginBottom: "10px",
              borderRadius: "16px",
              padding: "18px 20px",
              border: `1px solid ${C.border}`,
              backgroundColor: C.card,
              cursor: "default",
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              style={{
                position: "absolute",
                left: "-24px",
                top: "22px",
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: C.indigoDark,
                border: `2px solid ${C.page}`,
                boxShadow: `0 0 8px rgba(225,29,72,0.5)`,
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "12px",
              }}
            >
              <div>
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: "15px",
                    color: C.textDark,
                    margin: 0,
                  }}
                >
                  {edu.title}
                </p>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: C.indigoDark,
                    marginTop: "3px",
                  }}
                >
                  {edu.subtitle}
                </p>
              </div>
              <span
                style={{
                  fontSize: "11px",
                  padding: "4px 11px",
                  borderRadius: "99px",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  backgroundColor: C.indigoLight,
                  color: C.indigoDark,
                }}
              >
                {fmt(edu.startYear, edu.endYear)}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Experience */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "14px",
        }}
      >
        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "10px",
            backgroundColor: C.mintLight,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Briefcase size={16} style={{ color: C.mintDark }} />
        </div>
        <SectionLabel>Work Experience</SectionLabel>
      </div>

      <motion.div
        variants={listAnim}
        initial="initial"
        animate="animate"
        style={{ position: "relative", paddingLeft: "16px" }}
      >
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease }}
          style={{
            position: "absolute",
            left: 0,
            top: "4px",
            bottom: "4px",
            width: "2px",
            borderRadius: "2px",
            background: `linear-gradient(to bottom, ${C.mintDark}, ${C.mint}33)`,
            transformOrigin: "top",
          }}
        />
        {experience.map((exp, i) => (
          <motion.div
            key={i}
            variants={itemAnim}
            whileHover={{ x: 3, boxShadow: `0 4px 20px rgba(190,18,60,0.1)` }}
            style={{
              position: "relative",
              marginBottom: "10px",
              borderRadius: "16px",
              padding: "18px 20px",
              border: `1px solid ${C.border}`,
              backgroundColor: C.card,
              cursor: "default",
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              style={{
                position: "absolute",
                left: "-24px",
                top: "22px",
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: C.mintDark,
                border: `2px solid ${C.page}`,
                boxShadow: `0 0 8px rgba(190,18,60,0.5)`,
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "12px",
                marginBottom: "8px",
              }}
            >
              <div>
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: "15px",
                    color: C.textDark,
                    margin: 0,
                  }}
                >
                  {exp.title}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginTop: "4px",
                    flexWrap: "wrap",
                  }}
                >
                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: C.indigo,
                      margin: 0,
                    }}
                  >
                    {exp.subtitle}
                  </p>
                  {exp.employmentType && (
                    <span
                      style={{
                        fontSize: "10px",
                        padding: "2px 8px",
                        borderRadius: "99px",
                        fontWeight: 600,
                        backgroundColor: C.mintLight,
                        color: C.mintDark,
                      }}
                    >
                      {exp.employmentType}
                    </span>
                  )}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    padding: "4px 11px",
                    borderRadius: "99px",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    backgroundColor: C.mintLight,
                    color: C.mintDark,
                  }}
                >
                  {fmt(exp.startYear, exp.endYear)}
                </span>
                {exp.subtitleUrl && (
                  <a
                    href={exp.subtitleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: C.textMuted }}
                  >
                    <ArrowUpRight size={15} />
                  </a>
                )}
              </div>
            </div>
            {exp.promotion && exp.promotion.length > 0 ? (
              <ul
                style={{
                  margin: "10px 0 0",
                  padding: "0 0 0 14px",
                  borderLeft: `2px solid ${C.indigoDark}33`,
                  listStyle: "none",
                }}
              >
                {exp.promotion.map((p, j) => (
                  <li key={j} style={{ marginBottom: "6px" }}>
                    <p
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: C.textMid,
                        margin: 0,
                      }}
                    >
                      {p.title}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: C.textMuted,
                        margin: "2px 0 0",
                      }}
                    >
                      {fmt(p.startYear, p.endYear)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p
                style={{
                  fontSize: "13px",
                  lineHeight: 1.65,
                  color: C.textMuted,
                  margin: 0,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {exp.description}
              </p>
            )}
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}

// ── Page: Tech Stack ──────────────────────────────────────────────────────────

function SkillsPage({ skillGroups }: { skillGroups: typeof SKILL_CATEGORIES }) {
  const C = useC();
  const isMobile = useIsMobile();
  const [tab, setTab] = useState<SkillTab>("backend");

  const grouped: Record<SkillTab, typeof SKILL_CATEGORIES> = {
    backend: skillGroups.filter((c) => c.key === "backend"),
    frontend: skillGroups.filter((c) => c.key === "frontend"),
    others: skillGroups.filter(
      (c) => c.key !== "backend" && c.key !== "frontend",
    ),
  };

  const activeTab = SKILL_TABS.find((t) => t.id === tab)!;
  const activeGroups = grouped[tab];

  return (
    <>
      <Label text="03 — Tech Stack" />
      <h2
        style={{
          fontSize: isMobile ? "24px" : "34px",
          fontWeight: 900,
          letterSpacing: "-0.5px",
          margin: "4px 0 20px",
          color: C.textDark,
        }}
      >
        Tech Stack<span style={{ color: C.amber }}>.</span>
      </h2>

      {/* Tab nav */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          marginBottom: "28px",
          padding: "5px",
          backgroundColor: "#0F172A",
          borderRadius: "14px",
        }}
      >
        {SKILL_TABS.map(({ id, label, accent }) => {
          const on = tab === id;
          return (
            <motion.button
              key={id}
              onClick={() => setTab(id)}
              whileTap={{ scale: 0.97 }}
              style={{
                flex: 1,
                padding: "10px 0",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 700,
                position: "relative",
                overflow: "hidden",
                background: on
                  ? `linear-gradient(135deg, ${accent}cc, ${accent})`
                  : "transparent",
                color: on ? "#fff" : "#64748B",
                boxShadow: on ? `0 4px 14px ${accent}66` : "none",
                transition: "all 0.2s",
              }}
            >
              {label}
            </motion.button>
          );
        })}
      </div>

      {/* Icon grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25, ease }}
        >
          {activeGroups.map((cat) => (
            <div key={cat.key} style={{ marginBottom: "20px" }}>
              {activeGroups.length > 1 && (
                <p
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: C.textMuted,
                    margin: "0 0 12px",
                  }}
                >
                  {cat.label}
                </p>
              )}
              <motion.div
                variants={listAnim}
                initial="initial"
                animate="animate"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))",
                  gap: "10px",
                }}
              >
                {cat.stacks.map((s) => {
                  const displayName = translate(
                    `services.stack.${s.name}` as TxKeyPath,
                  );
                  return (
                    <motion.div
                      key={s.name}
                      variants={iconAnim}
                      whileHover={{
                        scale: 1.07,
                        y: -3,
                        boxShadow: `0 8px 24px ${activeTab.glow}, 0 0 0 1px ${activeTab.accent}44`,
                      }}
                      whileTap={{ scale: 0.96 }}
                      title={displayName}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "10px",
                        padding: "18px 10px 14px",
                        borderRadius: "16px",
                        cursor: "default",
                        background: "#0F172A",
                        border: `1px solid rgba(255,255,255,0.06)`,
                        boxShadow: s.isFavorite
                          ? `0 0 0 1px ${activeTab.accent}44, 0 4px 16px ${activeTab.glow}`
                          : "none",
                        position: "relative",
                        overflow: "hidden",
                        transition: "box-shadow 0.2s",
                      }}
                    >
                      {/* Glow blob */}
                      <div
                        style={{
                          position: "absolute",
                          top: "8px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "52px",
                          height: "52px",
                          borderRadius: "50%",
                          background: activeTab.glow,
                          filter: "blur(16px)",
                          pointerEvents: "none",
                        }}
                      />

                      {/* Icon */}
                      <div
                        style={{
                          position: "relative",
                          width: "40px",
                          height: "40px",
                        }}
                      >
                        <img
                          src={s.icon as unknown as string}
                          alt={s.alt}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                        />
                      </div>

                      {/* Name */}
                      <p
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          textAlign: "center",
                          color: "#CBD5E1",
                          margin: 0,
                          lineHeight: 1.3,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "100%",
                        }}
                      >
                        {displayName}
                      </p>

                      {/* Favorite star */}
                      {s.isFavorite && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            delay: 0.1,
                            type: "spring",
                            stiffness: 400,
                          }}
                          style={{
                            position: "absolute",
                            top: "6px",
                            right: "6px",
                          }}
                        >
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill={C.amber}
                            stroke="none"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

// ── Page: Projects ────────────────────────────────────────────────────────────

function ProjectsPage({
  projects,
}: {
  projects: ReturnType<typeof getProjects>;
}) {
  const C = useC();
  const isMobile = useIsMobile();
  const TYPE_COLORS = makeTypeColors(C);
  return (
    <>
      <Label text="04 — Projects" />
      <h2
        style={{
          fontSize: isMobile ? "24px" : "34px",
          fontWeight: 900,
          letterSpacing: "-0.5px",
          margin: "4px 0 24px",
          color: C.textDark,
        }}
      >
        Projects<span style={{ color: C.indigoDark }}>.</span>
      </h2>

      <motion.div
        variants={listAnim}
        initial="initial"
        animate="animate"
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
      >
        {projects.map((p) => {
          const tc = TYPE_COLORS[p.type] ?? TYPE_COLORS.personal;
          return (
            <motion.div
              key={p.projectId}
              variants={itemAnim}
              whileHover={{ x: 3, boxShadow: `0 6px 24px rgba(225,29,72,0.1)` }}
              style={{
                padding: "20px 22px",
                borderRadius: "16px",
                border: `1px solid ${C.border}`,
                backgroundColor: C.card,
                cursor: "default",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "12px",
                  marginBottom: "8px",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      flexWrap: "wrap",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "15px",
                        fontWeight: 700,
                        color: C.textDark,
                        margin: 0,
                      }}
                    >
                      {p.title}
                    </p>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "3px 10px",
                        borderRadius: "99px",
                        backgroundColor: tc.bg,
                        color: tc.color,
                        border: `1px solid ${tc.border}`,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {p.type}
                    </span>
                  </div>
                  {p.company && (
                    <p
                      style={{
                        fontSize: "12px",
                        color: C.textMuted,
                        margin: "3px 0 0",
                      }}
                    >
                      {p.company}
                    </p>
                  )}
                </div>
                <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                  {p.previewUrl && (
                    <motion.a
                      href={p.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: C.indigoDark,
                        color: "#fff",
                      }}
                      style={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: C.indigoLight,
                        color: C.indigoDark,
                        border: `1px solid rgba(225,29,72,0.2)`,
                        textDecoration: "none",
                      }}
                    >
                      <ExternalLink size={14} />
                    </motion.a>
                  )}
                  {p.codeUrl && (
                    <motion.a
                      href={p.codeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: C.sidebarHover,
                        color: C.indigo,
                      }}
                      style={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: C.card,
                        color: C.textMuted,
                        border: `1px solid ${C.border}`,
                        textDecoration: "none",
                      }}
                    >
                      <Code2 size={14} />
                    </motion.a>
                  )}
                </div>
              </div>
              <p
                style={{
                  fontSize: "13px",
                  lineHeight: 1.65,
                  color: C.textMuted,
                  margin: "0 0 12px",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {p.description}
              </p>
              {p.stack && p.stack.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {p.stack.slice(0, 6).map((s) => (
                    <span
                      key={s.name}
                      style={{
                        fontSize: "11px",
                        padding: "3px 10px",
                        borderRadius: "99px",
                        backgroundColor: `${C.border}66`,
                        color: C.textMuted,
                        border: `1px solid ${C.border}`,
                      }}
                    >
                      {s.name}
                    </span>
                  ))}
                  {p.stack.length > 6 && (
                    <span
                      style={{
                        fontSize: "11px",
                        padding: "3px 10px",
                        borderRadius: "99px",
                        color: C.textMuted,
                      }}
                    >
                      +{p.stack.length - 6}
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </>
  );
}

// ── Page: Testimonials ────────────────────────────────────────────────────────

function TestimonialsPage() {
  const C = useC();
  const isMobile = useIsMobile();
  return (
    <>
      <Label text="05 — Testimonials" />
      <h2
        style={{
          fontSize: isMobile ? "24px" : "34px",
          fontWeight: 900,
          letterSpacing: "-0.5px",
          margin: "4px 0 24px",
          color: C.textDark,
        }}
      >
        What They Say<span style={{ color: C.indigo }}>.</span>
      </h2>

      {TESTIMONIALS.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 20px",
            borderRadius: "16px",
            border: `1.5px dashed ${C.border}`,
            backgroundColor: C.card,
            gap: "12px",
            textAlign: "center",
          }}
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              backgroundColor: C.indigoLight,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Quote size={22} style={{ color: C.indigoDark }} />
          </motion.div>
          <p
            style={{
              fontWeight: 700,
              fontSize: "14px",
              color: C.textDark,
              margin: 0,
            }}
          >
            No testimonials yet
          </p>
          <p
            style={{
              fontSize: "12px",
              color: C.textMuted,
              margin: 0,
              maxWidth: "260px",
              lineHeight: 1.6,
            }}
          >
            Testimonials will appear here once collected.
          </p>
        </motion.div>
      ) : (
        <motion.div
          variants={listAnim}
          initial="initial"
          animate="animate"
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: "12px",
          }}
        >
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              variants={itemAnim}
              whileHover={{
                y: -3,
                boxShadow: `0 8px 28px rgba(225,29,72,0.12)`,
              }}
              style={{
                padding: "18px",
                borderRadius: "14px",
                border: `1px solid ${C.border}`,
                backgroundColor: C.card,
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div style={{ display: "flex", gap: "2px" }}>
                {Array.from({ length: 5 }).map((_, s) => (
                  <svg
                    key={s}
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill={s < Math.floor(t.rating) ? C.amber : C.border}
                    stroke="none"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <div style={{ position: "relative" }}>
                <Quote
                  size={16}
                  style={{
                    color: C.indigoLight,
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                />
                <p
                  style={{
                    fontSize: "12px",
                    lineHeight: 1.7,
                    color: C.textMid,
                    margin: 0,
                    paddingLeft: "20px",
                  }}
                >
                  {t.text}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  paddingTop: "4px",
                  borderTop: `1px solid ${C.border}`,
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${C.indigoDark}, ${C.indigo})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{ fontSize: "10px", fontWeight: 700, color: "#fff" }}
                  >
                    {t.avatar}
                  </span>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: C.textDark,
                      margin: 0,
                    }}
                  >
                    {t.name}
                  </p>
                  <p
                    style={{
                      fontSize: "10px",
                      color: C.textMuted,
                      margin: "1px 0 0",
                    }}
                  >
                    {t.role} · {t.company}
                  </p>
                </div>
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: "9px",
                    padding: "2px 8px",
                    borderRadius: "99px",
                    fontWeight: 600,
                    backgroundColor: C.mintLight,
                    color: C.mintDark,
                  }}
                >
                  {t.relationship}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </>
  );
}

// ── Page: Languages ───────────────────────────────────────────────────────────

function AnimatedBar({
  pct,
  accent,
  delay = 0,
}: {
  pct: number;
  accent: string;
  delay?: number;
}) {
  const C = useC();
  return (
    <div
      style={{
        height: "6px",
        borderRadius: "99px",
        backgroundColor: C.border,
        overflow: "hidden",
      }}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
        style={{ height: "100%", borderRadius: "99px", background: accent }}
      />
    </div>
  );
}

function LanguagesPage() {
  const C = useC();
  const isMobile = useIsMobile();
  return (
    <>
      <Label text="06 — Languages" />
      <h2
        style={{
          fontSize: isMobile ? "24px" : "34px",
          fontWeight: 900,
          letterSpacing: "-0.5px",
          margin: "4px 0 8px",
          color: C.textDark,
        }}
      >
        Languages<span style={{ color: C.mint }}>.</span>
      </h2>
      <p
        style={{
          fontSize: "13px",
          color: C.textMuted,
          marginBottom: "28px",
          lineHeight: 1.6,
        }}
      >
        Spoken languages I use for communication and collaboration.
      </p>

      <motion.div
        variants={listAnim}
        initial="initial"
        animate="animate"
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
      >
        {LANGUAGES.map((l, i) => {
          const pct = LEVEL_PCT[l.level] ?? 50;
          return (
            <motion.div
              key={l.name}
              variants={itemAnim}
              whileHover={{ x: 3 }}
              style={{
                padding: "16px 18px",
                borderRadius: "14px",
                border: `1px solid ${C.border}`,
                backgroundColor: C.card,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "10px",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: C.textDark,
                      margin: 0,
                    }}
                  >
                    {l.name}
                  </p>
                  <p
                    style={{
                      fontSize: "11px",
                      color: C.textMuted,
                      margin: "2px 0 0",
                    }}
                  >
                    {l.nativeName}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: "10px",
                    padding: "3px 10px",
                    borderRadius: "99px",
                    fontWeight: 600,
                    backgroundColor: C.indigoLight,
                    color: C.indigoDark,
                  }}
                >
                  {l.level}
                </span>
              </div>
              <AnimatedBar
                pct={pct}
                delay={i * 0.1 + 0.2}
                accent={`linear-gradient(to right, ${C.indigoDark}, ${C.indigo})`}
              />
              <p
                style={{
                  fontSize: "11px",
                  color: C.textMuted,
                  margin: "8px 0 0",
                }}
              >
                {l.note}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </>
  );
}

// ── Page: Books ───────────────────────────────────────────────────────────────

function BooksPage() {
  const C = useC();
  const isMobile = useIsMobile();
  const THEME_COLORS = makeThemeColors(C);
  return (
    <>
      <Label text="07 — Books" />
      <h2
        style={{
          fontSize: isMobile ? "24px" : "34px",
          fontWeight: 900,
          letterSpacing: "-0.5px",
          margin: "4px 0 8px",
          color: C.textDark,
        }}
      >
        Books That Built Me<span style={{ color: C.amber }}>.</span>
      </h2>
      <p
        style={{
          fontSize: "13px",
          color: C.textMuted,
          marginBottom: "24px",
          lineHeight: 1.6,
        }}
      >
        A curated list of books that shaped the way I think, lead, and build.
      </p>

      <motion.div
        variants={listAnim}
        initial="initial"
        animate="animate"
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: "10px",
        }}
      >
        {BOOKS.map((b, i) => {
          const tc = THEME_COLORS[b.theme] ?? {
            bg: C.card,
            color: C.textMuted,
            border: C.border,
          };
          return (
            <motion.div
              key={i}
              variants={itemAnim}
              whileHover={{
                y: -4,
                boxShadow: `0 10px 30px ${tc.bg.replace("0.08", "0.25")}`,
              }}
              style={{
                padding: "16px",
                borderRadius: "14px",
                border: `1px solid ${C.border}`,
                backgroundColor: C.card,
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "8px",
                }}
              >
                <motion.div
                  whileHover={{ rotate: 8 }}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    backgroundColor: tc.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `1px solid ${tc.border}`,
                    flexShrink: 0,
                  }}
                >
                  <BookOpen size={16} style={{ color: tc.color }} />
                </motion.div>
                <span
                  style={{
                    fontSize: "9px",
                    fontWeight: 600,
                    padding: "3px 8px",
                    borderRadius: "99px",
                    backgroundColor: tc.bg,
                    color: tc.color,
                    border: `1px solid ${tc.border}`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {b.theme}
                </span>
              </div>
              <div>
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: C.textDark,
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  {b.title}
                </p>
                <p
                  style={{
                    fontSize: "11px",
                    color: C.textMuted,
                    margin: "2px 0 8px",
                  }}
                >
                  {b.author}
                </p>
                <p
                  style={{
                    fontSize: "11px",
                    color: C.textMid,
                    lineHeight: 1.6,
                    margin: 0,
                    fontStyle: "italic",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  "{b.quote}"
                </p>
              </div>
              <p
                style={{
                  fontSize: "11px",
                  color: C.textMuted,
                  lineHeight: 1.5,
                  margin: 0,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {b.reflection}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </>
  );
}

// ── Page: Contact ─────────────────────────────────────────────────────────────

function ContactPage() {
  const C = useC();
  const isMobile = useIsMobile();
  return (
    <>
      <Label text="08 — Contact" />
      <h2
        style={{
          fontSize: isMobile ? "24px" : "34px",
          fontWeight: 900,
          letterSpacing: "-0.5px",
          margin: "4px 0 8px",
          color: C.textDark,
        }}
      >
        Get In Touch<span style={{ color: C.indigoDark }}>.</span>
      </h2>
      <p
        style={{
          fontSize: "13px",
          color: C.textMuted,
          marginBottom: "28px",
          lineHeight: 1.6,
        }}
      >
        Have a project in mind or just want to say hi? My inbox is always open.
      </p>

      <motion.div
        variants={listAnim}
        initial="initial"
        animate="animate"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginBottom: "28px",
        }}
      >
        {[
          {
            Icon: Mail,
            label: "Email",
            value: EMAIL_ADDRESS,
            href: `mailto:${EMAIL_ADDRESS}`,
          },
          {
            Icon: Github,
            label: "GitHub",
            value: "github.com/javiergenepaul",
            href: GITHUB_URL,
          },
          {
            Icon: Linkedin,
            label: "LinkedIn",
            value: "linkedin/gene-paul-mar-javier",
            href: LINKED_IN_URL,
          },
          {
            Icon: MapPin,
            label: "Location",
            value: "Cebu, Philippines",
            href: undefined,
          },
        ].map(({ Icon, label, value, href }) => (
          <motion.div
            key={label}
            variants={itemAnim}
            whileHover={{ x: 4, boxShadow: `0 4px 20px rgba(225,29,72,0.1)` }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "14px 16px",
              borderRadius: "12px",
              backgroundColor: C.card,
              border: `1px solid ${C.border}`,
            }}
          >
            <motion.div
              whileHover={{ scale: 1.1, backgroundColor: C.indigoDark }}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                flexShrink: 0,
                backgroundColor: C.indigoLight,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon size={15} style={{ color: C.indigoDark }} />
            </motion.div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: C.textMuted,
                  margin: 0,
                }}
              >
                {label}
              </p>
              {href ? (
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: C.indigoDark,
                    textDecoration: "none",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "block",
                  }}
                >
                  {value}
                </a>
              ) : (
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: C.textDark,
                    margin: 0,
                  }}
                >
                  {value}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.a
        href={`mailto:${EMAIL_ADDRESS}`}
        whileHover={{
          scale: 1.02,
          boxShadow: `0 12px 32px rgba(225,29,72,0.5)`,
        }}
        whileTap={{ scale: 0.98 }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "13px 24px",
          borderRadius: "12px",
          textDecoration: "none",
          background: `linear-gradient(135deg, ${C.indigoDark}, ${C.indigo})`,
          color: "#fff",
          fontSize: "13px",
          fontWeight: 700,
          boxShadow: `0 8px 24px rgba(225,29,72,0.4)`,
        }}
      >
        <Mail size={15} />
        Send me an email
      </motion.a>
    </>
  );
}

// ── Shared ────────────────────────────────────────────────────────────────────

function Separator() {
  const C = useC();
  return (
    <div
      style={{
        margin: "0 20px",
        height: "1px",
        background: `linear-gradient(to right, ${C.indigoDark}44, ${C.indigo}44)`,
      }}
    />
  );
}

function Label({ text }: { text: string }) {
  const C = useC();
  return (
    <p
      style={{
        fontSize: "12px",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        color: C.textMuted,
        margin: 0,
      }}
    >
      {text}
    </p>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  const C = useC();
  return (
    <p
      style={{
        fontSize: "13px",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: C.textMuted,
        margin: 0,
      }}
    >
      {children}
    </p>
  );
}
