"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GITHUB_URL } from "@/config/url";
import { MAC_FONT, WIN_DEFS } from "../constants";
import { useAurora } from "../use-aurora";
import type { WinId, WinState } from "../constants";
import { MacAppIcon } from "./mac-app-icons";

export function Dock({
  windows,
  onOpen,
  onRestore,
}: {
  windows: Record<WinId, WinState>;
  onOpen: (id: WinId) => void;
  onRestore: (id: WinId) => void;
}) {
  const A = useAurora();
  const [hov, setHov] = useState<string | null>(null);

  const dockApps = WIN_DEFS.map((d) => ({
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
        borderRadius: 22,
        padding: "8px 14px",
        backdropFilter: "blur(32px) saturate(1.5)",
        WebkitBackdropFilter: "blur(32px) saturate(1.5)",
        display: "flex",
        gap: 8,
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
            {/* Hover label */}
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
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
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
                  style={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#FFBD2E",
                    zIndex: 2,
                    boxShadow: "0 0 4px rgba(255,189,46,0.6)",
                  }}
                />
              )}
              <MacAppIcon id={app.id} size={size} />
            </motion.button>

            {/* Running dot */}
            <div
              style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background:
                  app.isOpen && !app.isMinimized
                    ? "rgba(255,255,255,0.80)"
                    : "transparent",
                transition: "background 0.15s",
                flexShrink: 0,
              }}
            />
          </div>
        );
      })}

      {/* Separator */}
      <div
        style={{
          width: 1,
          height: 34,
          background: A.glassBorder,
          margin: "0 4px 8px",
          alignSelf: "center",
        }}
      />

      {/* GitHub */}
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
          animate={{ width: 46, height: 46 }}
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHov("gh")}
          onMouseLeave={() => setHov(null)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
            flexShrink: 0,
          }}
          aria-label="GitHub"
        >
          <MacAppIcon id="github" size={46} />
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
