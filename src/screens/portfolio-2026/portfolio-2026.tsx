"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import { motion, useMotionValue, AnimatePresence } from "framer-motion";
import type { PanInfo } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  FolderOpen,
  Settings2,
  TerminalSquare,
  Github,
  Linkedin,
  Mail,
  MapPin,
  GraduationCap,
  ExternalLink,
  Search,
  Command,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Lock,
  FolderGit2,
  FileCode,
  User,
  FileText,
  X,
  Minus,
  Maximize2,
  Sun,
  Moon,
  Check,
  ZoomIn,
  ZoomOut,
  Download,
  Sparkles,
  LayoutTemplate,
} from "lucide-react";
import {
  FULL_NAME,
  JOB_TITLE,
  EMAIL_ADDRESS,
  getExperience,
  getEducation,
  SKILL_CATEGORIES,
  getProjects,
  CAREER_START_DATE,
} from "@/config";
import { GITHUB_URL, LINKED_IN_URL } from "@/config/url";
import { translate, useLocaleRefresh } from "@/i18n";
import type { Color } from "@/stores";
import type { ResumeColorConfig } from "@/screens/resume/resume";
import AvatarProfile from "@/assets/avatar-profile.jpg";
import moment from "moment";

const LiveWallpaper = dynamic(
  () => import("./live-wallpaper").then((m) => ({ default: m.LiveWallpaper })),
  { ssr: false },
);
const ResumeSimple = dynamic(
  () =>
    import("@/screens/resume/templates/simple-template").then((m) => ({
      default: m.SimpleTemplate,
    })),
  {
    ssr: false,
    loading: () => (
      <div style={{ width: 794, height: 600, background: "#f5f5f5" }} />
    ),
  },
);
const ResumeModern = dynamic(
  () =>
    import("@/screens/resume/templates/modern-template").then((m) => ({
      default: m.ModernTemplate,
    })),
  {
    ssr: false,
    loading: () => (
      <div style={{ width: 794, height: 600, background: "#1a1a1a" }} />
    ),
  },
);

// ── Palette — macOS dark mode + aurora accents ─────────────────────────────────

const A = {
  // Aurora accents
  teal: "#2DD4BF",
  violet: "#A78BFA",
  green: "#4ADE80",
  blue: "#60A5FA",
  // Text
  text: "#F0F2F5",
  textMid: "#9BA3AF",
  textMuted: "#4B5563",
  // Chrome — faithful macOS dark grays
  menuBar: "rgba(20,20,20,0.86)",
  menuBorder: "rgba(255,255,255,0.06)",
  window: "rgba(28,28,28,0.93)",
  windowBorder: "rgba(255,255,255,0.09)",
  titleBar: "rgba(44,44,44,0.72)",
  titleBorder: "rgba(255,255,255,0.07)",
  dock: "rgba(30,30,30,0.74)",
  dockBorder: "rgba(255,255,255,0.10)",
  sidebar: "rgba(255,255,255,0.018)",
  // Glass / cards
  glass: "rgba(255,255,255,0.048)",
  glassBorder: "rgba(255,255,255,0.08)",
  card: "rgba(255,255,255,0.032)",
  cardBorder: "rgba(255,255,255,0.07)",
  inputBg: "rgba(255,255,255,0.06)",
  termBg: "#0A0A0A",
};

// ── Resume color config (mirrors src/screens/resume/resume.tsx) ───────────────

const RESUME_COLORS: Record<Color, ResumeColorConfig> = {
  emerald: {
    primary: "#22C55E",
    light: "#DCFCE7",
    dark: "#15803D",
    text: "#FFFFFF",
  },
  azure: {
    primary: "#3B82F6",
    light: "#DBEAFE",
    dark: "#1D4ED8",
    text: "#FFFFFF",
  },
  golden: {
    primary: "#CA8A04",
    light: "#FEF9C3",
    dark: "#A16207",
    text: "#FFFFFF",
  },
  sunset: {
    primary: "#EA580C",
    light: "#FFEDD5",
    dark: "#C2410C",
    text: "#FFFFFF",
  },
  lavender: {
    primary: "#7C3AED",
    light: "#EDE9FE",
    dark: "#5B21B6",
    text: "#FFFFFF",
  },
  scarlet: {
    primary: "#E11D48",
    light: "#FFE4E6",
    dark: "#BE123C",
    text: "#FFFFFF",
  },
  silver: {
    primary: "#52525B",
    light: "#F4F4F5",
    dark: "#27272A",
    text: "#FFFFFF",
  },
};

const RESUME_SWATCHES: { value: Color; hex: string; label: string }[] = [
  { value: "emerald", hex: "#22C55E", label: "Emerald" },
  { value: "azure", hex: "#3B82F6", label: "Azure" },
  { value: "golden", hex: "#CA8A04", label: "Golden" },
  { value: "sunset", hex: "#EA580C", label: "Sunset" },
  { value: "lavender", hex: "#7C3AED", label: "Lavender" },
  { value: "scarlet", hex: "#E11D48", label: "Scarlet" },
  { value: "silver", hex: "#52525B", label: "Silver" },
];

// ── Utilities ──────────────────────────────────────────────────────────────────

const MAC_FONT =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', 'Segoe UI', system-ui, sans-serif";

function useTime() {
  const [t, setT] = useState("");
  useEffect(() => {
    const upd = () =>
      setT(
        new Date().toLocaleTimeString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      );
    upd();
    const id = setInterval(upd, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const chk = () => setM(window.innerWidth < 1024);
    chk();
    window.addEventListener("resize", chk);
    return () => window.removeEventListener("resize", chk);
  }, []);
  return m;
}

function useMobileTime() {
  const [t, setT] = useState("");
  useEffect(() => {
    const upd = () =>
      setT(
        new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      );
    upd();
    const id = setInterval(upd, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

function hexRgb(hex: string) {
  return `${parseInt(hex.slice(1, 3), 16)},${parseInt(hex.slice(3, 5), 16)},${parseInt(hex.slice(5, 7), 16)}`;
}

function formatDate(m: import("moment").Moment | "present") {
  return m === "present" ? "Present" : m.format("MMM YYYY");
}

// ── Window definitions ─────────────────────────────────────────────────────────

type WinId =
  | "about"
  | "projects"
  | "terminal"
  | "skills"
  | "contact"
  | "resume";

interface WinDef {
  id: WinId;
  title: string;
  color: string;
  icon: React.ReactNode;
  defaultPos: { x: number; y: number };
  defaultSize: { w: number; h: number };
}

const WIN_DEFS: WinDef[] = [
  {
    id: "about",
    title: "About Me",
    color: A.teal,
    icon: <User size={14} />,
    defaultPos: { x: 80, y: 50 },
    defaultSize: { w: 720, h: 580 },
  },
  {
    id: "projects",
    title: "Projects",
    color: A.blue,
    icon: <FolderOpen size={14} />,
    defaultPos: { x: 110, y: 70 },
    defaultSize: { w: 760, h: 500 },
  },
  {
    id: "terminal",
    title: "Terminal",
    color: A.green,
    icon: <TerminalSquare size={14} />,
    defaultPos: { x: 140, y: 90 },
    defaultSize: { w: 660, h: 400 },
  },
  {
    id: "skills",
    title: "Skills & Stack",
    color: A.violet,
    icon: <Settings2 size={14} />,
    defaultPos: { x: 100, y: 60 },
    defaultSize: { w: 700, h: 460 },
  },
  {
    id: "contact",
    title: "Contact",
    color: "#FB7185",
    icon: <Mail size={14} />,
    defaultPos: { x: 160, y: 80 },
    defaultSize: { w: 480, h: 480 },
  },
  {
    id: "resume",
    title: "Resume Builder",
    color: "#F59E0B",
    icon: <FileText size={14} />,
    defaultPos: { x: 180, y: 85 },
    defaultSize: { w: 1060, h: 760 },
  },
];

interface WinState {
  open: boolean;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
}

// ── Menu bar ───────────────────────────────────────────────────────────────────

function MenuBar({ onCmdK }: { onCmdK: () => void }) {
  const time = useTime();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9000,
        height: 28,
        background: A.menuBar,
        borderBottom: `1px solid ${A.menuBorder}`,
        backdropFilter: "blur(24px) saturate(1.4)",
        WebkitBackdropFilter: "blur(24px) saturate(1.4)",
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        userSelect: "none",
        fontFamily: MAC_FONT,
      }}
    >
      {/* Left — logo + app name + menu items */}
      <div style={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
        <div
          style={{
            padding: "0 8px",
            height: 28,
            display: "flex",
            alignItems: "center",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 69 69" fill="none">
            <path
              d="M30.0798 25.1276V18C13.3577 18.89 10.27 45.55 31.11 47.33C43.33 47.33 48.51 34.72 44.27 26.09H31.18V33.49H38.85C38.99 37.33 35.15 41.37 29.6 40.34C20.28 38.08 21.79 26.02 30.08 25.13Z"
              fill={A.teal}
            />
            <path
              d="M31.11 18V24.78H45.02C48.86 30.68 49.15 47.44 31.11 48.43V55.83C46.94 55.83 62.29 36.78 48.86 18H31.11Z"
              fill={A.teal}
            />
          </svg>
        </div>
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: A.text,
            padding: "0 8px",
          }}
        >
          Gene Paul
        </span>
        {["File", "View", "Go", "Window"].map((item) => (
          <button
            key={item}
            onMouseEnter={() => setActiveMenu(item)}
            onMouseLeave={() => setActiveMenu(null)}
            style={{
              height: 28,
              padding: "0 9px",
              background:
                activeMenu === item ? "rgba(255,255,255,0.10)" : "transparent",
              borderRadius: 4,
              border: "none",
              color: activeMenu === item ? A.text : A.textMid,
              fontSize: 13,
              cursor: "default",
              fontFamily: MAC_FONT,
            }}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Right — spotlight + clock */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <button
          onClick={onCmdK}
          style={{
            height: 20,
            padding: "0 7px",
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: A.glass,
            border: `1px solid ${A.glassBorder}`,
            borderRadius: 5,
            color: A.textMid,
            fontSize: 11,
            cursor: "pointer",
            fontFamily: MAC_FONT,
          }}
          title="Command Palette (⌘K)"
          aria-label="Open command palette"
        >
          <Search size={10} />
          <Command size={9} />
          <span style={{ fontSize: 10 }}>K</span>
        </button>
        <span style={{ fontSize: 12, color: A.text, fontWeight: 400 }}>
          {time}
        </span>
      </div>
    </div>
  );
}

// ── Traffic lights ─────────────────────────────────────────────────────────────

function TrafficLights({
  onClose,
  onMinimize,
  onMaximize,
}: {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      style={{ display: "flex", gap: 8, alignItems: "center" }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {[
        {
          bg: "#FF5F57",
          label: "Close",
          onClick: onClose,
          icon: <X size={7} color="rgba(0,0,0,0.55)" strokeWidth={2.5} />,
        },
        {
          bg: "#FFBD2E",
          label: "Minimize",
          onClick: onMinimize,
          icon: <Minus size={7} color="rgba(0,0,0,0.55)" strokeWidth={2.5} />,
        },
        {
          bg: "#28C840",
          label: "Maximize",
          onClick: onMaximize,
          icon: (
            <Maximize2 size={7} color="rgba(0,0,0,0.55)" strokeWidth={2.5} />
          ),
        },
      ].map((btn) => (
        <button
          key={btn.label}
          onClick={btn.onClick}
          aria-label={btn.label}
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: btn.bg,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {hov && btn.icon}
        </button>
      ))}
    </div>
  );
}

// ── Window content: About ──────────────────────────────────────────────────────

function AboutContent() {
  const [tab, setTab] = useState<"overview" | "experience" | "education">(
    "overview",
  );
  const exps = getExperience().filter((e) => e.isWork);
  const edus = getEducation();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        fontFamily: MAC_FONT,
      }}
    >
      {/* Safari-style address bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 12px",
          borderBottom: `1px solid ${A.glassBorder}`,
          background: A.titleBar,
          flexShrink: 0,
        }}
      >
        <ChevronLeft size={13} color={A.textMuted} />
        <ChevronRight size={13} color={A.textMuted} />
        <RefreshCw size={12} color={A.textMuted} />
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 5,
            background: A.inputBg,
            borderRadius: 7,
            padding: "3px 10px",
            border: `1px solid ${A.glassBorder}`,
            fontSize: 12,
            color: A.textMid,
          }}
        >
          <Lock size={10} color={A.teal} /> genepaulmarjavier.dev/2026/about
        </div>
      </div>
      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 2,
          padding: "6px 14px 0",
          borderBottom: `1px solid ${A.glassBorder}`,
          flexShrink: 0,
        }}
      >
        {(["overview", "experience", "education"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "4px 12px",
              borderRadius: "7px 7px 0 0",
              border: "none",
              background: tab === t ? A.window : "transparent",
              color: tab === t ? A.text : A.textMid,
              fontSize: 12,
              fontWeight: tab === t ? 600 : 400,
              cursor: "pointer",
              borderBottom:
                tab === t ? `2px solid ${A.teal}` : "2px solid transparent",
              fontFamily: MAC_FONT,
            }}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px 28px",
          scrollbarWidth: "none",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
          >
            {tab === "overview" && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 22 }}
              >
                <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <div
                      style={{
                        width: 88,
                        height: 88,
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: `2px solid ${A.teal}`,
                        boxShadow: `0 0 22px rgba(${hexRgb(A.teal)},0.28)`,
                      }}
                    >
                      <Image
                        src={AvatarProfile}
                        alt={FULL_NAME}
                        width={88}
                        height={88}
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        bottom: 2,
                        right: 2,
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        background: A.green,
                        border: "2px solid #1C1C1C",
                      }}
                    />
                  </div>
                  <div>
                    <h1
                      style={{
                        margin: 0,
                        fontSize: 24,
                        fontWeight: 700,
                        color: A.text,
                      }}
                    >
                      {FULL_NAME}
                    </h1>
                    <p
                      style={{
                        margin: "3px 0 8px",
                        fontSize: 14,
                        color: A.teal,
                        fontWeight: 500,
                      }}
                    >
                      {JOB_TITLE}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        fontSize: 12,
                        color: A.textMid,
                      }}
                    >
                      <MapPin size={12} color={A.textMuted} /> Cebu, Philippines
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    background: A.card,
                    border: `1px solid ${A.cardBorder}`,
                    borderRadius: 10,
                    padding: "14px 18px",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13.5,
                      lineHeight: 1.8,
                      color: A.textMid,
                    }}
                  >
                    Full-stack software engineer crafting production-ready
                    applications with{" "}
                    <span style={{ color: A.teal }}>React & Next.js</span> on
                    the frontend and{" "}
                    <span style={{ color: A.violet }}>Spring Boot & Java</span>{" "}
                    on the backend. Passionate about clean architecture,
                    developer experience, and shipping things that matter.
                  </p>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 10,
                  }}
                >
                  {[
                    {
                      v: `${moment().diff(moment(CAREER_START_DATE), "years")}+`,
                      l: "Years",
                      c: A.teal,
                    },
                    { v: "10+", l: "Projects", c: A.violet },
                    { v: "20+", l: "Technologies", c: A.green },
                    { v: "Active", l: "Status", c: "#FBBF24" },
                  ].map((s) => (
                    <div
                      key={s.l}
                      style={{
                        background: A.card,
                        border: `1px solid ${A.cardBorder}`,
                        borderRadius: 9,
                        padding: "12px",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{ fontSize: 20, fontWeight: 700, color: s.c }}
                      >
                        {s.v}
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: A.textMuted,
                          marginTop: 1,
                        }}
                      >
                        {s.l}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[
                    {
                      href: GITHUB_URL,
                      icon: <Github size={13} />,
                      label: "GitHub",
                      c: A.text,
                    },
                    {
                      href: LINKED_IN_URL,
                      icon: <Linkedin size={13} />,
                      label: "LinkedIn",
                      c: "#60A5FA",
                    },
                    {
                      href: `mailto:${EMAIL_ADDRESS}`,
                      icon: <Mail size={13} />,
                      label: EMAIL_ADDRESS,
                      c: A.teal,
                    },
                  ].map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        background: A.glass,
                        border: `1px solid ${A.glassBorder}`,
                        borderRadius: 7,
                        padding: "6px 12px",
                        fontSize: 12,
                        color: l.c,
                        textDecoration: "none",
                      }}
                    >
                      {l.icon} {l.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
            {tab === "experience" && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                <h2
                  style={{
                    margin: "0 0 4px",
                    fontSize: 16,
                    fontWeight: 700,
                    color: A.text,
                  }}
                >
                  Work Experience
                </h2>
                {exps.map((exp, i) => (
                  <div key={i} style={{ display: "flex", gap: 14 }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: 18,
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          width: 9,
                          height: 9,
                          borderRadius: "50%",
                          background: A.teal,
                          boxShadow: `0 0 7px ${A.teal}`,
                          marginTop: 6,
                          flexShrink: 0,
                        }}
                      />
                      {i < exps.length - 1 && (
                        <div
                          style={{
                            flex: 1,
                            width: 1,
                            background: `linear-gradient(to bottom, rgba(${hexRgb(A.teal)},0.35), transparent)`,
                            marginTop: 5,
                          }}
                        />
                      )}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        background: A.card,
                        border: `1px solid ${A.cardBorder}`,
                        borderRadius: 9,
                        padding: "12px 14px",
                        marginBottom: 6,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 8,
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13.5,
                            fontWeight: 600,
                            color: A.text,
                          }}
                        >
                          {exp.title}
                        </span>
                        <span style={{ fontSize: 11, color: A.textMuted }}>
                          {formatDate(exp.startYear)} —{" "}
                          {formatDate(exp.endYear)}
                        </span>
                      </div>
                      {exp.subtitle && (
                        <div
                          style={{ fontSize: 12, color: A.teal, marginTop: 2 }}
                        >
                          {exp.subtitle}
                          {exp.employmentType && (
                            <span
                              style={{
                                marginLeft: 6,
                                fontSize: 11,
                                color: A.violet,
                                background: `rgba(${hexRgb(A.violet)},0.12)`,
                                borderRadius: 4,
                                padding: "1px 5px",
                              }}
                            >
                              {exp.employmentType}
                            </span>
                          )}
                        </div>
                      )}
                      <p
                        style={{
                          margin: "7px 0 0",
                          fontSize: 12,
                          lineHeight: 1.65,
                          color: A.textMid,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {exp.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {tab === "education" && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                <h2
                  style={{
                    margin: "0 0 4px",
                    fontSize: 16,
                    fontWeight: 700,
                    color: A.text,
                  }}
                >
                  Education
                </h2>
                {edus.map((edu, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 12,
                      background: A.card,
                      border: `1px solid ${A.cardBorder}`,
                      borderRadius: 9,
                      padding: "12px 14px",
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 8,
                        background: `rgba(${hexRgb(A.violet)},0.12)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <GraduationCap size={16} color={A.violet} />
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 13.5,
                          fontWeight: 600,
                          color: A.text,
                        }}
                      >
                        {edu.title}
                      </div>
                      {edu.subtitle && (
                        <div
                          style={{
                            fontSize: 12,
                            color: A.violet,
                            marginTop: 1,
                          }}
                        >
                          {edu.subtitle}
                        </div>
                      )}
                      <div
                        style={{
                          fontSize: 11,
                          color: A.textMuted,
                          marginTop: 3,
                        }}
                      >
                        {formatDate(edu.startYear)} — {formatDate(edu.endYear)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Window content: Projects ───────────────────────────────────────────────────

type ProjFilter = "all" | "web" | "open" | "confidential";

function ProjectsContent() {
  const [filter, setFilter] = useState<ProjFilter>("all");
  const all = getProjects()
    .filter((p) => !p.hidden)
    .slice(0, 15);
  const filtered =
    filter === "all"
      ? all
      : filter === "open"
        ? all.filter((p) => p.codeUrl)
        : filter === "confidential"
          ? all.filter((p) => p.type === "confidential")
          : all.filter((p) => p.type !== "confidential");

  const sidebar: { id: ProjFilter; label: string }[] = [
    { id: "all", label: "All Projects" },
    { id: "web", label: "Web Apps" },
    { id: "open", label: "Open Source" },
    { id: "confidential", label: "Confidential" },
  ];

  return (
    <div style={{ display: "flex", height: "100%", fontFamily: MAC_FONT }}>
      <div
        style={{
          width: 155,
          flexShrink: 0,
          background: A.sidebar,
          borderRight: `1px solid ${A.glassBorder}`,
          padding: "12px 6px",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: A.textMuted,
            padding: "0 8px 6px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Locations
        </div>
        {sidebar.map((s) => (
          <button
            key={s.id}
            onClick={() => setFilter(s.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              width: "100%",
              padding: "6px 9px",
              borderRadius: 6,
              border: "none",
              background:
                filter === s.id
                  ? `rgba(${hexRgb(A.blue)},0.14)`
                  : "transparent",
              color: filter === s.id ? A.blue : A.textMid,
              fontSize: 12,
              cursor: "pointer",
              textAlign: "left",
              fontFamily: MAC_FONT,
            }}
          >
            <FolderOpen size={12} style={{ flexShrink: 0 }} /> {s.label}
          </button>
        ))}
        <div
          style={{
            marginTop: 12,
            fontSize: 10,
            fontWeight: 600,
            color: A.textMuted,
            padding: "0 8px 6px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Tags
        </div>
        {["React", "Spring Boot", "TypeScript"].map((t) => (
          <div
            key={t}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "4px 9px",
              fontSize: 11,
              color: A.textMuted,
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: A.teal,
                flexShrink: 0,
              }}
            />{" "}
            {t}
          </div>
        ))}
      </div>
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "14px 16px",
          scrollbarWidth: "none",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 10,
          }}
        >
          {filtered.map((p) => (
            <div
              key={p.projectId}
              style={{
                background: A.card,
                border: `1px solid ${A.cardBorder}`,
                borderRadius: 9,
                padding: "11px 13px",
                cursor: "default",
                transition: "border-color 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = `rgba(${hexRgb(A.blue)},0.30)`)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = A.cardBorder)
              }
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 7,
                  marginBottom: 7,
                  background:
                    p.type === "confidential"
                      ? "rgba(251,191,36,0.12)"
                      : `rgba(${hexRgb(A.blue)},0.10)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {p.type === "confidential" ? (
                  <FileCode size={15} color="#FBBF24" />
                ) : (
                  <FolderGit2 size={15} color={A.blue} />
                )}
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: A.text,
                  lineHeight: 1.3,
                  marginBottom: 3,
                }}
              >
                {p.title}
              </div>
              {p.company && (
                <div
                  style={{ fontSize: 10, color: A.textMuted, marginBottom: 4 }}
                >
                  {p.company}
                </div>
              )}
              <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                {p.category.slice(0, 2).map((c) => (
                  <span
                    key={c}
                    style={{
                      fontSize: 9,
                      background: A.glass,
                      border: `1px solid ${A.glassBorder}`,
                      borderRadius: 4,
                      padding: "1px 4px",
                      color: A.textMid,
                    }}
                  >
                    {c}
                  </span>
                ))}
              </div>
              {(p.previewUrl || p.codeUrl) && (
                <a
                  href={p.previewUrl || p.codeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 3,
                    marginTop: 6,
                    fontSize: 10,
                    color: A.teal,
                    textDecoration: "none",
                  }}
                >
                  <ExternalLink size={9} /> View
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Window content: Terminal ───────────────────────────────────────────────────

interface TermEntry {
  input?: string;
  output: string[];
}

const CMDS: Record<string, () => string[]> = {
  help: () => [
    "Available commands:",
    "  whoami           — personal info",
    "  ls               — list projects",
    "  cat skills.json  — print tech stack",
    "  open <app>       — open About/Projects/Skills/Resume",
    "  clear            — clear terminal",
    "",
  ],
  whoami: () => [
    `Name     : ${FULL_NAME}`,
    `Role     : ${JOB_TITLE}`,
    "Location : Cebu, Philippines",
    `Email    : ${EMAIL_ADDRESS}`,
    "GitHub   : github.com/javiergenepaul",
    "Status   : Open to opportunities",
    "",
  ],
  ls: () => {
    const p = getProjects()
      .filter((x) => !x.hidden)
      .slice(0, 8);
    return [
      "total " + p.length,
      ...p.map((x) => `drwxr-xr-x  ${x.projectId}/`),
      "",
    ];
  },
  "ls -la": () => CMDS.ls(),
  "cat skills.json": () => {
    const lines = ["{"];
    SKILL_CATEGORIES.forEach((c, i) => {
      const n = c.stacks
        .slice(0, 5)
        .map(
          (s) => `"${translate(`services.stack.${s.name}` as any) || s.name}"`,
        )
        .join(", ");
      lines.push(
        `  "${c.label}": [${n}${c.stacks.length > 5 ? ", ..." : ""}]${i < SKILL_CATEGORIES.length - 1 ? "," : ""}`,
      );
    });
    return [...lines, "}", ""];
  },
};

function TerminalContent({ onOpen }: { onOpen: (id: WinId) => void }) {
  const [history, setHistory] = useState<TermEntry[]>([
    {
      output: [
        `Portfolio Terminal  ─  v2026.0.0`,
        `Connected as visitor. Hello! I'm ${FULL_NAME}.`,
        "Type 'help' for available commands.",
        "",
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [cmdHist, setCmdHist] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const run = useCallback(
    (cmd: string) => {
      const t = cmd.trim().toLowerCase();
      if (t === "clear") {
        setHistory([]);
        return;
      }
      const appMap: Record<string, WinId> = {
        "open about": "about",
        "open projects": "projects",
        "open skills": "skills",
        "open contact": "contact",
        "open resume": "resume",
      };
      if (appMap[t]) {
        onOpen(appMap[t]);
        setHistory((h) => [
          ...h,
          { input: cmd, output: [`Opening ${appMap[t]}...`, ""] },
        ]);
        setCmdHist((h) => [cmd, ...h]);
        setHistIdx(-1);
        return;
      }
      const out = CMDS[t]
        ? CMDS[t]()
        : [
            `bash: ${t}: command not found`,
            "Type 'help' for available commands.",
            "",
          ];
      setHistory((h) => [...h, { input: cmd, output: out }]);
      setCmdHist((h) => [cmd, ...h]);
      setHistIdx(-1);
    },
    [onOpen],
  );

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: A.termBg,
        fontFamily: "'JetBrains Mono','Fira Code','Cascadia Code',monospace",
        fontSize: 13,
        cursor: "text",
      }}
    >
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "14px 18px 8px",
          scrollbarWidth: "none",
        }}
      >
        {history.map((e, i) => (
          <div key={i}>
            {e.input !== undefined && (
              <div style={{ display: "flex", gap: 8, marginBottom: 3 }}>
                <span style={{ color: A.green }}>➜</span>
                <span style={{ color: A.teal }}>~/portfolio</span>
                <span style={{ color: A.text }}>{e.input}</span>
              </div>
            )}
            {e.output.map((l, j) => (
              <div
                key={j}
                style={{
                  color: l.startsWith("bash:") ? "#F87171" : A.textMid,
                  lineHeight: 1.65,
                  whiteSpace: "pre",
                }}
              >
                {l || "\u00A0"}
              </div>
            ))}
          </div>
        ))}
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            marginTop: 3,
          }}
        >
          <span style={{ color: A.green }}>➜</span>
          <span style={{ color: A.teal }}>~/portfolio</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                run(input);
                setInput("");
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                const n = Math.min(histIdx + 1, cmdHist.length - 1);
                setHistIdx(n);
                setInput(cmdHist[n] ?? "");
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                const n = Math.max(histIdx - 1, -1);
                setHistIdx(n);
                setInput(n === -1 ? "" : (cmdHist[n] ?? ""));
              }
            }}
            autoFocus
            spellCheck={false}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              color: A.text,
              fontFamily: "inherit",
              fontSize: "inherit",
              caretColor: A.teal,
            }}
            aria-label="Terminal input"
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

// ── Window content: Skills ─────────────────────────────────────────────────────

function SkillsContent() {
  const [active, setActive] = useState(SKILL_CATEGORIES[0]?.key ?? "");
  const cat = SKILL_CATEGORIES.find((c) => c.key === active);
  const ACCENT = [A.teal, A.violet, A.green, A.blue, "#FBBF24", "#FB7185"];

  return (
    <div style={{ display: "flex", height: "100%", fontFamily: MAC_FONT }}>
      <div
        style={{
          width: 170,
          flexShrink: 0,
          background: A.sidebar,
          borderRight: `1px solid ${A.glassBorder}`,
          padding: "12px 6px",
          overflowY: "auto",
          scrollbarWidth: "none",
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: A.textMuted,
            padding: "0 8px 8px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Categories
        </div>
        {SKILL_CATEGORIES.map((c, i) => {
          const col = ACCENT[i % ACCENT.length];
          return (
            <button
              key={c.key}
              onClick={() => setActive(c.key)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                padding: "7px 9px",
                borderRadius: 6,
                border: "none",
                background:
                  active === c.key
                    ? `rgba(${hexRgb(col)},0.12)`
                    : "transparent",
                color: active === c.key ? col : A.textMid,
                fontSize: 12,
                cursor: "pointer",
                fontFamily: MAC_FONT,
              }}
            >
              <span>{c.label}</span>
              <span style={{ fontSize: 10, opacity: 0.55 }}>
                {c.stacks.length}
              </span>
            </button>
          );
        })}
      </div>
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "18px 22px",
          scrollbarWidth: "none",
        }}
      >
        {cat && (
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <h2
                style={{
                  margin: "0 0 14px",
                  fontSize: 15,
                  fontWeight: 700,
                  color: A.text,
                }}
              >
                {cat.label}{" "}
                <span
                  style={{ fontSize: 12, color: A.textMuted, fontWeight: 400 }}
                >
                  ({cat.stacks.length} technologies)
                </span>
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {cat.stacks.map((s) => {
                  const col =
                    ACCENT[
                      SKILL_CATEGORIES.findIndex((c) => c.key === active) %
                        ACCENT.length
                    ];
                  return (
                    <div
                      key={s.name}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        background: A.card,
                        border: `1px solid ${A.cardBorder}`,
                        borderRadius: 7,
                        padding: "5px 11px",
                        fontSize: 12,
                        color: A.text,
                        transition: "border-color 0.14s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.borderColor = `rgba(${hexRgb(col)},0.35)`)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.borderColor = A.cardBorder)
                      }
                    >
                      {s.isFavorite && (
                        <div
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background: col,
                            boxShadow: `0 0 5px ${col}`,
                            flexShrink: 0,
                          }}
                        />
                      )}
                      {translate(`services.stack.${s.name}` as any) || s.name}
                      {s.isStudying && (
                        <span
                          style={{
                            fontSize: 9,
                            color: A.textMuted,
                            background: A.glass,
                            borderRadius: 3,
                            padding: "0 3px",
                          }}
                        >
                          learning
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

// ── Window content: Contact ────────────────────────────────────────────────────

function ContactContent() {
  const links = [
    {
      label: "Email",
      value: EMAIL_ADDRESS,
      href: `mailto:${EMAIL_ADDRESS}`,
      icon: <Mail size={18} />,
      color: A.teal,
      desc: "Drop a message any time",
    },
    {
      label: "GitHub",
      value: "javiergenepaul",
      href: GITHUB_URL,
      icon: <Github size={18} />,
      color: A.text,
      desc: "View open-source work",
    },
    {
      label: "LinkedIn",
      value: "gene-paul-mar-javier",
      href: LINKED_IN_URL,
      icon: <Linkedin size={18} />,
      color: "#60A5FA",
      desc: "Connect professionally",
    },
  ];
  return (
    <div
      style={{
        padding: "28px 32px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        fontFamily: MAC_FONT,
      }}
    >
      <div style={{ marginBottom: 4 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: A.text }}>
          Get in Touch
        </h2>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: A.textMid }}>
          Open to new opportunities, collaborations, and interesting
          conversations.
        </p>
      </div>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            background: A.card,
            border: `1px solid ${A.cardBorder}`,
            borderRadius: 10,
            padding: "14px 18px",
            textDecoration: "none",
            transition: "border-color 0.15s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.borderColor = `rgba(${hexRgb(l.color)},0.35)`)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.borderColor = A.cardBorder)
          }
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              background: `rgba(${hexRgb(l.color)},0.10)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: l.color,
              flexShrink: 0,
            }}
          >
            {l.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: A.text }}>
              {l.label}
            </div>
            <div style={{ fontSize: 12, color: l.color, marginTop: 1 }}>
              {l.value}
            </div>
            <div style={{ fontSize: 11, color: A.textMuted, marginTop: 1 }}>
              {l.desc}
            </div>
          </div>
          <ExternalLink size={14} color={A.textMuted} />
        </a>
      ))}
    </div>
  );
}

// ── Window content: Resume Builder ────────────────────────────────────────────

function ResumeContent() {
  type ResumeMode = "simple" | "modern";
  const [mode, setMode] = useState<ResumeMode>("modern");
  const [isDark, setIsDark] = useState(true);
  const [color, setColor] = useState<Color>("azure");
  const [zoom, setZoom] = useState(0.55);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-fit zoom to available preview width on mount
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const w = containerRef.current.clientWidth - 48;
    if (w > 0)
      setZoom(Math.min(0.85, Math.max(0.3, Math.floor((w / 794) * 100) / 100)));
  }, []);

  const colors = RESUME_COLORS[color];
  const stepZoom = (d: number) =>
    setZoom((z) => Math.min(1.2, Math.max(0.3, Math.round((z + d) * 10) / 10)));
  const resetZoom = () => {
    if (!containerRef.current) return;
    const w = containerRef.current.clientWidth - 48;
    setZoom(Math.min(0.85, Math.max(0.3, Math.floor((w / 794) * 100) / 100)));
  };

  const handleExport = useCallback(() => {
    const el = document.getElementById("resume-preview-2026");
    if (!el) return;

    // Clone and strip the zoom transform — printing the scaled-down preview
    // would add white margins; we want the natural 794px-wide 1:1 render.
    const clone = el.cloneNode(true) as HTMLElement;
    clone.style.transform = "none";
    clone.style.marginBottom = "0";
    clone.style.boxShadow = "none";
    clone.style.width = "794px";

    const styles = [
      ...Array.from(document.querySelectorAll("style")).map((s) => s.outerHTML),
      ...Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(
        (l) => l.outerHTML,
      ),
    ].join("\n");
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><base href="${window.location.origin}/">${styles}<style>*,*::before,*::after{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}@page{size:A4 portrait;margin:0}html,body{margin:0;padding:0}</style></head><body>${clone.outerHTML}</body><script>window.onload=function(){setTimeout(function(){window.print();window.close()},300)}<\/script></html>`;
    const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }, []);

  const sectionLabel: React.CSSProperties = {
    fontSize: 9,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.10em",
    color: A.textMuted,
    marginBottom: 8,
    display: "block",
  };

  return (
    <div style={{ display: "flex", height: "100%", fontFamily: MAC_FONT }}>
      {/* ── Controls sidebar ── */}
      <div
        style={{
          width: 218,
          flexShrink: 0,
          background: A.sidebar,
          borderRight: `1px solid ${A.glassBorder}`,
          padding: "16px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
          overflowY: "auto",
          scrollbarWidth: "none",
        }}
      >
        {/* Template */}
        <div>
          <span style={sectionLabel}>Template</span>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {[
              {
                v: "modern" as ResumeMode,
                icon: <Sparkles size={12} />,
                label: "Modern",
                desc: "Styled sidebar",
              },
              {
                v: "simple" as ResumeMode,
                icon: <LayoutTemplate size={12} />,
                label: "Simple",
                desc: "Classic & clean",
              },
            ].map((opt) => (
              <button
                key={opt.v}
                onClick={() => setMode(opt.v)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  padding: "8px 10px",
                  borderRadius: 8,
                  cursor: "pointer",
                  border: `1px solid ${mode === opt.v ? `rgba(${hexRgb(A.teal)},0.40)` : A.glassBorder}`,
                  background:
                    mode === opt.v ? `rgba(${hexRgb(A.teal)},0.08)` : A.glass,
                  transition: "all 0.14s",
                  fontFamily: MAC_FONT,
                  textAlign: "left",
                }}
              >
                <span style={{ color: mode === opt.v ? A.teal : A.textMuted }}>
                  {opt.icon}
                </span>
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: mode === opt.v ? A.text : A.textMid,
                    }}
                  >
                    {opt.label}
                  </div>
                  <div style={{ fontSize: 10, color: A.textMuted }}>
                    {opt.desc}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Appearance */}
        <div>
          <span style={sectionLabel}>Appearance</span>
          <div style={{ display: "flex", gap: 6 }}>
            {[
              { v: false, icon: <Sun size={13} />, label: "Light" },
              { v: true, icon: <Moon size={13} />, label: "Dark" },
            ].map((opt) => (
              <button
                key={String(opt.v)}
                onClick={() => setIsDark(opt.v)}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 5,
                  padding: "9px 6px",
                  borderRadius: 8,
                  cursor: "pointer",
                  border: `1px solid ${isDark === opt.v ? `rgba(${hexRgb(A.blue)},0.40)` : A.glassBorder}`,
                  background:
                    isDark === opt.v ? `rgba(${hexRgb(A.blue)},0.08)` : A.glass,
                  transition: "all 0.14s",
                  fontFamily: MAC_FONT,
                }}
              >
                <span
                  style={{ color: isDark === opt.v ? A.blue : A.textMuted }}
                >
                  {opt.icon}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: isDark === opt.v ? A.text : A.textMuted,
                  }}
                >
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div>
          <span style={sectionLabel}>Accent Color</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {RESUME_SWATCHES.map((s) => (
              <button
                key={s.value}
                onClick={() => setColor(s.value)}
                title={s.label}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  border: "none",
                  background: s.hex,
                  cursor: "pointer",
                  outline: "none",
                  boxShadow:
                    color === s.value
                      ? `0 0 0 2px #1C1C1C, 0 0 0 3.5px ${s.hex}`
                      : "none",
                  transform: color === s.value ? "scale(1.18)" : "scale(1)",
                  transition: "transform 0.13s, box-shadow 0.13s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {color === s.value && (
                  <Check size={11} color="#fff" strokeWidth={3} />
                )}
              </button>
            ))}
          </div>
          <div
            style={{
              fontSize: 11,
              color: A.textMuted,
              marginTop: 7,
              textTransform: "capitalize",
            }}
          >
            {color}
          </div>
        </div>

        {/* Export — pinned to bottom */}
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <button
            onClick={handleExport}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              padding: "9px 0",
              borderRadius: 9,
              border: "none",
              background: colors.primary,
              color: colors.text,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: MAC_FONT,
            }}
          >
            <Download size={14} /> Export PDF
          </button>
          <div
            style={{
              fontSize: 10,
              color: A.textMuted,
              lineHeight: 1.65,
              padding: "8px 10px",
              background: A.glass,
              borderRadius: 7,
              border: `1px solid ${A.glassBorder}`,
            }}
          >
            <div style={{ fontWeight: 600, color: A.textMid, marginBottom: 3 }}>
              Tips
            </div>
            Select <b style={{ color: A.text }}>Save as PDF</b>, margins →{" "}
            <b style={{ color: A.text }}>None</b>, enable{" "}
            <b style={{ color: A.text }}>Background graphics</b>.
          </div>
        </div>
      </div>

      {/* ── Preview panel ── */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          background: "rgba(0,0,0,0.18)",
        }}
      >
        {/* Zoom toolbar */}
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: 2,
            padding: "6px 12px",
            borderBottom: `1px solid ${A.glassBorder}`,
            background: A.titleBar,
          }}
        >
          <button
            onClick={() => stepZoom(-0.1)}
            style={{
              width: 26,
              height: 22,
              borderRadius: 5,
              border: "none",
              background: "transparent",
              color: A.textMuted,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ZoomOut size={13} />
          </button>
          <button
            onClick={resetZoom}
            style={{
              padding: "0 6px",
              height: 22,
              borderRadius: 5,
              border: "none",
              background: "transparent",
              color: A.textMid,
              fontSize: 11,
              fontFamily: "monospace",
              cursor: "pointer",
            }}
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            onClick={() => stepZoom(0.1)}
            style={{
              width: 26,
              height: 22,
              borderRadius: 5,
              border: "none",
              background: "transparent",
              color: A.textMuted,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ZoomIn size={13} />
          </button>
        </div>

        {/* Scrollable resume */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "auto",
            padding: "20px",
            scrollbarWidth: "thin",
            scrollbarColor: `${A.glassBorder} transparent`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              id="resume-preview-2026"
              style={{
                width: 794,
                transformOrigin: "top center",
                transform: `scale(${zoom})`,
                marginBottom: `${-(794 * (1 - zoom))}px`,
                boxShadow: "0 16px 52px rgba(0,0,0,0.65)",
                overflow: "hidden",
              }}
            >
              {mode === "simple" ? (
                <ResumeSimple colors={colors} isDark={isDark} />
              ) : (
                <ResumeModern colors={colors} isDark={isDark} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Window frame ───────────────────────────────────────────────────────────────

// Resize handle edges: n/e/s/w edges + ne/se/sw/nw corners
const RESIZE_HANDLES = [
  {
    edge: "n",
    cursor: "n-resize",
    style: { top: 0, left: 6, right: 6, height: 5 },
  },
  {
    edge: "ne",
    cursor: "ne-resize",
    style: { top: 0, right: 0, width: 10, height: 10 },
  },
  {
    edge: "e",
    cursor: "e-resize",
    style: { top: 6, right: 0, width: 5, bottom: 6 },
  },
  {
    edge: "se",
    cursor: "se-resize",
    style: { bottom: 0, right: 0, width: 10, height: 10 },
  },
  {
    edge: "s",
    cursor: "s-resize",
    style: { bottom: 0, left: 6, right: 6, height: 5 },
  },
  {
    edge: "sw",
    cursor: "sw-resize",
    style: { bottom: 0, left: 0, width: 10, height: 10 },
  },
  {
    edge: "w",
    cursor: "w-resize",
    style: { top: 6, left: 0, width: 5, bottom: 6 },
  },
  {
    edge: "nw",
    cursor: "nw-resize",
    style: { top: 0, left: 0, width: 10, height: 10 },
  },
] as const;

function AppWindow({
  def,
  state,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onOpen,
}: {
  def: WinDef;
  state: WinState;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onOpen: (id: WinId) => void;
}) {
  const x = useMotionValue(def.defaultPos.x);
  const y = useMotionValue(def.defaultPos.y);
  const [size, setSize] = useState({
    w: def.defaultSize.w,
    h: def.defaultSize.h,
  });
  const resizing = useRef<{
    edge: string;
    startX: number;
    startY: number;
    startW: number;
    startH: number;
    startPX: number;
    startPY: number;
  } | null>(null);

  if (!state.open) return null;

  const handlePan = (_: unknown, info: PanInfo) => {
    if (!state.maximized) {
      x.set(Math.max(0, x.get() + info.delta.x));
      y.set(Math.max(28, y.get() + info.delta.y));
    }
  };

  const startResize = (e: React.MouseEvent, edge: string) => {
    if (state.maximized) return;
    e.preventDefault();
    e.stopPropagation();
    onFocus();
    resizing.current = {
      edge,
      startX: e.clientX,
      startY: e.clientY,
      startW: size.w,
      startH: size.h,
      startPX: x.get(),
      startPY: y.get(),
    };

    const MIN_W = 340,
      MIN_H = 220;

    const onMove = (ev: MouseEvent) => {
      const r = resizing.current;
      if (!r) return;
      const dx = ev.clientX - r.startX;
      const dy = ev.clientY - r.startY;
      let nw = r.startW,
        nh = r.startH,
        nx = r.startPX,
        ny = r.startPY;

      if (r.edge.includes("e")) nw = Math.max(MIN_W, r.startW + dx);
      if (r.edge.includes("s")) nh = Math.max(MIN_H, r.startH + dy);
      if (r.edge.includes("w")) {
        nw = Math.max(MIN_W, r.startW - dx);
        nx = r.startPX + (r.startW - nw);
      }
      if (r.edge.includes("n")) {
        nh = Math.max(MIN_H, r.startH - dy);
        ny = r.startPY + (r.startH - nh);
      }

      setSize({ w: nw, h: nh });
      if (r.edge.includes("w")) x.set(Math.max(0, nx));
      if (r.edge.includes("n")) y.set(Math.max(28, ny));
    };

    const onUp = () => {
      resizing.current = null;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  const winStyle: React.CSSProperties = state.maximized
    ? {
        position: "fixed",
        top: 28,
        left: 0,
        right: 0,
        bottom: 80,
        width: "auto",
        height: "auto",
        borderRadius: 0,
      }
    : {
        position: "fixed",
        top: 0,
        left: 0,
        width: size.w,
        height: size.h,
        borderRadius: 12,
      };

  return (
    <motion.div
      style={{
        ...winStyle,
        x: state.maximized ? 0 : x,
        y: state.maximized ? 0 : y,
        zIndex: state.zIndex,
        display: state.minimized ? "none" : "flex",
        flexDirection: "column",
        background: A.window,
        border: `1px solid ${A.windowBorder}`,
        backdropFilter: "blur(32px) saturate(1.3)",
        WebkitBackdropFilter: "blur(32px) saturate(1.3)",
        boxShadow:
          "0 32px 80px rgba(0,0,0,0.70), 0 0 0 0.5px rgba(255,255,255,0.04)",
        overflow: "hidden",
        fontFamily: MAC_FONT,
      }}
      initial={{ scale: 0.94, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        transition: { duration: 0.18, ease: [0.2, 0, 0, 1] },
      }}
      exit={{ scale: 0.9, opacity: 0, transition: { duration: 0.16 } }}
      onClick={onFocus}
    >
      {/* Resize handles — invisible hit areas on all 8 edges/corners */}
      {!state.maximized &&
        RESIZE_HANDLES.map(({ edge, cursor, style }) => (
          <div
            key={edge}
            onMouseDown={(e) => startResize(e, edge)}
            style={{
              position: "absolute",
              zIndex: 100,
              cursor,
              ...style,
            }}
          />
        ))}

      {/* Title bar */}
      <motion.div
        onPan={handlePan}
        onDoubleClick={onMaximize}
        style={{
          height: 40,
          flexShrink: 0,
          background: A.titleBar,
          borderBottom: `1px solid ${A.titleBorder}`,
          display: "flex",
          alignItems: "center",
          padding: "0 14px",
          gap: 10,
          cursor: state.maximized ? "default" : "move",
          userSelect: "none",
        }}
      >
        <TrafficLights
          onClose={onClose}
          onMinimize={onMinimize}
          onMaximize={onMaximize}
        />
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <span style={{ color: def.color, opacity: 0.85 }}>{def.icon}</span>
          <span
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: A.textMid,
              letterSpacing: "0.01em",
            }}
          >
            {def.title}
          </span>
        </div>
      </motion.div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        {def.id === "about" && <AboutContent />}
        {def.id === "projects" && <ProjectsContent />}
        {def.id === "terminal" && <TerminalContent onOpen={onOpen} />}
        {def.id === "skills" && <SkillsContent />}
        {def.id === "contact" && <ContactContent />}
        {def.id === "resume" && <ResumeContent />}
      </div>
    </motion.div>
  );
}

// ── Desktop icon ───────────────────────────────────────────────────────────────

function DesktopIcon({
  label,
  icon,
  color,
  isOpen,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  color: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 5,
        padding: "8px 10px",
        borderRadius: 8,
        border: "none",
        background: hov ? "rgba(255,255,255,0.07)" : "transparent",
        cursor: "pointer",
        width: 80,
        outline: isOpen ? `1px solid rgba(${hexRgb(color)},0.4)` : "none",
        transition: "background 0.12s",
        fontFamily: MAC_FONT,
      }}
      aria-label={`Open ${label}`}
    >
      <motion.div
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        style={{
          width: 56,
          height: 56,
          borderRadius: 13,
          background: `linear-gradient(145deg, rgba(${hexRgb(color)},0.22), rgba(${hexRgb(color)},0.08))`,
          border: `1px solid rgba(${hexRgb(color)},0.28)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: color,
          boxShadow: `0 6px 18px rgba(${hexRgb(color)},0.18), inset 0 1px 0 rgba(255,255,255,0.10)`,
        }}
      >
        {icon}
      </motion.div>
      <span
        style={{
          fontSize: 11,
          color: A.text,
          fontWeight: 500,
          textShadow: "0 1px 4px rgba(0,0,0,0.95)",
          background: "rgba(0,0,0,0.40)",
          borderRadius: 4,
          padding: "1px 5px",
        }}
      >
        {label}
      </span>
    </button>
  );
}

// ── Dock ───────────────────────────────────────────────────────────────────────

function Dock({
  windows,
  onOpen,
  onRestore,
}: {
  windows: Record<WinId, WinState>;
  onOpen: (id: WinId) => void;
  onRestore: (id: WinId) => void;
}) {
  const [hov, setHov] = useState<string | null>(null);

  const dockApps = WIN_DEFS.map((d) => ({
    ...d,
    isOpen: windows[d.id].open,
    isMinimized: windows[d.id].minimized,
  }));

  const getSize = (id: string) => {
    if (hov === id) return 62;
    if (hov) {
      const hi = dockApps.findIndex((a) => a.id === hov);
      const ci = dockApps.findIndex((a) => a.id === id);
      if (Math.abs(hi - ci) === 1) return 52;
    }
    return 44;
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 10,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 8000,
        background: A.dock,
        border: `1px solid ${A.dockBorder}`,
        borderRadius: 20,
        padding: "8px 12px",
        backdropFilter: "blur(32px) saturate(1.5)",
        WebkitBackdropFilter: "blur(32px) saturate(1.5)",
        display: "flex",
        gap: 6,
        alignItems: "flex-end",
        boxShadow:
          "0 10px 36px rgba(0,0,0,0.60), inset 0 1px 0 rgba(255,255,255,0.06)",
        fontFamily: MAC_FONT,
      }}
    >
      {dockApps.map((app) => {
        const size = getSize(app.id);
        const isHov = hov === app.id;
        return (
          <div
            key={app.id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              position: "relative",
            }}
          >
            {/* macOS hover label */}
            <AnimatePresence>
              {isHov && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.11 }}
                  style={{
                    position: "absolute",
                    bottom: "calc(100% + 10px)",
                    background: "rgba(28,28,28,0.94)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    borderRadius: 7,
                    padding: "4px 9px",
                    fontSize: 12,
                    color: A.text,
                    whiteSpace: "nowrap",
                    backdropFilter: "blur(12px)",
                    pointerEvents: "none",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.50)",
                  }}
                >
                  {app.title}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              animate={{ width: size, height: size }}
              transition={{ type: "spring", stiffness: 480, damping: 30 }}
              onClick={() =>
                app.isMinimized ? onRestore(app.id) : onOpen(app.id)
              }
              onMouseEnter={() => setHov(app.id)}
              onMouseLeave={() => setHov(null)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 12,
                background: app.isOpen
                  ? `linear-gradient(135deg, rgba(${hexRgb(app.color)},0.26), rgba(${hexRgb(app.color)},0.10))`
                  : A.glass,
                color: app.isOpen ? app.color : A.textMid,
                cursor: "pointer",
                boxShadow: app.isOpen
                  ? `0 0 18px rgba(${hexRgb(app.color)},0.22)`
                  : "none",
                border: `1px solid ${app.isOpen ? `rgba(${hexRgb(app.color)},0.32)` : A.glassBorder}`,
                flexShrink: 0,
                position: "relative",
              }}
              aria-label={`${app.title}${app.isMinimized ? " (minimized)" : ""}`}
            >
              {app.isMinimized && (
                <div
                  style={{
                    position: "absolute",
                    top: 3,
                    right: 3,
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "#FFBD2E",
                  }}
                />
              )}
              {app.icon}
            </motion.button>

            {/* Running dot */}
            <div
              style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background:
                  app.isOpen && !app.isMinimized ? app.color : "transparent",
                transition: "background 0.15s",
              }}
            />
          </div>
        );
      })}

      {/* Separator + GitHub */}
      <div
        style={{
          width: 1,
          height: 32,
          background: A.glassBorder,
          margin: "0 4px 8px",
          alignSelf: "center",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          position: "relative",
        }}
      >
        <AnimatePresence>
          {hov === "gh" && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.11 }}
              style={{
                position: "absolute",
                bottom: "calc(100% + 10px)",
                background: "rgba(28,28,28,0.94)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: 7,
                padding: "4px 9px",
                fontSize: 12,
                color: A.text,
                whiteSpace: "nowrap",
                backdropFilter: "blur(12px)",
                pointerEvents: "none",
                boxShadow: "0 4px 14px rgba(0,0,0,0.50)",
              }}
            >
              GitHub
            </motion.div>
          )}
        </AnimatePresence>
        <motion.a
          animate={{ width: 44, height: 44 }}
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHov("gh")}
          onMouseLeave={() => setHov(null)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 12,
            background: A.glass,
            border: `1px solid ${A.glassBorder}`,
            color: A.textMid,
            textDecoration: "none",
            flexShrink: 0,
          }}
          aria-label="GitHub"
        >
          <Github size={20} />
        </motion.a>
        <div
          style={{
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: "transparent",
          }}
        />
      </div>
    </div>
  );
}

// ── Command palette ────────────────────────────────────────────────────────────

function CommandPalette({
  open,
  onClose,
  onOpen,
}: {
  open: boolean;
  onClose: () => void;
  onOpen: (id: WinId) => void;
}) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (open) {
      setQ("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const items = [
    ...WIN_DEFS.map((d) => ({
      label: `Open ${d.title}`,
      icon: d.icon,
      color: d.color,
      action: () => onOpen(d.id),
    })),
    {
      label: "View GitHub",
      icon: <Github size={13} />,
      color: A.text,
      action: () => window.open(GITHUB_URL, "_blank"),
    },
    {
      label: "View LinkedIn",
      icon: <Linkedin size={13} />,
      color: "#60A5FA",
      action: () => window.open(LINKED_IN_URL, "_blank"),
    },
    {
      label: "Send Email",
      icon: <Mail size={13} />,
      color: A.teal,
      action: () => window.open(`mailto:${EMAIL_ADDRESS}`, "_blank"),
    },
  ];
  const filtered = q
    ? items.filter((i) => i.label.toLowerCase().includes(q.toLowerCase()))
    : items;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="ov"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9500,
              background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(4px)",
            }}
          />
          <motion.div
            key="pl"
            initial={{ opacity: 0, scale: 0.96, y: -14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.17 }}
            style={{
              position: "fixed",
              top: "18%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "min(540px,calc(100vw-32px))",
              background: "rgba(18,18,18,0.97)",
              border: `1px solid ${A.windowBorder}`,
              borderRadius: 13,
              overflow: "hidden",
              zIndex: 9501,
              boxShadow: "0 28px 64px rgba(0,0,0,0.78)",
              fontFamily: MAC_FONT,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "11px 14px",
                borderBottom: `1px solid ${A.glassBorder}`,
              }}
            >
              <Search size={14} color={A.textMuted} />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && onClose()}
                placeholder="Search commands..."
                style={{
                  flex: 1,
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: A.text,
                  fontSize: 14,
                  fontFamily: MAC_FONT,
                }}
                aria-label="Command search"
              />
              <kbd
                style={{
                  fontSize: 10,
                  color: A.textMuted,
                  background: A.glass,
                  border: `1px solid ${A.glassBorder}`,
                  borderRadius: 4,
                  padding: "1px 5px",
                }}
              >
                ESC
              </kbd>
            </div>
            <div
              style={{
                padding: "5px 6px 6px",
                maxHeight: 300,
                overflowY: "auto",
                scrollbarWidth: "none",
              }}
            >
              {filtered.map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    width: "100%",
                    padding: "8px 9px",
                    borderRadius: 7,
                    border: "none",
                    background: "transparent",
                    color: A.text,
                    fontSize: 13,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 0.1s",
                    fontFamily: MAC_FONT,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = A.glass)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <span style={{ color: item.color }}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
              {!filtered.length && (
                <div
                  style={{
                    padding: "14px 9px",
                    color: A.textMuted,
                    fontSize: 13,
                  }}
                >
                  No results found.
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Mobile view (iOS / iPod style) ────────────────────────────────────────────

function MobilePortfolio() {
  const [activeApp, setActiveApp] = useState<WinId | null>(null);
  const time = useMobileTime();

  const mobileApps: {
    id: WinId;
    label: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    { id: "about", label: "About", icon: <User size={26} />, color: A.teal },
    {
      id: "projects",
      label: "Projects",
      icon: <FolderOpen size={26} />,
      color: A.blue,
    },
    {
      id: "terminal",
      label: "Terminal",
      icon: <TerminalSquare size={26} />,
      color: A.green,
    },
    {
      id: "skills",
      label: "Skills",
      icon: <Settings2 size={26} />,
      color: A.violet,
    },
    {
      id: "contact",
      label: "Contact",
      icon: <Mail size={26} />,
      color: "#FB7185",
    },
    {
      id: "resume",
      label: "Resume",
      icon: <FileText size={26} />,
      color: "#F59E0B",
    },
  ];

  const dockApps = mobileApps.slice(0, 4);
  const activeDef = WIN_DEFS.find((d) => d.id === activeApp);

  return (
    // position: relative + height: 100dvh gives the data-year wrapper real height,
    // which is required because the CSS transform animation on that wrapper makes it
    // the containing block for any position:fixed descendants.
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100dvh",
        overflow: "hidden",
        fontFamily: MAC_FONT,
      }}
    >
      {/* Wallpaper fills this container */}
      <LiveWallpaper />

      {/* ── Home screen — fills the same container ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Status bar */}
        <div
          style={{
            height: 48,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 22px",
            background: "rgba(0,0,0,0.18)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          <span
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: A.text,
              minWidth: 60,
            }}
          >
            {time}
          </span>
          {/* Signal + WiFi + Battery */}
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            {/* Cell bars */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 2 }}>
              {[7, 10, 13, 16].map((h, i) => (
                <div
                  key={i}
                  style={{
                    width: 3,
                    height: h,
                    borderRadius: 1.5,
                    background: i < 3 ? A.text : "rgba(255,255,255,0.3)",
                  }}
                />
              ))}
            </div>
            {/* WiFi arcs */}
            <svg
              width="16"
              height="12"
              viewBox="0 0 16 12"
              fill="none"
              style={{ overflow: "visible" }}
            >
              <circle cx="8" cy="11" r="1.5" fill={A.text} />
              <path
                d="M4.8 7.6 A4.5 4.5 0 0 1 11.2 7.6"
                stroke={A.text}
                strokeWidth="1.4"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M2.2 5 A8 8 0 0 1 13.8 5"
                stroke={A.text}
                strokeWidth="1.4"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            {/* Battery */}
            <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
              <div
                style={{
                  width: 22,
                  height: 12,
                  borderRadius: 3,
                  border: `1.5px solid rgba(255,255,255,0.7)`,
                  padding: 1.5,
                  display: "flex",
                  alignItems: "stretch",
                }}
              >
                <div
                  style={{
                    width: "75%",
                    borderRadius: 1.5,
                    background: A.green,
                  }}
                />
              </div>
              <div
                style={{
                  width: 2,
                  height: 6,
                  borderRadius: 1,
                  background: "rgba(255,255,255,0.5)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Scrollable body — padded so content doesn't sit behind dock */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            padding: "28px 24px 110px",
            scrollbarWidth: "none",
          }}
        >
          {/* Profile header */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                overflow: "hidden",
                border: `2.5px solid ${A.teal}`,
                boxShadow: `0 0 24px rgba(${hexRgb(A.teal)},0.35)`,
                margin: "0 auto 12px",
              }}
            >
              <Image
                src={AvatarProfile}
                alt={FULL_NAME}
                width={72}
                height={72}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 700,
                color: A.text,
                letterSpacing: "-0.01em",
              }}
            >
              {FULL_NAME}
            </h1>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: 13,
                color: A.teal,
                fontWeight: 500,
              }}
            >
              {JOB_TITLE}
            </p>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: 12,
                color: A.textMuted,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
              }}
            >
              <MapPin size={11} color={A.textMuted} /> Cebu, Philippines
            </p>
          </div>

          {/* App icon grid — 3 columns like iPhone */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 18,
              maxWidth: 340,
              margin: "0 auto 32px",
            }}
          >
            {mobileApps.map((app) => (
              <motion.button
                key={app.id}
                whileTap={{ scale: 0.86 }}
                onClick={() => setActiveApp(app.id)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 4,
                  fontFamily: MAC_FONT,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "1",
                    borderRadius: 22,
                    background: `linear-gradient(145deg, rgba(${hexRgb(app.color)},0.28), rgba(${hexRgb(app.color)},0.09))`,
                    border: `1px solid rgba(${hexRgb(app.color)},0.30)`,
                    boxShadow: `0 4px 18px rgba(${hexRgb(app.color)},0.18), inset 0 1px 0 rgba(255,255,255,0.08)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: app.color,
                  }}
                >
                  {app.icon}
                </div>
                <span
                  style={{
                    fontSize: 11,
                    color: A.text,
                    fontWeight: 500,
                    textShadow: "0 1px 4px rgba(0,0,0,0.9)",
                  }}
                >
                  {app.label}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Social links row */}
          <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            {[
              {
                href: GITHUB_URL,
                icon: <Github size={17} />,
                color: A.text,
                label: "GitHub",
              },
              {
                href: LINKED_IN_URL,
                icon: <Linkedin size={17} />,
                color: "#60A5FA",
                label: "LinkedIn",
              },
              {
                href: `mailto:${EMAIL_ADDRESS}`,
                icon: <Mail size={17} />,
                color: A.teal,
                label: "Email",
              },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 5,
                  width: 68,
                  padding: "10px 0",
                  background: A.glass,
                  border: `1px solid ${A.glassBorder}`,
                  borderRadius: 16,
                  color: l.color,
                  textDecoration: "none",
                }}
              >
                {l.icon}
                <span style={{ fontSize: 10, color: A.textMid }}>
                  {l.label}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom dock — pinned to bottom of the outer container */}
        <div
          style={{
            position: "absolute",
            bottom: 16,
            left: 20,
            right: 20,
            background: A.dock,
            border: `1px solid ${A.dockBorder}`,
            borderRadius: 24,
            padding: "10px 20px",
            backdropFilter: "blur(32px) saturate(1.5)",
            WebkitBackdropFilter: "blur(32px) saturate(1.5)",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            boxShadow:
              "0 10px 36px rgba(0,0,0,0.60), inset 0 1px 0 rgba(255,255,255,0.06)",
            zIndex: 50,
          }}
        >
          {dockApps.map((app) => (
            <motion.button
              key={app.id}
              whileTap={{ scale: 0.86 }}
              onClick={() => setActiveApp(app.id)}
              style={{
                width: 50,
                height: 50,
                borderRadius: 15,
                background: `linear-gradient(135deg, rgba(${hexRgb(app.color)},0.22), rgba(${hexRgb(app.color)},0.08))`,
                border: `1px solid rgba(${hexRgb(app.color)},0.28)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: app.color,
                cursor: "pointer",
                boxShadow: `0 4px 14px rgba(${hexRgb(app.color)},0.20)`,
              }}
              aria-label={app.label}
            >
              {app.icon}
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── App sheet — slides up from bottom, absolute within the container ── */}
      <AnimatePresence>
        {activeApp && (
          <motion.div
            key={activeApp}
            initial={{ y: "100%", opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0.6 }}
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 36,
              mass: 0.9,
            }}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 200,
              background: A.window,
              backdropFilter: "blur(32px) saturate(1.3)",
              WebkitBackdropFilter: "blur(32px) saturate(1.3)",
              display: "flex",
              flexDirection: "column",
              fontFamily: MAC_FONT,
            }}
          >
            {/* iOS navigation bar */}
            <div
              style={{
                height: 54,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                padding: "0 16px",
                borderBottom: `1px solid ${A.glassBorder}`,
                background: A.titleBar,
              }}
            >
              <button
                onClick={() => setActiveApp(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: activeDef?.color ?? A.teal,
                  fontSize: 15,
                  fontFamily: MAC_FONT,
                  padding: "4px 0",
                  minWidth: 70,
                }}
              >
                <ChevronLeft size={20} />
                <span>Home</span>
              </button>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <span
                  style={{
                    color: activeDef?.color ?? A.teal,
                    opacity: 0.9,
                    display: "flex",
                  }}
                >
                  {activeDef?.icon}
                </span>
                <span style={{ fontSize: 14, fontWeight: 600, color: A.text }}>
                  {activeDef?.title}
                </span>
              </div>
              <div style={{ minWidth: 70 }} />
            </div>

            {/* Window content — reused as-is */}
            <div style={{ flex: 1, overflow: "hidden" }}>
              {activeApp === "about" && <AboutContent />}
              {activeApp === "projects" && <ProjectsContent />}
              {activeApp === "terminal" && (
                <TerminalContent onOpen={(id) => setActiveApp(id)} />
              )}
              {activeApp === "skills" && <SkillsContent />}
              {activeApp === "contact" && <ContactContent />}
              {activeApp === "resume" && <ResumeContent />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────

const INIT_WINS: Record<WinId, WinState> = {
  about: { open: true, minimized: false, maximized: false, zIndex: 20 },
  projects: { open: false, minimized: false, maximized: false, zIndex: 10 },
  terminal: { open: true, minimized: false, maximized: false, zIndex: 21 },
  skills: { open: false, minimized: false, maximized: false, zIndex: 10 },
  contact: { open: false, minimized: false, maximized: false, zIndex: 10 },
  resume: { open: false, minimized: false, maximized: false, zIndex: 10 },
};

export function Portfolio2026() {
  useLocaleRefresh();
  const isMobile = useIsMobile();
  const [wins, setWins] = useState<Record<WinId, WinState>>(INIT_WINS);
  const [topZ, setTopZ] = useState(30);
  const [cmdOpen, setCmdOpen] = useState(false);

  const openWin = useCallback(
    (id: WinId) => {
      const z = topZ + 1;
      setTopZ(z);
      setWins((w) => ({
        ...w,
        [id]: { ...w[id], open: true, minimized: false, zIndex: z },
      }));
    },
    [topZ],
  );

  const closeWin = (id: WinId) =>
    setWins((w) => ({
      ...w,
      [id]: { ...w[id], open: false, minimized: false },
    }));
  const minimizeWin = (id: WinId) =>
    setWins((w) => ({ ...w, [id]: { ...w[id], minimized: true } }));
  const maximizeWin = (id: WinId) =>
    setWins((w) => ({ ...w, [id]: { ...w[id], maximized: !w[id].maximized } }));
  const focusWin = useCallback(
    (id: WinId) => {
      const z = topZ + 1;
      setTopZ(z);
      setWins((w) => ({ ...w, [id]: { ...w[id], zIndex: z } }));
    },
    [topZ],
  );
  const restoreWin = (id: WinId) => openWin(id);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  if (isMobile) return <MobilePortfolio />;

  const desktopIcons = [
    { def: WIN_DEFS[0], icon: <User size={26} /> },
    { def: WIN_DEFS[1], icon: <FolderOpen size={26} /> },
    { def: WIN_DEFS[2], icon: <TerminalSquare size={26} /> },
    { def: WIN_DEFS[3], icon: <Settings2 size={26} /> },
    { def: WIN_DEFS[4], icon: <Mail size={26} /> },
    { def: WIN_DEFS[5], icon: <FileText size={26} /> },
  ];

  return (
    <>
      <a
        href="#desktop"
        style={{
          position: "fixed",
          top: -40,
          left: 16,
          zIndex: 99999,
          background: A.teal,
          color: "#05090E",
          borderRadius: 6,
          padding: "5px 12px",
          fontSize: 13,
          fontWeight: 600,
          textDecoration: "none",
          transition: "top 0.15s",
          fontFamily: MAC_FONT,
        }}
        onFocus={(e) => (e.currentTarget.style.top = "34px")}
        onBlur={(e) => (e.currentTarget.style.top = "-40px")}
      >
        Skip to content
      </a>

      <LiveWallpaper />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100vw",
          height: "100dvh",
          overflow: "hidden",
          fontFamily: MAC_FONT,
        }}
      >
        <MenuBar onCmdK={() => setCmdOpen(true)} />

        <main
          id="desktop"
          aria-label="Desktop"
          style={{ position: "absolute", inset: 0, top: 28 }}
        >
          {/* Desktop icons — right column */}
          <div
            style={{
              position: "absolute",
              top: 16,
              right: 14,
              display: "flex",
              flexDirection: "column",
              gap: 4,
              zIndex: 10,
            }}
          >
            {desktopIcons.map(({ def, icon }) => (
              <DesktopIcon
                key={def.id}
                label={def.title}
                icon={icon}
                color={def.color}
                isOpen={wins[def.id].open}
                onClick={() => openWin(def.id)}
              />
            ))}
          </div>

          {/* Windows */}
          <AnimatePresence>
            {WIN_DEFS.map((def) => (
              <AppWindow
                key={def.id}
                def={def}
                state={wins[def.id]}
                onFocus={() => focusWin(def.id)}
                onClose={() => closeWin(def.id)}
                onMinimize={() => minimizeWin(def.id)}
                onMaximize={() => maximizeWin(def.id)}
                onOpen={openWin}
              />
            ))}
          </AnimatePresence>
        </main>

        <Dock windows={wins} onOpen={openWin} onRestore={restoreWin} />
        <CommandPalette
          open={cmdOpen}
          onClose={() => setCmdOpen(false)}
          onOpen={openWin}
        />
      </div>
    </>
  );
}
