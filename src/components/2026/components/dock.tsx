"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GITHUB_URL } from "@/config/url";
import { WIN_DEFS } from "../constants";
import type { WinId, WinState } from "../constants";
import { MacAppIcon } from "./mac-app-icons";
import { translate, useLocaleRefresh } from "@/i18n";

export function Dock({
  windows,
  onOpen,
  onRestore,
}: {
  windows: Record<WinId, WinState>;
  onOpen: (id: WinId) => void;
  onRestore: (id: WinId) => void;
}) {
  useLocaleRefresh();
  const [hov, setHov] = useState<string | null>(null);

  const dockApps = WIN_DEFS.filter((d) => !d.hideIcon).map((d) => ({
    ...d,
    isOpen: windows[d.id].open,
    isMinimized: windows[d.id].minimized,
  }));

  const getSize = (id: string) => {
    if (hov === id) return 64;
    if (hov) {
      const hi = dockApps.findIndex((a) => a.id === hov);
      const ci = dockApps.findIndex((a) => a.id === id);
      if (Math.abs(hi - ci) === 1) return 54;
    }
    return 46;
  };

  const tooltipCls =
    "font-mac absolute pointer-events-none whitespace-nowrap rounded-[7px] py-1 px-[9px] text-xs text-a26-text backdrop-blur-[12px]";
  const tooltipStyle = {
    bottom: "calc(100% + 10px)",
    background: "rgba(28,28,28,0.94)",
    border: "1px solid rgba(255,255,255,0.10)",
    boxShadow: "0 4px 14px rgba(0,0,0,0.50)",
  };

  return (
    <div
      className="font-mac fixed bottom-2.5 left-1/2 -translate-x-1/2 z-8000 flex items-end gap-2 bg-a26-dock border border-a26-dock-border rounded-[22px] py-2 px-3.5 backdrop-blur-[32px] backdrop-saturate-150"
      style={{
        boxShadow:
          "0 10px 36px rgba(0,0,0,0.60), inset 0 1px 0 rgba(255,255,255,0.06)",
        WebkitBackdropFilter: "blur(32px) saturate(1.5)",
      }}
    >
      {dockApps.map((app) => {
        const size = getSize(app.id);
        const isHov = hov === app.id;
        return (
          <div
            key={app.id}
            className="flex flex-col items-center relative gap-1"
          >
            {/* Hover label */}
            <AnimatePresence>
              {isHov && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.11 }}
                  className={tooltipCls}
                  style={tooltipStyle}
                >
                  {translate(`win26.windows.${app.id}` as any) || app.title}
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
              className="relative flex items-center justify-center shrink-0 cursor-pointer border-none p-0"
              style={{
                background: "none",
                filter: app.isOpen
                  ? "drop-shadow(0 0 6px rgba(255,255,255,0.18))"
                  : "none",
                opacity: app.isMinimized ? 0.65 : 1,
                transition: "opacity 0.15s, filter 0.15s",
              }}
              aria-label={`${app.title}${app.isMinimized ? " (minimized)" : ""}`}
            >
              {app.isMinimized && (
                <div
                  className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full z-2"
                  style={{
                    background: "#FFBD2E",
                    boxShadow: "0 0 4px rgba(255,189,46,0.6)",
                  }}
                />
              )}
              <MacAppIcon id={app.id} size={size} />
            </motion.button>

            {/* Running dot */}
            <div
              className="w-1 h-1 rounded-full shrink-0 transition-[background] duration-150"
              style={{
                background:
                  app.isOpen && !app.isMinimized
                    ? "rgba(255,255,255,0.80)"
                    : "transparent",
              }}
            />
          </div>
        );
      })}

      {/* Separator */}
      <div className="bg-a26-glass-border w-px h-8.5 mx-1 self-center mb-2" />

      {/* GitHub */}
      <div className="flex flex-col items-center relative gap-1">
        <AnimatePresence>
          {hov === "gh" && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.11 }}
              className={tooltipCls}
              style={tooltipStyle}
            >
              GitHub
            </motion.div>
          )}
        </AnimatePresence>
        <motion.a
          animate={{ width: 46, height: 46 }}
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHov("gh")}
          onMouseLeave={() => setHov(null)}
          className="flex items-center justify-center shrink-0 no-underline"
          aria-label="GitHub"
        >
          <MacAppIcon id="github" size={46} />
        </motion.a>
        <div
          className="w-1 h-1 rounded-full"
          style={{ background: "transparent" }}
        />
      </div>
    </div>
  );
}
