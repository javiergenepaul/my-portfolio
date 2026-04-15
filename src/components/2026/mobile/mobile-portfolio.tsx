"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  MapPin,
  GithubIcon,
  LinkedinIcon,
  Mail,
  ChevronLeft,
} from "lucide-react";
import { FULL_NAME, JOB_TITLE, EMAIL_ADDRESS } from "@/config";
import { GITHUB_URL, LINKED_IN_URL } from "@/config/url";
import AvatarProfile from "@/assets/avatar-profile.jpg";
import { useMobileAppStore } from "@/stores";
import { WIN_DEFS } from "../constants";
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
import { ChatContent } from "../windows/chat-content";
import { GamesContent } from "../windows/games-content";
import { SnakeContent } from "../windows/snake-content";
import { HanoiContent } from "../windows/hanoi-content";
import { TetrisContent } from "../windows/tetris-content";
import { JumpContent } from "../windows/jump-content";

export function MobilePortfolio() {
  const [activeApp, setActiveApp] = useState<WinId | null>(null);
  const setIsAppOpen = useMobileAppStore((s) => s.setIsAppOpen);
  const time = useMobileTime();

  const [viewportH, setViewportH] = useState(844);
  useEffect(() => {
    const update = () => setViewportH(window.innerHeight);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Signal YearNavigator to hide its pills while a mobile app sheet is open.
  useEffect(() => {
    setIsAppOpen(!!activeApp);
    return () => setIsAppOpen(false);
  }, [activeApp, setIsAppOpen]);
  const compact = viewportH < 750;
  const iconSize = compact ? 50 : 62;
  const dockSize = compact ? 46 : 52;
  const avatarSize = compact ? 56 : 68;
  const gridGap = compact ? 10 : 16;
  const profileMB = compact ? 14 : 26;
  const gridMB = compact ? 14 : 26;

  const visibleApps = WIN_DEFS.filter((d) => !d.hideIcon);
  const dockApps = visibleApps.slice(0, 4);
  const activeDef = WIN_DEFS.find((d) => d.id === activeApp);

  return (
    <div className="font-mac relative overflow-hidden w-screen h-dvh">
      <LiveWallpaper />

      {/* Home screen */}
      <div className="absolute inset-0 flex flex-col z-2">
        {/* Status bar */}
        <div
          className="shrink-0 flex items-center justify-between h-12 px-5.5"
          style={{
            background: "rgba(0,0,0,0.18)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          <span className="text-a26-text text-[15px] font-semibold min-w-15">
            {time}
          </span>
          <div className="flex items-center gap-1.75">
            <div className="flex items-end gap-0.5">
              {[7, 10, 13, 16].map((h, i) => (
                <div
                  key={i}
                  style={{
                    width: 3,
                    height: h,
                    borderRadius: 1.5,
                    background:
                      i < 3 ? "var(--a26-text)" : "rgba(255,255,255,0.3)",
                  }}
                />
              ))}
            </div>
            <svg
              width="16"
              height="12"
              viewBox="0 0 16 12"
              fill="none"
              style={{ overflow: "visible" }}
            >
              <circle cx="8" cy="11" r="1.5" fill="var(--a26-text)" />
              <path
                d="M4.8 7.6 A4.5 4.5 0 0 1 11.2 7.6"
                stroke="var(--a26-text)"
                strokeWidth="1.4"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M2.2 5 A8 8 0 0 1 13.8 5"
                stroke="var(--a26-text)"
                strokeWidth="1.4"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <div className="flex items-center gap-px">
              <div
                className="flex items-stretch p-px rounded-[3px]"
                style={{
                  width: 22,
                  height: 12,
                  border: "1.5px solid rgba(255,255,255,0.7)",
                }}
              >
                <div
                  className="bg-a26-green rounded-[1.5px]"
                  style={{ width: "75%" }}
                />
              </div>
              <div
                className="rounded-[1px]"
                style={{
                  width: 2,
                  height: 6,
                  background: "rgba(255,255,255,0.5)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Scrollable body */}
        <div
          className="flex-1 overflow-y-auto overflow-x-hidden [scrollbar-width:none]"
          style={{ padding: `${compact ? 16 : 24}px 24px 100px` }}
        >
          {/* Profile header */}
          <div className="text-center" style={{ marginBottom: profileMB }}>
            <div
              className="overflow-hidden border-[2.5px] border-a26-teal"
              style={{
                width: avatarSize,
                height: avatarSize,
                borderRadius: "50%",
                boxShadow:
                  "0 0 24px color-mix(in srgb, var(--a26-teal) 35%, transparent)",
                margin: "0 auto 10px",
              }}
            >
              <Image
                src={AvatarProfile}
                alt={FULL_NAME}
                width={72}
                height={72}
                className="object-cover w-full h-full"
              />
            </div>
            <h1 className="text-a26-text m-0 text-[20px] font-bold tracking-[-0.01em]">
              {FULL_NAME}
            </h1>
            <p className="text-a26-teal m-0 mt-1 text-[13px] font-medium">
              {JOB_TITLE}
            </p>
            <p className="text-a26-muted flex items-center justify-center m-0 mt-1 text-xs gap-1">
              <MapPin size={11} color="var(--a26-text-muted)" /> Cebu,
              Philippines
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
            {visibleApps.map((app) => (
              <motion.button
                key={app.id}
                whileTap={{ scale: 0.88 }}
                onClick={() => setActiveApp(app.id)}
                className="font-mac flex flex-col items-center gap-1.75 bg-transparent border-none p-1 cursor-pointer"
              >
                <MacAppIcon id={app.id} size={iconSize} />
                <span
                  className="text-a26-text text-[11px] font-medium"
                  style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}
                >
                  {app.title}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Social links row */}
          <div className="flex justify-center gap-3">
            {[
              {
                href: GITHUB_URL,
                icon: <GithubIcon size={17} />,
                color: "var(--a26-text)",
                label: "GitHub",
              },
              {
                href: LINKED_IN_URL,
                icon: <LinkedinIcon size={17} />,
                color: "#60A5FA",
                label: "LinkedIn",
              },
              {
                href: `mailto:${EMAIL_ADDRESS}`,
                icon: <Mail size={17} />,
                color: "var(--a26-teal)",
                label: "Email",
              },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center bg-a26-glass border border-a26-glass-border no-underline gap-1.25 w-17 py-2.5 rounded-2xl"
                style={{ color: l.color }}
              >
                {l.icon}
                <span className="text-a26-mid text-[10px]">{l.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom dock */}
        <div
          className="absolute bg-a26-dock border border-a26-dock-border flex justify-around items-center rounded-[26px] py-2.5 px-5 z-50"
          style={{
            bottom: 16,
            left: 20,
            right: 20,
            backdropFilter: "blur(32px) saturate(1.5)",
            WebkitBackdropFilter: "blur(32px) saturate(1.5)",
            boxShadow:
              "0 10px 36px rgba(0,0,0,0.60), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          {dockApps.map((app) => (
            <motion.button
              key={app.id}
              whileTap={{ scale: 0.88 }}
              onClick={() => setActiveApp(app.id)}
              className="bg-transparent border-none p-0 cursor-pointer"
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
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 36,
              mass: 0.9,
            }}
            className="font-mac absolute inset-0 flex flex-col z-200"
            style={{
              background: "var(--a26-window)",
              backdropFilter: "blur(32px) saturate(1.3)",
              WebkitBackdropFilter: "blur(32px) saturate(1.3)",
            }}
          >
            {/* iOS navigation bar */}
            <div className="shrink-0 flex items-center border-b bg-a26-title-bar border-a26-glass-border h-13.5 px-4">
              <button
                onClick={() => setActiveApp(null)}
                className="font-mac flex items-center gap-0.75 bg-transparent border-none cursor-pointer text-[15px] py-1 px-0 min-w-17.5"
                style={{ color: activeDef?.color ?? "var(--a26-teal)" }}
              >
                <ChevronLeft size={20} />
                <span>Home</span>
              </button>
              <div className="flex-1 flex items-center justify-center gap-2">
                {activeApp && <MacAppIcon id={activeApp} size={26} />}
                <span className="text-a26-text text-[14px] font-semibold">
                  {activeDef?.title}
                </span>
              </div>
              <div className="min-w-17.5" />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {activeApp === "about" && <AboutContent />}
              {activeApp === "projects" && <ProjectsContent />}
              {activeApp === "terminal" && (
                <TerminalContent
                  onOpen={(id) => setActiveApp(id)}
                  onClose={() => setActiveApp(null)}
                />
              )}
              {activeApp === "skills" && <SkillsContent />}
              {activeApp === "contact" && <ContactContent />}
              {activeApp === "resume" && <ResumeContent />}
              {activeApp === "settings" && <SettingsContent />}
              {activeApp === "chat" && <ChatContent />}
              {activeApp === "games" && (
                <GamesContent onOpen={(id) => setActiveApp(id)} />
              )}
              {activeApp === "snake" && <SnakeContent />}
              {activeApp === "hanoi" && <HanoiContent />}
              {activeApp === "tetris" && <TetrisContent />}
              {activeApp === "jump" && <JumpContent />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
