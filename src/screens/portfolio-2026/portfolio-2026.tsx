"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, AnimatePresence } from "framer-motion";
import type { PanInfo } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  Globe, FolderOpen, Settings2, TerminalSquare,
  Github, Linkedin, Mail, MapPin, Briefcase, GraduationCap,
  ExternalLink, Search, Command, ChevronLeft, ChevronRight,
  RefreshCw, Lock, FolderGit2, FileCode, User,
  FileText, X, Minus, Maximize2, ArrowRight,
} from "lucide-react";
import {
  FULL_NAME, JOB_TITLE, EMAIL_ADDRESS,
  getExperience, getEducation, SKILL_CATEGORIES, getProjects,
} from "@/config";
import { GITHUB_URL, LINKED_IN_URL } from "@/config/url";
import { translate, useLocaleRefresh } from "@/i18n";
import AvatarProfile from "@/assets/avatar-profile.jpg";

const LiveWallpaper = dynamic(() => import("./live-wallpaper").then(m => ({ default: m.LiveWallpaper })), { ssr: false });

// ── Palette ────────────────────────────────────────────────────────────────────

const A = {
  teal:         "#2DD4BF",
  violet:       "#A78BFA",
  green:        "#4ADE80",
  blue:         "#60A5FA",
  text:         "#E2E8F0",
  textMid:      "#94A3B8",
  textMuted:    "#475569",
  menuBar:      "rgba(8,12,20,0.88)",
  menuBorder:   "rgba(255,255,255,0.07)",
  window:       "rgba(12,17,28,0.94)",
  windowBorder: "rgba(255,255,255,0.10)",
  titleBar:     "rgba(255,255,255,0.035)",
  dock:         "rgba(16,22,36,0.70)",
  dockBorder:   "rgba(255,255,255,0.12)",
  glass:        "rgba(255,255,255,0.045)",
  glassBorder:  "rgba(255,255,255,0.08)",
  card:         "rgba(255,255,255,0.03)",
  cardBorder:   "rgba(255,255,255,0.07)",
  inputBg:      "rgba(255,255,255,0.06)",
  termBg:       "#06090F",
};

// ── Utility ────────────────────────────────────────────────────────────────────

function useTime() {
  const [t, setT] = useState("");
  useEffect(() => {
    const upd = () => setT(new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }));
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

function hexRgb(hex: string) {
  return `${parseInt(hex.slice(1,3),16)},${parseInt(hex.slice(3,5),16)},${parseInt(hex.slice(5,7),16)}`;
}

function formatDate(m: import("moment").Moment | "present") {
  return m === "present" ? "Present" : m.format("MMM YYYY");
}

// ── Window definitions ─────────────────────────────────────────────────────────

type WinId = "about" | "projects" | "terminal" | "skills" | "contact";

interface WinDef {
  id: WinId;
  title: string;
  subtitle?: string;
  color: string;
  icon: React.ReactNode;
  defaultPos: { x: number; y: number };
  defaultSize: { w: number; h: number };
}

const WIN_DEFS: WinDef[] = [
  { id: "about",    title: "About Me",        color: A.teal,   icon: <User size={14} />,         defaultPos: { x: 80,  y: 50  }, defaultSize: { w: 720, h: 480 } },
  { id: "projects", title: "Projects",         color: A.blue,   icon: <FolderOpen size={14} />,   defaultPos: { x: 110, y: 70  }, defaultSize: { w: 760, h: 500 } },
  { id: "terminal", title: "Terminal",         color: A.green,  icon: <TerminalSquare size={14} />,defaultPos: { x: 140, y: 90  }, defaultSize: { w: 660, h: 400 } },
  { id: "skills",   title: "Skills & Stack",   color: A.violet, icon: <Settings2 size={14} />,    defaultPos: { x: 100, y: 60  }, defaultSize: { w: 700, h: 460 } },
  { id: "contact",  title: "Contact",          color: "#FB7185",icon: <Mail size={14} />,          defaultPos: { x: 160, y: 80  }, defaultSize: { w: 480, h: 340 } },
];

interface WinState {
  open: boolean;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
}

// ── Menu bar ────────────────────────────────────────────────────────────────────

function MenuBar({ onCmdK }: { onCmdK: () => void }) {
  const time = useTime();
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 9000,
      height: 26,
      background: A.menuBar,
      borderBottom: `1px solid ${A.menuBorder}`,
      backdropFilter: "blur(24px)",
      display: "flex", alignItems: "center",
      padding: "0 14px",
      userSelect: "none",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, flex: 1 }}>
        <svg width="13" height="13" viewBox="0 0 69 69" fill="none">
          <path d="M30.0798 25.1276V18C13.3577 18.89 10.27 45.55 31.11 47.33C43.33 47.33 48.51 34.72 44.27 26.09H31.18V33.49H38.85C38.99 37.33 35.15 41.37 29.6 40.34C20.28 38.08 21.79 26.02 30.08 25.13Z" fill={A.teal}/>
          <path d="M31.11 18V24.78H45.02C48.86 30.68 49.15 47.44 31.11 48.43V55.83C46.94 55.83 62.29 36.78 48.86 18H31.11Z" fill={A.teal}/>
        </svg>
        <span style={{ fontSize: 13, fontWeight: 600, color: A.text }}>Gene Paul Mar Javier</span>
        <span style={{ fontSize: 12, color: A.textMuted }}>Portfolio 2026</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={onCmdK}
          style={{
            display: "flex", alignItems: "center", gap: 4,
            background: A.glass, border: `1px solid ${A.glassBorder}`,
            borderRadius: 5, padding: "1px 7px",
            color: A.textMuted, fontSize: 11, cursor: "pointer",
          }}
          aria-label="Command palette ⌘K"
        >
          <Command size={10} /><span>K</span>
        </button>
        <span style={{ fontSize: 12, color: A.textMid }}>{time}</span>
      </div>
    </div>
  );
}

// ── Traffic lights ─────────────────────────────────────────────────────────────

function TrafficLights({
  onClose, onMinimize, onMaximize,
}: {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      style={{ display: "flex", gap: 7, alignItems: "center" }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <button
        onClick={onClose}
        style={{
          width: 12, height: 12, borderRadius: "50%",
          background: "#FF5F57", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
        aria-label="Close window"
      >
        {hov && <X size={7} color="#8b0000" strokeWidth={2.5} />}
      </button>
      <button
        onClick={onMinimize}
        style={{
          width: 12, height: 12, borderRadius: "50%",
          background: "#FFBD2E", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
        aria-label="Minimize window"
      >
        {hov && <Minus size={7} color="#7a5200" strokeWidth={2.5} />}
      </button>
      <button
        onClick={onMaximize}
        style={{
          width: 12, height: 12, borderRadius: "50%",
          background: "#28C840", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
        aria-label="Maximize window"
      >
        {hov && <Maximize2 size={7} color="#004c00" strokeWidth={2.5} />}
      </button>
    </div>
  );
}

// ── Window content: About ──────────────────────────────────────────────────────

function AboutContent() {
  const [tab, setTab] = useState<"overview" | "experience" | "education">("overview");
  const exps = getExperience().filter((e) => e.isWork);
  const edus = getEducation();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Safari-style URL bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "7px 12px", borderBottom: `1px solid ${A.glassBorder}`,
        background: A.titleBar, flexShrink: 0,
      }}>
        <ChevronLeft size={13} color={A.textMuted} />
        <ChevronRight size={13} color={A.textMuted} />
        <RefreshCw size={12} color={A.textMuted} />
        <div style={{
          flex: 1, display: "flex", alignItems: "center", gap: 5,
          background: A.inputBg, borderRadius: 7, padding: "3px 10px",
          border: `1px solid ${A.glassBorder}`, fontSize: 12, color: A.textMid,
        }}>
          <Lock size={10} color={A.teal} />
          genepaulmarjavier.dev/2026/about
        </div>
      </div>
      {/* Tabs */}
      <div style={{
        display: "flex", gap: 2, padding: "7px 14px 0",
        borderBottom: `1px solid ${A.glassBorder}`, flexShrink: 0,
      }}>
        {(["overview","experience","education"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "4px 12px", borderRadius: "7px 7px 0 0", border: "none",
            background: tab === t ? A.window : "transparent",
            color: tab === t ? A.text : A.textMid,
            fontSize: 12, fontWeight: tab === t ? 600 : 400, cursor: "pointer",
            borderBottom: tab === t ? `2px solid ${A.teal}` : "2px solid transparent",
          }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px", scrollbarWidth: "none" }}>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
            {tab === "overview" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <div style={{ width: 88, height: 88, borderRadius: "50%", overflow: "hidden", border: `2px solid ${A.teal}`, boxShadow: `0 0 22px rgba(${hexRgb(A.teal)},0.28)` }}>
                      <Image src={AvatarProfile} alt={FULL_NAME} width={88} height={88} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                    </div>
                    <div style={{ position: "absolute", bottom: 2, right: 2, width: 12, height: 12, borderRadius: "50%", background: A.green, border: "2px solid #0B0F16" }} />
                  </div>
                  <div>
                    <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: A.text }}>{FULL_NAME}</h1>
                    <p style={{ margin: "3px 0 8px", fontSize: 14, color: A.teal, fontWeight: 500 }}>{JOB_TITLE}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: A.textMid }}>
                      <MapPin size={12} color={A.textMuted} /> Cebu, Philippines
                    </div>
                  </div>
                </div>
                <div style={{ background: A.card, border: `1px solid ${A.cardBorder}`, borderRadius: 10, padding: "14px 18px" }}>
                  <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.8, color: A.textMid }}>
                    Full-stack software engineer crafting production-ready applications with{" "}
                    <span style={{ color: A.teal }}>React & Next.js</span> on the frontend and{" "}
                    <span style={{ color: A.violet }}>Spring Boot & Java</span> on the backend.
                    Passionate about clean architecture, developer experience, and shipping things that matter.
                  </p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                  {[
                    { v: "3+",    l: "Years",       c: A.teal   },
                    { v: "10+",   l: "Projects",    c: A.violet },
                    { v: "20+",   l: "Technologies",c: A.green  },
                    { v: "Active",l: "Status",      c: "#FBBF24"},
                  ].map((s) => (
                    <div key={s.l} style={{ background: A.card, border: `1px solid ${A.cardBorder}`, borderRadius: 9, padding: "12px", textAlign: "center" }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: s.c }}>{s.v}</div>
                      <div style={{ fontSize: 10, color: A.textMuted, marginTop: 1 }}>{s.l}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[
                    { href: GITHUB_URL,    icon: <Github size={13} />,   label: "GitHub",   c: A.text },
                    { href: LINKED_IN_URL, icon: <Linkedin size={13} />, label: "LinkedIn", c: "#60A5FA" },
                    { href: `mailto:${EMAIL_ADDRESS}`, icon: <Mail size={13} />, label: EMAIL_ADDRESS, c: A.teal },
                  ].map((l) => (
                    <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 6, background: A.glass, border: `1px solid ${A.glassBorder}`, borderRadius: 7, padding: "6px 12px", fontSize: 12, color: l.c, textDecoration: "none" }}>
                      {l.icon} {l.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
            {tab === "experience" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <h2 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: A.text }}>Work Experience</h2>
                {exps.map((exp, i) => (
                  <div key={i} style={{ display: "flex", gap: 14 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 18, flexShrink: 0 }}>
                      <div style={{ width: 9, height: 9, borderRadius: "50%", background: A.teal, boxShadow: `0 0 7px ${A.teal}`, marginTop: 6, flexShrink: 0 }} />
                      {i < exps.length - 1 && <div style={{ flex: 1, width: 1, background: `linear-gradient(to bottom, rgba(${hexRgb(A.teal)},0.35), transparent)`, marginTop: 5 }} />}
                    </div>
                    <div style={{ flex: 1, background: A.card, border: `1px solid ${A.cardBorder}`, borderRadius: 9, padding: "12px 14px", marginBottom: 6 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 13.5, fontWeight: 600, color: A.text }}>{exp.title}</span>
                        <span style={{ fontSize: 11, color: A.textMuted }}>{formatDate(exp.startYear)} — {formatDate(exp.endYear)}</span>
                      </div>
                      {exp.subtitle && <div style={{ fontSize: 12, color: A.teal, marginTop: 2 }}>{exp.subtitle}{exp.employmentType && <span style={{ marginLeft: 6, fontSize: 11, color: A.violet, background: `rgba(${hexRgb(A.violet)},0.12)`, borderRadius: 4, padding: "1px 5px" }}>{exp.employmentType}</span>}</div>}
                      <p style={{ margin: "7px 0 0", fontSize: 12, lineHeight: 1.65, color: A.textMid, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {tab === "education" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <h2 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: A.text }}>Education</h2>
                {edus.map((edu, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, background: A.card, border: `1px solid ${A.cardBorder}`, borderRadius: 9, padding: "12px 14px" }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: `rgba(${hexRgb(A.violet)},0.12)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <GraduationCap size={16} color={A.violet} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: A.text }}>{edu.title}</div>
                      {edu.subtitle && <div style={{ fontSize: 12, color: A.violet, marginTop: 1 }}>{edu.subtitle}</div>}
                      <div style={{ fontSize: 11, color: A.textMuted, marginTop: 3 }}>{formatDate(edu.startYear)} — {formatDate(edu.endYear)}</div>
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

// ── Window content: Projects (Finder) ─────────────────────────────────────────

type ProjFilter = "all" | "web" | "open" | "confidential";

function ProjectsContent() {
  const [filter, setFilter] = useState<ProjFilter>("all");
  const all = getProjects().filter((p) => !p.hidden).slice(0, 15);
  const filtered = filter === "all" ? all
    : filter === "open" ? all.filter((p) => p.codeUrl)
    : filter === "confidential" ? all.filter((p) => p.type === "confidential")
    : all.filter((p) => p.type !== "confidential");

  const sidebar: { id: ProjFilter; label: string }[] = [
    { id: "all",         label: "All Projects"  },
    { id: "web",         label: "Web Apps"      },
    { id: "open",        label: "Open Source"   },
    { id: "confidential",label: "Confidential"  },
  ];

  return (
    <div style={{ display: "flex", height: "100%" }}>
      {/* Finder sidebar */}
      <div style={{ width: 155, flexShrink: 0, background: "rgba(255,255,255,0.018)", borderRight: `1px solid ${A.glassBorder}`, padding: "12px 6px", display: "flex", flexDirection: "column", gap: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: A.textMuted, padding: "0 8px 6px", letterSpacing: "0.08em", textTransform: "uppercase" }}>Locations</div>
        {sidebar.map((s) => (
          <button key={s.id} onClick={() => setFilter(s.id)} style={{ display: "flex", alignItems: "center", gap: 7, width: "100%", padding: "6px 9px", borderRadius: 6, border: "none", background: filter === s.id ? `rgba(${hexRgb(A.blue)},0.14)` : "transparent", color: filter === s.id ? A.blue : A.textMid, fontSize: 12, cursor: "pointer", textAlign: "left" }}>
            <FolderOpen size={12} style={{ flexShrink: 0 }} /> {s.label}
          </button>
        ))}
        <div style={{ marginTop: 12, fontSize: 10, fontWeight: 600, color: A.textMuted, padding: "0 8px 6px", letterSpacing: "0.08em", textTransform: "uppercase" }}>Tags</div>
        {["React","Spring Boot","TypeScript"].map((t) => (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 7, padding: "4px 9px", fontSize: 11, color: A.textMuted }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: A.teal, flexShrink: 0 }} /> {t}
          </div>
        ))}
      </div>
      {/* Grid */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px", scrollbarWidth: "none" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {filtered.map((p) => (
            <div key={p.projectId} style={{ background: A.card, border: `1px solid ${A.cardBorder}`, borderRadius: 9, padding: "11px 13px", cursor: "default", transition: "border-color 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = `rgba(${hexRgb(A.blue)},0.3)`)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = A.cardBorder)}
            >
              <div style={{ width: 30, height: 30, borderRadius: 7, marginBottom: 7, background: p.type === "confidential" ? "rgba(251,191,36,0.12)" : `rgba(${hexRgb(A.blue)},0.10)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {p.type === "confidential" ? <FileCode size={15} color="#FBBF24" /> : <FolderGit2 size={15} color={A.blue} />}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: A.text, lineHeight: 1.3, marginBottom: 3 }}>{p.title}</div>
              {p.company && <div style={{ fontSize: 10, color: A.textMuted, marginBottom: 4 }}>{p.company}</div>}
              <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                {p.category.slice(0, 2).map((c) => (
                  <span key={c} style={{ fontSize: 9, background: A.glass, border: `1px solid ${A.glassBorder}`, borderRadius: 4, padding: "1px 4px", color: A.textMid }}>{c}</span>
                ))}
              </div>
              {(p.previewUrl || p.codeUrl) && (
                <a href={p.previewUrl || p.codeUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 3, marginTop: 6, fontSize: 10, color: A.teal, textDecoration: "none" }}>
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

interface TermEntry { input?: string; output: string[] }

const CMDS: Record<string, () => string[]> = {
  help: () => ["Available commands:", "  whoami           — personal info", "  ls               — list projects", "  cat skills.json  — print tech stack", "  open <app>       — open About/Projects/Skills", "  clear            — clear terminal", ""],
  whoami: () => [`Name     : ${FULL_NAME}`, `Role     : ${JOB_TITLE}`, "Location : Cebu, Philippines", `Email    : ${EMAIL_ADDRESS}`, "GitHub   : github.com/javiergenepaul", "Status   : Open to opportunities", ""],
  ls: () => { const p = getProjects().filter(x => !x.hidden).slice(0, 8); return ["total " + p.length, ...p.map(x => `drwxr-xr-x  ${x.projectId}/`), ""]; },
  "ls -la": () => CMDS.ls(),
  "cat skills.json": () => {
    const lines = ["{"];
    SKILL_CATEGORIES.forEach((c, i) => { const n = c.stacks.slice(0,5).map(s => `"${translate(`services.stack.${s.name}` as any) || s.name}"`).join(", "); lines.push(`  "${c.label}": [${n}${c.stacks.length > 5 ? ", ..." : ""}]${i < SKILL_CATEGORIES.length-1 ? "," : ""}`); });
    return [...lines, "}", ""];
  },
};

function TerminalContent({ onOpen }: { onOpen: (id: WinId) => void }) {
  const [history, setHistory] = useState<TermEntry[]>([{ output: ["Portfolio Terminal  ─  v2026.0.0", `Connected as visitor. Hello! I'm ${FULL_NAME}.`, "Type 'help' for available commands.", ""] }]);
  const [input, setInput] = useState("");
  const [cmdHist, setCmdHist] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [history]);

  const run = useCallback((cmd: string) => {
    const t = cmd.trim().toLowerCase();
    if (t === "clear") { setHistory([]); return; }
    const appMap: Record<string, WinId> = { "open about": "about", "open projects": "projects", "open skills": "skills", "open contact": "contact" };
    if (appMap[t]) { onOpen(appMap[t]); setHistory(h => [...h, { input: cmd, output: [`Opening ${appMap[t]}...`, ""] }]); setCmdHist(h => [cmd, ...h]); setHistIdx(-1); return; }
    const out = CMDS[t] ? CMDS[t]() : [`bash: ${t}: command not found`, "Type 'help' for available commands.", ""];
    setHistory(h => [...h, { input: cmd, output: out }]);
    setCmdHist(h => [cmd, ...h]);
    setHistIdx(-1);
  }, [onOpen]);

  return (
    <div onClick={() => inputRef.current?.focus()} style={{ display: "flex", flexDirection: "column", height: "100%", background: A.termBg, fontFamily: "'JetBrains Mono','Fira Code','Cascadia Code',monospace", fontSize: 13, cursor: "text" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px 8px", scrollbarWidth: "none" }}>
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
              <div key={j} style={{ color: l.startsWith("bash:") ? "#F87171" : A.textMid, lineHeight: 1.65, whiteSpace: "pre" }}>{l || "\u00A0"}</div>
            ))}
          </div>
        ))}
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 3 }}>
          <span style={{ color: A.green }}>➜</span>
          <span style={{ color: A.teal }}>~/portfolio</span>
          <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { run(input); setInput(""); }
              else if (e.key === "ArrowUp") { e.preventDefault(); const n = Math.min(histIdx+1, cmdHist.length-1); setHistIdx(n); setInput(cmdHist[n] ?? ""); }
              else if (e.key === "ArrowDown") { e.preventDefault(); const n = Math.max(histIdx-1,-1); setHistIdx(n); setInput(n === -1 ? "" : cmdHist[n] ?? ""); }
            }}
            autoFocus spellCheck={false}
            style={{ flex:1, background:"none", border:"none", outline:"none", color: A.text, fontFamily:"inherit", fontSize:"inherit", caretColor: A.teal }}
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
    <div style={{ display: "flex", height: "100%" }}>
      <div style={{ width: 170, flexShrink: 0, background: "rgba(255,255,255,0.018)", borderRight: `1px solid ${A.glassBorder}`, padding: "12px 6px", overflowY: "auto", scrollbarWidth: "none" }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: A.textMuted, padding: "0 8px 8px", letterSpacing: "0.08em", textTransform: "uppercase" }}>Categories</div>
        {SKILL_CATEGORIES.map((c, i) => {
          const col = ACCENT[i % ACCENT.length];
          return (
            <button key={c.key} onClick={() => setActive(c.key)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "7px 9px", borderRadius: 6, border: "none", background: active === c.key ? `rgba(${hexRgb(col)},0.12)` : "transparent", color: active === c.key ? col : A.textMid, fontSize: 12, cursor: "pointer" }}>
              <span>{c.label}</span>
              <span style={{ fontSize: 10, opacity: 0.55 }}>{c.stacks.length}</span>
            </button>
          );
        })}
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "18px 22px", scrollbarWidth: "none" }}>
        {cat && (
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.16 }}>
              <h2 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700, color: A.text }}>
                {cat.label} <span style={{ fontSize: 12, color: A.textMuted, fontWeight: 400 }}>({cat.stacks.length} technologies)</span>
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {cat.stacks.map((s, i) => {
                  const col = ACCENT[SKILL_CATEGORIES.findIndex(c => c.key === active) % ACCENT.length];
                  return (
                    <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 6, background: A.card, border: `1px solid ${A.cardBorder}`, borderRadius: 7, padding: "5px 11px", fontSize: 12, color: A.text, transition: "border-color 0.14s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = `rgba(${hexRgb(col)},0.35)`)}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = A.cardBorder)}
                    >
                      {s.isFavorite && <div style={{ width: 5, height: 5, borderRadius: "50%", background: col, boxShadow: `0 0 5px ${col}`, flexShrink: 0 }} />}
                      {translate(`services.stack.${s.name}` as any) || s.name}
                      {s.isStudying && <span style={{ fontSize: 9, color: A.textMuted, background: A.glass, borderRadius: 3, padding: "0 3px" }}>learning</span>}
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
    { label: "Email",    value: EMAIL_ADDRESS,  href: `mailto:${EMAIL_ADDRESS}`, icon: <Mail size={18} />, color: A.teal,   desc: "Drop a message any time" },
    { label: "GitHub",   value: "javiergenepaul", href: GITHUB_URL,               icon: <Github size={18} />, color: A.text,  desc: "View open-source work" },
    { label: "LinkedIn", value: "gene-paul-mar-javier", href: LINKED_IN_URL,     icon: <Linkedin size={18} />, color: "#60A5FA", desc: "Connect professionally" },
  ];
  return (
    <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ marginBottom: 4 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: A.text }}>Get in Touch</h2>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: A.textMid }}>Open to new opportunities, collaborations, and interesting conversations.</p>
      </div>
      {links.map((l) => (
        <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 14, background: A.card, border: `1px solid ${A.cardBorder}`, borderRadius: 10, padding: "14px 18px", textDecoration: "none", transition: "border-color 0.15s" }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = `rgba(${hexRgb(l.color)},0.35)`)}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = A.cardBorder)}
        >
          <div style={{ width: 42, height: 42, borderRadius: 10, background: `rgba(${hexRgb(l.color)},0.10)`, display: "flex", alignItems: "center", justifyContent: "center", color: l.color, flexShrink: 0 }}>{l.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: A.text }}>{l.label}</div>
            <div style={{ fontSize: 12, color: l.color, marginTop: 1 }}>{l.value}</div>
            <div style={{ fontSize: 11, color: A.textMuted, marginTop: 1 }}>{l.desc}</div>
          </div>
          <ExternalLink size={14} color={A.textMuted} />
        </a>
      ))}
    </div>
  );
}

// ── Window frame ───────────────────────────────────────────────────────────────

function AppWindow({
  def, state, onFocus, onClose, onMinimize, onMaximize, onOpen,
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

  // Must be after hooks
  if (!state.open) return null;

  const handlePan = (_: unknown, info: PanInfo) => {
    if (!state.maximized) {
      x.set(Math.max(0, x.get() + info.delta.x));
      y.set(Math.max(26, y.get() + info.delta.y));
    }
  };

  const winStyle: React.CSSProperties = state.maximized ? {
    position: "fixed",
    top: 26, left: 0, right: 0, bottom: 64,
    width: "auto", height: "auto",
    borderRadius: 0,
  } : {
    position: "fixed",
    top: 0, left: 0,
    width: def.defaultSize.w,
    height: def.defaultSize.h,
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
        backdropFilter: "blur(32px)",
        boxShadow: "0 28px 70px rgba(0,0,0,0.65), 0 0 0 0.5px rgba(255,255,255,0.04)",
        overflow: "hidden",
      }}
      initial={{ scale: 0.92, opacity: 0, y: state.maximized ? 0 : (y.get() + 20) }}
      animate={{ scale: 1, opacity: 1, y: state.maximized ? 0 : y.get() }}
      exit={{ scale: 0.88, opacity: 0, transition: { duration: 0.18 } }}
      onClick={onFocus}
    >
      {/* Title bar / drag handle */}
      <motion.div
        onPan={handlePan}
        style={{
          height: 40, flexShrink: 0,
          background: A.titleBar,
          borderBottom: `1px solid ${A.windowBorder}`,
          display: "flex", alignItems: "center",
          padding: "0 14px", gap: 10,
          cursor: state.maximized ? "default" : "move",
          userSelect: "none",
        }}
        onDoubleClick={onMaximize}
      >
        <TrafficLights onClose={onClose} onMinimize={onMinimize} onMaximize={onMaximize} />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <span style={{ color: def.color }}>{def.icon}</span>
          <span style={{ fontSize: 13, fontWeight: 500, color: A.textMid }}>{def.title}</span>
        </div>
      </motion.div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        {def.id === "about"    && <AboutContent />}
        {def.id === "projects" && <ProjectsContent />}
        {def.id === "terminal" && <TerminalContent onOpen={onOpen} />}
        {def.id === "skills"   && <SkillsContent />}
        {def.id === "contact"  && <ContactContent />}
      </div>
    </motion.div>
  );
}

// ── Desktop icon ───────────────────────────────────────────────────────────────

function DesktopIcon({
  label, icon, color, isOpen, onClick,
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
        display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
        padding: "8px 10px", borderRadius: 8, border: "none",
        background: hov ? "rgba(255,255,255,0.06)" : "transparent",
        cursor: "pointer", width: 80,
        outline: isOpen ? `1px solid rgba(${hexRgb(color)},0.4)` : "none",
        transition: "background 0.12s",
      }}
      aria-label={`Open ${label}`}
    >
      <motion.div
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        style={{
          width: 56, height: 56, borderRadius: 13,
          background: `linear-gradient(145deg, rgba(${hexRgb(color)},0.22), rgba(${hexRgb(color)},0.08))`,
          border: `1px solid rgba(${hexRgb(color)},0.28)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: color,
          boxShadow: `0 6px 18px rgba(${hexRgb(color)},0.18), inset 0 1px 0 rgba(255,255,255,0.10)`,
        }}
      >
        {icon}
      </motion.div>
      <span style={{
        fontSize: 11, color: A.text, fontWeight: 500,
        textShadow: "0 1px 3px rgba(0,0,0,0.9)",
        background: "rgba(0,0,0,0.35)", borderRadius: 4, padding: "1px 5px",
      }}>
        {label}
      </span>
    </button>
  );
}

// ── Dock ───────────────────────────────────────────────────────────────────────

function Dock({
  windows, onOpen, onRestore,
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
    if (hov === id) return 60;
    if (hov) {
      const hi = dockApps.findIndex((a) => a.id === hov);
      const ci = dockApps.findIndex((a) => a.id === id);
      if (Math.abs(hi - ci) === 1) return 50;
    }
    return 44;
  };

  return (
    <div style={{
      position: "fixed", bottom: 10, left: "50%", transform: "translateX(-50%)",
      zIndex: 8000,
      background: A.dock,
      border: `1px solid ${A.dockBorder}`,
      borderRadius: 20,
      padding: "7px 12px",
      backdropFilter: "blur(28px)",
      display: "flex", gap: 6, alignItems: "flex-end",
      boxShadow: "0 8px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)",
    }}>
      {dockApps.map((app) => {
        const size = getSize(app.id);
        return (
          <div key={app.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <motion.button
              animate={{ width: size, height: size }}
              transition={{ type: "spring", stiffness: 420, damping: 28 }}
              onClick={() => app.isMinimized ? onRestore(app.id) : onOpen(app.id)}
              onMouseEnter={() => setHov(app.id)}
              onMouseLeave={() => setHov(null)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: 12,
                background: app.isOpen
                  ? `linear-gradient(135deg, rgba(${hexRgb(app.color)},0.26), rgba(${hexRgb(app.color)},0.10))`
                  : A.glass,
                color: app.isOpen ? app.color : A.textMid,
                cursor: "pointer",
                boxShadow: app.isOpen ? `0 0 16px rgba(${hexRgb(app.color)},0.22)` : "none",
                border: `1px solid ${app.isOpen ? `rgba(${hexRgb(app.color)},0.32)` : A.glassBorder}`,
                flexShrink: 0,
                position: "relative",
              }}
              aria-label={`${app.title}${app.isMinimized ? " (minimized)" : ""}`}
            >
              {app.isMinimized && (
                <div style={{ position: "absolute", top: 3, right: 3, width: 5, height: 5, borderRadius: "50%", background: "#FFBD2E" }} />
              )}
              {app.icon}
            </motion.button>
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: app.isOpen && !app.isMinimized ? app.color : "transparent", transition: "background 0.15s" }} />
          </div>
        );
      })}

      {/* Separator + GitHub */}
      <div style={{ width: 1, height: 32, background: A.glassBorder, margin: "0 4px 8px", alignSelf: "center" }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <motion.a
          animate={{ width: 44, height: 44 }}
          href={GITHUB_URL} target="_blank" rel="noopener noreferrer"
          onMouseEnter={() => setHov("gh")} onMouseLeave={() => setHov(null)}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 12, background: A.glass, border: `1px solid ${A.glassBorder}`, color: A.textMid, textDecoration: "none", flexShrink: 0 }}
          aria-label="GitHub"
        >
          <Github size={20} />
        </motion.a>
        <div style={{ width: 4, height: 4, borderRadius: "50%", background: "transparent" }} />
      </div>
    </div>
  );
}

// ── Command palette ────────────────────────────────────────────────────────────

function CommandPalette({ open, onClose, onOpen }: { open: boolean; onClose: () => void; onOpen: (id: WinId) => void }) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { if (open) { setQ(""); setTimeout(() => inputRef.current?.focus(), 50); } }, [open]);

  const items = [
    ...WIN_DEFS.map(d => ({ label: `Open ${d.title}`, icon: d.icon, color: d.color, action: () => onOpen(d.id) })),
    { label: "View GitHub",   icon: <Github size={13} />,   color: A.text,   action: () => window.open(GITHUB_URL, "_blank") },
    { label: "View LinkedIn", icon: <Linkedin size={13} />, color: "#60A5FA",action: () => window.open(LINKED_IN_URL, "_blank") },
    { label: "Send Email",    icon: <Mail size={13} />,     color: A.teal,   action: () => window.open(`mailto:${EMAIL_ADDRESS}`, "_blank") },
  ];
  const filtered = q ? items.filter(i => i.label.toLowerCase().includes(q.toLowerCase())) : items;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div key="ov" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 9500, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }} />
          <motion.div key="pl" initial={{ opacity: 0, scale: 0.96, y: -12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -8 }} transition={{ duration: 0.17 }}
            style={{ position: "fixed", top: "18%", left: "50%", transform: "translateX(-50%)", width: "min(540px,calc(100vw-32px))", background: "rgba(10,15,24,0.97)", border: `1px solid ${A.windowBorder}`, borderRadius: 13, overflow: "hidden", zIndex: 9501, boxShadow: "0 24px 60px rgba(0,0,0,0.75)" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "11px 14px", borderBottom: `1px solid ${A.glassBorder}` }}>
              <Search size={14} color={A.textMuted} />
              <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === "Escape" && onClose()} placeholder="Search commands..."
                style={{ flex: 1, background: "none", border: "none", outline: "none", color: A.text, fontSize: 14 }}
                aria-label="Command search"
              />
              <kbd style={{ fontSize: 10, color: A.textMuted, background: A.glass, border: `1px solid ${A.glassBorder}`, borderRadius: 4, padding: "1px 5px" }}>ESC</kbd>
            </div>
            <div style={{ padding: "5px 6px 6px", maxHeight: 300, overflowY: "auto", scrollbarWidth: "none" }}>
              {filtered.map((item, i) => (
                <button key={i} onClick={() => { item.action(); onClose(); }}
                  style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "8px 9px", borderRadius: 7, border: "none", background: "transparent", color: A.text, fontSize: 13, cursor: "pointer", textAlign: "left", transition: "background 0.1s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = A.glass)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <span style={{ color: item.color }}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
              {!filtered.length && <div style={{ padding: "14px 9px", color: A.textMuted, fontSize: 13 }}>No results found.</div>}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────

const INIT_WINS: Record<WinId, WinState> = {
  about:    { open: true,  minimized: false, maximized: false, zIndex: 20 },
  projects: { open: false, minimized: false, maximized: false, zIndex: 10 },
  terminal: { open: true,  minimized: false, maximized: false, zIndex: 21 },
  skills:   { open: false, minimized: false, maximized: false, zIndex: 10 },
  contact:  { open: false, minimized: false, maximized: false, zIndex: 10 },
};

export function Portfolio2026() {
  useLocaleRefresh();
  const isMobile = useIsMobile();
  const [wins, setWins] = useState<Record<WinId, WinState>>(INIT_WINS);
  const [topZ, setTopZ] = useState(30);
  const [cmdOpen, setCmdOpen] = useState(false);

  const getTopZ = useCallback(() => { setTopZ(z => z + 1); return topZ + 1; }, [topZ]);

  const openWin = useCallback((id: WinId) => {
    const z = topZ + 1;
    setTopZ(z);
    setWins(w => ({ ...w, [id]: { ...w[id], open: true, minimized: false, zIndex: z } }));
  }, [topZ]);

  const closeWin = (id: WinId) => setWins(w => ({ ...w, [id]: { ...w[id], open: false, minimized: false } }));
  const minimizeWin = (id: WinId) => setWins(w => ({ ...w, [id]: { ...w[id], minimized: true } }));
  const maximizeWin = (id: WinId) => setWins(w => ({ ...w, [id]: { ...w[id], maximized: !w[id].maximized } }));
  const focusWin = useCallback((id: WinId) => {
    const z = topZ + 1;
    setTopZ(z);
    setWins(w => ({ ...w, [id]: { ...w[id], zIndex: z } }));
  }, [topZ]);
  const restoreWin = (id: WinId) => openWin(id);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setCmdOpen(v => !v); } };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  // Mobile fallback
  if (isMobile) {
    return (
      <>
        <LiveWallpaper />
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100dvh", padding: "32px 20px", textAlign: "center", gap: 16 }}>
          <div style={{ fontSize: 42, marginBottom: 4 }}>🖥️</div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: A.text }}>Best on Desktop</h1>
          <p style={{ margin: 0, fontSize: 14, color: A.textMid, maxWidth: 280, lineHeight: 1.7 }}>
            The 2026 portfolio is a macOS-inspired interactive desktop experience. Open it on a laptop or desktop for the full experience.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 260, marginTop: 8 }}>
            {[
              { href: GITHUB_URL,    label: "GitHub",   icon: <Github size={14} />,   c: A.text   },
              { href: LINKED_IN_URL, label: "LinkedIn", icon: <Linkedin size={14} />, c: "#60A5FA" },
              { href: `mailto:${EMAIL_ADDRESS}`, label: EMAIL_ADDRESS, icon: <Mail size={14} />, c: A.teal },
            ].map(l => (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: A.glass, border: `1px solid ${A.glassBorder}`, borderRadius: 10, padding: "10px 14px", fontSize: 13, color: l.c, textDecoration: "none" }}>
                {l.icon} {l.label}
              </a>
            ))}
          </div>
        </div>
      </>
    );
  }

  // Desktop icons (right-aligned column)
  const desktopIcons: { def: WinDef; icon: React.ReactNode; iconSize: number }[] = WIN_DEFS.map((d) => ({
    def: d,
    icon: d.id === "about"    ? <User size={26} />
        : d.id === "projects" ? <FolderOpen size={26} />
        : d.id === "terminal" ? <TerminalSquare size={26} />
        : d.id === "skills"   ? <Settings2 size={26} />
        : <Mail size={26} />,
    iconSize: 26,
  }));

  return (
    <>
      {/* Skip link */}
      <a href="#desktop" style={{ position: "fixed", top: -40, left: 16, zIndex: 99999, background: A.teal, color: "#05090E", borderRadius: 6, padding: "5px 12px", fontSize: 13, fontWeight: 600, textDecoration: "none", transition: "top 0.15s" }}
        onFocus={e => (e.currentTarget.style.top = "34px")} onBlur={e => (e.currentTarget.style.top = "-40px")}>
        Skip to content
      </a>

      <LiveWallpaper />

      <div style={{ position: "relative", zIndex: 1, width: "100vw", height: "100dvh", overflow: "hidden" }}>
        <MenuBar onCmdK={() => setCmdOpen(true)} />

        {/* Desktop surface */}
        <main id="desktop" aria-label="Desktop" style={{ position: "absolute", inset: 0, top: 26 }}>

          {/* Desktop icons — right column */}
          <div style={{
            position: "absolute", top: 16, right: 14,
            display: "flex", flexDirection: "column", gap: 4,
            zIndex: 50,
          }}>
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

        <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} onOpen={openWin} />
      </div>
    </>
  );
}
