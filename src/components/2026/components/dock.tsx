"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github } from "lucide-react";
import { GITHUB_URL } from "@/config/url";
import { A, MAC_FONT, WIN_DEFS } from "../constants";
import type { WinId, WinState } from "../constants";
import { hexRgb } from "../utils";

export function Dock({
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
