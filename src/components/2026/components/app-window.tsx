"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue } from "framer-motion";
import type { PanInfo } from "framer-motion";
import type { WinId, WinDef, WinState } from "../constants";
import { translate, useLocaleRefresh } from "@/i18n";
import { TrafficLights } from "./traffic-lights";
import { AboutContent } from "../windows/about-content";
import { BooksContent } from "../windows/books-content";
import { TestimonialsContent } from "../windows/testimonials-content";
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
import { BomberContent } from "../windows/bomber-content";

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
  useLocaleRefresh();
  const resolvePos = (vw: number) =>
    typeof def.defaultPos === "function" ? def.defaultPos(vw) : def.defaultPos;
  const initPos = resolvePos(1440);
  const x = useMotionValue(initPos.x);
  const y = useMotionValue(initPos.y);

  useEffect(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    if (typeof def.defaultPos === "function") {
      const p = def.defaultPos(vw);
      x.set(p.x);
      y.set(p.y);
    }
    const maxW = Math.floor(vw * 0.88);
    const maxH = Math.floor(vh - 120);
    const clampedW = Math.min(def.defaultSize.w, maxW);
    const clampedH = Math.min(def.defaultSize.h, maxH);
    if (clampedW !== def.defaultSize.w || clampedH !== def.defaultSize.h) {
      setSize({ w: clampedW, h: clampedH });
    }
    const curX = x.get();
    const curY = y.get();
    if (curX + clampedW > vw - 10) x.set(Math.max(0, vw - clampedW - 10));
    if (curY + clampedH > vh - 80) y.set(Math.max(28, vh - clampedH - 90));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        background: "var(--a26-window)",
        border: "1px solid var(--a26-window-border)",
        backdropFilter: "blur(32px) saturate(1.3)",
        WebkitBackdropFilter: "blur(32px) saturate(1.3)",
        boxShadow:
          "0 32px 80px rgba(0,0,0,0.70), 0 0 0 0.5px rgba(255,255,255,0.04)",
        overflow: "hidden",
        fontFamily: "var(--font-mac)",
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
      {/* Resize handles */}
      {!state.maximized &&
        RESIZE_HANDLES.map(({ edge, cursor, style }) => (
          <div
            key={edge}
            onMouseDown={(e) => startResize(e, edge)}
            style={{ position: "absolute", zIndex: 100, cursor, ...style }}
          />
        ))}

      {/* Title bar */}
      <motion.div
        onPan={handlePan}
        onDoubleClick={onMaximize}
        className="shrink-0 flex items-center px-3.5 gap-2.5 select-none"
        style={{
          height: 40,
          background: "var(--a26-title-bar)",
          borderBottom: "1px solid var(--a26-title-border)",
          cursor: state.maximized ? "default" : "move",
        }}
      >
        <TrafficLights
          onClose={onClose}
          onMinimize={onMinimize}
          onMaximize={onMaximize}
        />
        <div className="flex-1 flex items-center justify-center gap-1.5">
          <span style={{ color: def.color, opacity: 0.85 }}>{def.icon}</span>
          <span className="text-a26-mid text-[13px] font-medium tracking-[0.01em]">
            {translate(`win26.windows.${def.id}` as any) || def.title}
          </span>
        </div>
      </motion.div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        {def.id === "about" && <AboutContent />}
        {def.id === "books" && <BooksContent />}
        {def.id === "testimonials" && <TestimonialsContent />}
        {def.id === "projects" && <ProjectsContent />}
        {def.id === "terminal" && (
          <TerminalContent onOpen={onOpen} onClose={onClose} />
        )}
        {def.id === "skills" && <SkillsContent />}
        {def.id === "contact" && <ContactContent />}
        {def.id === "resume" && <ResumeContent />}
        {def.id === "settings" && <SettingsContent />}
        {def.id === "chat" && <ChatContent />}
        {def.id === "games" && <GamesContent onOpen={onOpen} />}
        {def.id === "snake" && <SnakeContent />}
        {def.id === "hanoi" && <HanoiContent />}
        {def.id === "tetris" && <TetrisContent />}
        {def.id === "jump" && <JumpContent />}
        {def.id === "bomber" && <BomberContent />}
      </div>
    </motion.div>
  );
}
