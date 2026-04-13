"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { MapPin, GithubIcon, LinkedinIcon, Mail, ChevronLeft } from "lucide-react";
import { FULL_NAME, JOB_TITLE, EMAIL_ADDRESS } from "@/config";
import { GITHUB_URL, LINKED_IN_URL } from "@/config/url";
import AvatarProfile from "@/assets/avatar-profile.jpg";
import { MAC_FONT, WIN_DEFS } from "../constants";
import { useAurora } from "../use-aurora";
import type { WinId } from "../constants";
import { hexRgb } from "../utils";
import { useMobileTime } from "../hooks";
import { LiveWallpaper } from "../live-wallpaper";
import { MacAppIcon } from "../components/mac-app-icons";
import { AboutContent } from "../windows/about-content";
import { ProjectsContent } from "../windows/projects-content";
import { TerminalContent } from "../windows/terminal-content";
import { SkillsContent } from "../windows/skills-content";
import { ContactContent } from "../windows/contact-content";
import { ResumeContent } from "../windows/resume-content";
import { SettingsContent } from "../windows/settings-content";

export function MobilePortfolio() {
  const A = useAurora();
  const [activeApp, setActiveApp] = useState<WinId | null>(null);
  const time = useMobileTime();

  const dockApps = WIN_DEFS.slice(0, 4);
  const activeDef = WIN_DEFS.find((d) => d.id === activeApp);

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100dvh",
        overflow: "hidden",
        fontFamily: MAC_FONT,
      }}
    >
      <LiveWallpaper />

      {/* ── Home screen ── */}
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
            style={{ fontSize: 15, fontWeight: 600, color: A.text, minWidth: 60 }}
          >
            {time}
          </span>
          {/* Signal + WiFi + Battery */}
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
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
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" style={{ overflow: "visible" }}>
              <circle cx="8" cy="11" r="1.5" fill={A.text} />
              <path d="M4.8 7.6 A4.5 4.5 0 0 1 11.2 7.6" stroke={A.text} strokeWidth="1.4" strokeLinecap="round" fill="none" />
              <path d="M2.2 5 A8 8 0 0 1 13.8 5" stroke={A.text} strokeWidth="1.4" strokeLinecap="round" fill="none" />
            </svg>
            <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
              <div
                style={{
                  width: 22, height: 12, borderRadius: 3,
                  border: "1.5px solid rgba(255,255,255,0.7)",
                  padding: 1.5, display: "flex", alignItems: "stretch",
                }}
              >
                <div style={{ width: "75%", borderRadius: 1.5, background: A.green }} />
              </div>
              <div style={{ width: 2, height: 6, borderRadius: 1, background: "rgba(255,255,255,0.5)" }} />
            </div>
          </div>
        </div>

        {/* Scrollable body */}
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
                width: 72, height: 72, borderRadius: "50%", overflow: "hidden",
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
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: A.text, letterSpacing: "-0.01em" }}>
              {FULL_NAME}
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: A.teal, fontWeight: 500 }}>
              {JOB_TITLE}
            </p>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: A.textMuted, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
              <MapPin size={11} color={A.textMuted} /> Cebu, Philippines
            </p>
          </div>

          {/* App icon grid — 3 columns */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
              maxWidth: 320,
              margin: "0 auto 32px",
            }}
          >
            {WIN_DEFS.map((app) => (
              <motion.button
                key={app.id}
                whileTap={{ scale: 0.88 }}
                onClick={() => setActiveApp(app.id)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 7,
                  background: "none",
                  border: "none",
                  padding: 4,
                  cursor: "pointer",
                  fontFamily: MAC_FONT,
                }}
              >
                <MacAppIcon id={app.id} size={68} />
                <span
                  style={{
                    fontSize: 11,
                    color: A.text,
                    fontWeight: 500,
                    textShadow: "0 1px 4px rgba(0,0,0,0.9)",
                  }}
                >
                  {app.title}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Social links row */}
          <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            {[
              { href: GITHUB_URL, icon: <GithubIcon size={17} />, color: A.text, label: "GitHub" },
              { href: LINKED_IN_URL, icon: <LinkedinIcon size={17} />, color: "#60A5FA", label: "LinkedIn" },
              { href: `mailto:${EMAIL_ADDRESS}`, icon: <Mail size={17} />, color: A.teal, label: "Email" },
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
                <span style={{ fontSize: 10, color: A.textMid }}>{l.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom dock */}
        <div
          style={{
            position: "absolute",
            bottom: 16,
            left: 20,
            right: 20,
            background: A.dock,
            border: `1px solid ${A.dockBorder}`,
            borderRadius: 26,
            padding: "10px 20px",
            backdropFilter: "blur(32px) saturate(1.5)",
            WebkitBackdropFilter: "blur(32px) saturate(1.5)",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            boxShadow: "0 10px 36px rgba(0,0,0,0.60), inset 0 1px 0 rgba(255,255,255,0.06)",
            zIndex: 50,
          }}
        >
          {dockApps.map((app) => (
            <motion.button
              key={app.id}
              whileTap={{ scale: 0.88 }}
              onClick={() => setActiveApp(app.id)}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
              aria-label={app.title}
            >
              <MacAppIcon id={app.id} size={52} />
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── App sheet — slides up ── */}
      <AnimatePresence>
        {activeApp && (
          <motion.div
            key={activeApp}
            initial={{ y: "100%", opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0.6 }}
            transition={{ type: "spring", stiffness: 380, damping: 36, mass: 0.9 }}
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
                  gap: 8,
                }}
              >
                {activeApp && <MacAppIcon id={activeApp} size={26} />}
                <span style={{ fontSize: 14, fontWeight: 600, color: A.text }}>
                  {activeDef?.title}
                </span>
              </div>
              <div style={{ minWidth: 70 }} />
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflow: "hidden" }}>
              {activeApp === "about" && <AboutContent />}
              {activeApp === "projects" && <ProjectsContent />}
              {activeApp === "terminal" && (
                <TerminalContent onOpen={(id) => setActiveApp(id)} />
              )}
              {activeApp === "skills" && <SkillsContent />}
              {activeApp === "contact" && <ContactContent />}
              {activeApp === "resume" && <ResumeContent />}
              {activeApp === "settings" && <SettingsContent />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
