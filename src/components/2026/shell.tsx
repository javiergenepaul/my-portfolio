"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  FolderOpen,
  TerminalSquare,
  Mail,
  Settings2,
  User,
  FileText,
} from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useLocaleRefresh } from "@/i18n";
import { A, MAC_FONT, WIN_DEFS } from "./constants";
import type { WinId, WinState } from "./constants";
import { useIsMobile } from "./hooks";
import { MenuBar } from "./components/menu-bar";
import { DesktopIcon } from "./components/desktop-icon";
import { AppWindow } from "./components/app-window";
import { Dock } from "./components/dock";
import { CommandPalette } from "./components/command-palette";
import { MobilePortfolio } from "./mobile/mobile-portfolio";

const LiveWallpaper = dynamic(
  () => import("./live-wallpaper").then((m) => ({ default: m.LiveWallpaper })),
  { ssr: false },
);

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
