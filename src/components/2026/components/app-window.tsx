"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, AnimatePresence } from "framer-motion";
import type { PanInfo } from "framer-motion";
import { A, MAC_FONT } from "../constants";
import type { WinId, WinDef, WinState } from "../constants";
import { TrafficLights } from "./traffic-lights";
import { AboutContent } from "../windows/about-content";
import { ProjectsContent } from "../windows/projects-content";
import { TerminalContent } from "../windows/terminal-content";
import { SkillsContent } from "../windows/skills-content";
import { ContactContent } from "../windows/contact-content";
import { ResumeContent } from "../windows/resume-content";
import { SettingsContent } from "../windows/settings-content";

// Resize handle edges: n/e/s/w edges + ne/se/sw/nw corners
export const RESIZE_HANDLES = [
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

export function AppWindow({
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
        {def.id === "settings" && <SettingsContent />}
      </div>
    </motion.div>
  );
}
