"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { MapPin, GithubIcon, LinkedinIcon, Mail, ChevronLeft } from "lucide-react";
import { FULL_NAME, JOB_TITLE, EMAIL_ADDRESS } from "@/config";
import { GITHUB_URL, LINKED_IN_URL } from "@/config/url";
import AvatarProfile from "@/assets/avatar-profile.jpg";
import { WIN_DEFS } from "../constants";
import { useIsDark } from "../use-aurora";
import type { WinId } from "../constants";
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
  const isDark = useIsDark();
  const [activeApp, setActiveApp] = useState<WinId | null>(null);
  const time = useMobileTime();

  const [viewportH, setViewportH] = useState(844);
  useEffect(() => {
    const update = () => setViewportH(window.innerHeight);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  const compact = viewportH < 750;
  const iconSize   = compact ? 50 : 62;
  const dockSize   = compact ? 46 : 52;
  const avatarSize = compact ? 56 : 68;
  const gridGap    = compact ? 10 : 16;
  const profileMB  = compact ? 14 : 26;
  const gridMB     = compact ? 14 : 26;

  const dockApps = WIN_DEFS.slice(0, 4);
  const activeDef = WIN_DEFS.find((d) => d.id === activeApp);

  return (
    <div
      className="font-mac relative overflow-hidden"
      style={{ width: "100vw", height: "100dvh" }}
    >
      <LiveWallpaper />

      {/* Home screen */}
      <div className="absolute inset-0 flex flex-col" style={{ zIndex: 2 }}>
        {/* Status bar */}
        <div
          className="shrink-0 flex items-center justify-between"
          style={{
            height: 48,
            padding: "0 22px",
            background: "rgba(0,0,0,0.18)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          <span className="text-a26-text" style={{ fontSize: 15, fontWeight: 600, minWidth: 60 }}>
            {time}
          </span>
          <div className="flex items-center" style={{ gap: 7 }}>
            <div className="flex items-end" style={{ gap: 2 }}>
              {[7, 10, 13, 16].map((h, i) => (
                <div
                  key={i}
                  style={{
                    width: 3, height: h, borderRadius: 1.5,
                    background: i < 3 ? "var(--a26-text)" : "rgba(255,255,255,0.3)",
                  }}
                />
              ))}
            </div>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" style={{ overflow: "visible" }}>
              <circle cx="8" cy="11" r="1.5" fill="var(--a26-text)" />
              <path d="M4.8 7.6 A4.5 4.5 0 0 1 11.2 7.6" stroke="var(--a26-text)" strokeWidth="1.4" strokeLinecap="round" fill="none" />
              <path d="M2.2 5 A8 8 0 0 1 13.8 5" stroke="var(--a26-text)" strokeWidth="1.4" strokeLinecap="round" fill="none" />
            </svg>
            <div className="flex items-center" style={{ gap: 1 }}>
              <div
                style={{
                  width: 22, height: 12, borderRadius: 3,
                  border: "1.5px solid rgba(255,255,255,0.7)",
                  padding: 1.5, display: "flex", alignItems: "stretch",
                }}
              >
                <div className="bg-a26-green" style={{ width: "75%", borderRadius: 1.5 }} />
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
            padding: `${compact ? 16 : 24}px 24px 100px`,
            scrollbarWidth: "none",
          }}
        >
          {/* Profile header */}
          <div className="text-center" style={{ marginBottom: profileMB }}>
            <div
              className="overflow-hidden border-[2.5px] border-a26-teal"
              style={{
                width: avatarSize, height: avatarSize, borderRadius: "50%",
                boxShadow: "0 0 24px color-mix(in srgb, var(--a26-teal) 35%, transparent)",
                margin: "0 auto 10px",
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
            <h1 className="text-a26-text" style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: "-0.01em" }}>
              {FULL_NAME}
            </h1>
            <p className="text-a26-teal" style={{ margin: "4px 0 0", fontSize: 13, fontWeight: 500 }}>
              {JOB_TITLE}
            </p>
            <p className="text-a26-muted flex items-center justify-center" style={{ margin: "4px 0 0", fontSize: 12, gap: 4 }}>
              <MapPin size={11} color="var(--a26-text-muted)" /> Cebu, Philippines
            </p>
          </div>

          {/* App icon grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: gridGap,
              maxWidth: 320,
              margin: `0 auto ${gridMB}px`,
            }}
          >
            {WIN_DEFS.map((app) => (
              <motion.button
                key={app.id}
                whileTap={{ scale: 0.88 }}
                onClick={() => setActiveApp(app.id)}
                className="font-mac flex flex-col items-center"
                style={{ gap: 7, background: "none", border: "none", padding: 4, cursor: "pointer" }}
              >
                <MacAppIcon id={app.id} size={iconSize} />
                <span
                  className="text-a26-text"
                  style={{ fontSize: 11, fontWeight: 500, textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}
                >
                  {app.title}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Social links row */}
          <div className="flex justify-center" style={{ gap: 12 }}>
            {[
              { href: GITHUB_URL, icon: <GithubIcon size={17} />, color: "var(--a26-text)", label: "GitHub" },
              { href: LINKED_IN_URL, icon: <LinkedinIcon size={17} />, color: "#60A5FA", label: "LinkedIn" },
              { href: `mailto:${EMAIL_ADDRESS}`, icon: <Mail size={17} />, color: "var(--a26-teal)", label: "Email" },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center bg-a26-glass border border-a26-glass-border no-underline"
                style={{ gap: 5, width: 68, padding: "10px 0", borderRadius: 16, color: l.color }}
              >
                {l.icon}
                <span className="text-a26-mid" style={{ fontSize: 10 }}>{l.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom dock */}
        <div
          className="absolute bg-a26-dock border border-a26-dock-border flex justify-around items-center"
          style={{
            bottom: 16,
            left: 20,
            right: 20,
            borderRadius: 26,
            padding: "10px 20px",
            backdropFilter: "blur(32px) saturate(1.5)",
            WebkitBackdropFilter: "blur(32px) saturate(1.5)",
            boxShadow: "0 10px 36px rgba(0,0,0,0.60), inset 0 1px 0 rgba(255,255,255,0.06)",
            zIndex: 50,
          }}
        >
          {dockApps.map((app) => (
            <motion.button
              key={app.id}
              whileTap={{ scale: 0.88 }}
              onClick={() => setActiveApp(app.id)}
              style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
              aria-label={app.title}
            >
              <MacAppIcon id={app.id} size={dockSize} />
            </motion.button>
          ))}
        </div>
      </div>

      {/* App sheet — slides up */}
      <AnimatePresence>
        {activeApp && (
          <motion.div
            key={activeApp}
            initial={{ y: "100%", opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0.6 }}
            transition={{ type: "spring", stiffness: 380, damping: 36, mass: 0.9 }}
            className="font-mac absolute inset-0 flex flex-col"
            style={{
              zIndex: 200,
              background: "var(--a26-window)",
              backdropFilter: "blur(32px) saturate(1.3)",
              WebkitBackdropFilter: "blur(32px) saturate(1.3)",
            }}
          >
            {/* iOS navigation bar */}
            <div
              className="shrink-0 flex items-center border-b bg-a26-title-bar border-a26-glass-border"
              style={{ height: 54, padding: "0 16px" }}
            >
              <button
                onClick={() => setActiveApp(null)}
                className="font-mac flex items-center"
                style={{
                  gap: 3,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: activeDef?.color ?? "var(--a26-teal)",
                  fontSize: 15,
                  padding: "4px 0",
                  minWidth: 70,
                }}
              >
                <ChevronLeft size={20} />
                <span>Home</span>
              </button>
              <div className="flex-1 flex items-center justify-center" style={{ gap: 8 }}>
                {activeApp && <MacAppIcon id={activeApp} size={26} />}
                <span className="text-a26-text" style={{ fontSize: 14, fontWeight: 600 }}>
                  {activeDef?.title}
                </span>
              </div>
              <div style={{ minWidth: 70 }} />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {activeApp === "about"    && <AboutContent />}
              {activeApp === "projects" && <ProjectsContent />}
              {activeApp === "terminal" && (
                <TerminalContent
                  onOpen={(id) => setActiveApp(id)}
                  onClose={() => setActiveApp(null)}
                />
              )}
              {activeApp === "skills"   && <SkillsContent />}
              {activeApp === "contact"  && <ContactContent />}
              {activeApp === "resume"   && <ResumeContent />}
              {activeApp === "settings" && <SettingsContent />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
