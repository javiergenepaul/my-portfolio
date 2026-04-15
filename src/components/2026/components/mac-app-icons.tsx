"use client";

import React from "react";
import type { WinId } from "../constants";

export type AppIconId = WinId | "github";

// ── Shell ─────────────────────────────────────────────────────────────────────
// Squircle container matching macOS app icon design language:
// - Gradient fill (opaque, no glass)
// - Top-gloss highlight
// - Outer shadow

function IconShell({
  size,
  g1,
  g2,
  shadow,
  children,
}: {
  size: number;
  g1: string;
  g2: string;
  shadow?: string;
  children: React.ReactNode;
}) {
  const r = Math.round(size * 0.225); // macOS squircle ≈ 22.5%
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: r,
        background: `linear-gradient(160deg, ${g1} 0%, ${g2} 100%)`,
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: shadow
          ? shadow
          : `0 ${Math.round(size * 0.05)}px ${Math.round(size * 0.18)}px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.22)`,
      }}
    >
      {/* Top gloss */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "46%",
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.26) 0%, rgba(255,255,255,0) 100%)",
          borderRadius: `${r}px ${r}px 55% 55%`,
          pointerEvents: "none",
          zIndex: 10,
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}

// ── Icon art ──────────────────────────────────────────────────────────────────

// About — Safari-style compass (blue)
function AboutArt({ s }: { s: number }) {
  const p = s * 0.64;
  const ticks = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * 45 * Math.PI) / 180;
    const isCardinal = i % 2 === 0;
    const inner = isCardinal ? 20 : 22;
    const outer = 27;
    const x1 = 40 + inner * Math.sin(angle);
    const y1 = 40 - inner * Math.cos(angle);
    const x2 = 40 + outer * Math.sin(angle);
    const y2 = 40 - outer * Math.cos(angle);
    return { x1, y1, x2, y2, isCardinal };
  });
  return (
    <svg width={p} height={p} viewBox="0 0 80 80" fill="none">
      {/* Compass ring */}
      <circle
        cx="40"
        cy="40"
        r="30"
        stroke="white"
        strokeWidth="1.8"
        opacity="0.9"
      />
      {/* Inner face glow */}
      <circle cx="40" cy="40" r="28" fill="rgba(255,255,255,0.07)" />
      {/* Tick marks */}
      {ticks.map((t, i) => (
        <line
          key={i}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke="white"
          strokeWidth={t.isCardinal ? 2.4 : 1.4}
          strokeLinecap="round"
          opacity={t.isCardinal ? 0.95 : 0.65}
        />
      ))}
      {/* Compass needle — rotated 45° so red tip points NE (like Safari) */}
      <g transform="rotate(45, 40, 40)">
        {/* Red/orange half — pointing North → NE after rotate */}
        <polygon points="40,14 33,40 47,40" fill="#FF3B2F" opacity="0.95" />
        {/* White half — pointing South → SW after rotate */}
        <polygon points="40,66 33,40 47,40" fill="white" opacity="0.88" />
      </g>
      {/* Center pin */}
      <circle cx="40" cy="40" r="3" fill="white" opacity="0.95" />
      <circle cx="40" cy="40" r="1.5" fill="rgba(0,90,200,0.6)" />
    </svg>
  );
}

// Projects — Finder-style folder (blue)
function ProjectsArt({ s }: { s: number }) {
  const p = s * 0.62;
  return (
    <svg width={p} height={p} viewBox="0 0 80 80" fill="none">
      {/* Folder tab */}
      <path
        d="M 7 33 L 7 27 Q 7 21 13 21 L 30 21 Q 35 21 37 25 L 40 33 Z"
        fill="white"
        opacity="0.82"
      />
      {/* Folder body */}
      <rect
        x="7"
        y="33"
        width="66"
        height="38"
        rx="7"
        fill="white"
        opacity="0.95"
      />
      {/* Inner lines — code hint */}
      <rect
        x="17"
        y="45"
        width="24"
        height="4"
        rx="2"
        fill="rgba(20,110,255,0.28)"
      />
      <rect
        x="17"
        y="54"
        width="38"
        height="4"
        rx="2"
        fill="rgba(20,110,255,0.20)"
      />
      <rect
        x="17"
        y="63"
        width="30"
        height="4"
        rx="2"
        fill="rgba(20,110,255,0.20)"
      />
    </svg>
  );
}

// Terminal — Terminal.app (near-black bg with colored title dots + prompt)
function TerminalArt({ s }: { s: number }) {
  const p = s * 0.66;
  return (
    <svg width={p} height={p} viewBox="0 0 80 80" fill="none">
      {/* Window frame */}
      <rect
        x="6"
        y="10"
        width="68"
        height="60"
        rx="9"
        fill="rgba(0,0,0,0.55)"
      />
      {/* Title bar stripe */}
      <rect
        x="6"
        y="10"
        width="68"
        height="16"
        rx="9"
        fill="rgba(0,0,0,0.35)"
      />
      <rect x="6" y="18" width="68" height="8" fill="rgba(0,0,0,0.35)" />
      {/* Traffic dots */}
      <circle cx="21" cy="20" r="3.6" fill="#FF5F57" />
      <circle cx="33" cy="20" r="3.6" fill="#FFBD2E" />
      <circle cx="45" cy="20" r="3.6" fill="#28C840" />
      {/* Prompt > */}
      <polyline
        points="14,51 24,45 14,39"
        stroke="#4ADE80"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Cursor block */}
      <rect
        x="28"
        y="41"
        width="16"
        height="6"
        rx="1.5"
        fill="rgba(74,222,128,0.75)"
      />
      {/* Second line hint */}
      <rect
        x="14"
        y="60"
        width="46"
        height="3.5"
        rx="1.5"
        fill="rgba(255,255,255,0.14)"
      />
    </svg>
  );
}

// Skills — App Store icon: two crossing diagonal strokes with tails + crossbar
function SkillsArt({ s }: { s: number }) {
  const p = s * 0.66;
  return (
    <svg width={p} height={p} viewBox="0 0 80 80" fill="none">
      {/* Left stroke: bottom-left → upper-right tail (crosses right stroke near top) */}
      <line
        x1="13"
        y1="68"
        x2="50"
        y2="12"
        stroke="white"
        strokeWidth="10.5"
        strokeLinecap="round"
        opacity="0.92"
      />
      {/* Right stroke: bottom-right → upper-left tail */}
      <line
        x1="67"
        y1="68"
        x2="30"
        y2="12"
        stroke="white"
        strokeWidth="10.5"
        strokeLinecap="round"
        opacity="0.92"
      />
      {/* Crossbar */}
      <line
        x1="20"
        y1="50"
        x2="60"
        y2="50"
        stroke="white"
        strokeWidth="10"
        strokeLinecap="round"
        opacity="0.92"
      />
      {/* Gloss overlay on strokes */}
      <line
        x1="13"
        y1="68"
        x2="50"
        y2="12"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.22"
      />
      <line
        x1="67"
        y1="68"
        x2="30"
        y2="12"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.22"
      />
      <line
        x1="20"
        y1="50"
        x2="60"
        y2="50"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.22"
      />
    </svg>
  );
}

// Contact — Messages-style speech bubble (green)
function ContactArt({ s }: { s: number }) {
  const p = s * 0.6;
  return (
    <svg width={p} height={p} viewBox="0 0 80 80" fill="none">
      {/* Bubble body */}
      <rect
        x="8"
        y="10"
        width="64"
        height="46"
        rx="14"
        fill="white"
        opacity="0.95"
      />
      {/* Tail */}
      <path d="M 18 56 L 10 70 L 34 60" fill="white" opacity="0.95" />
      {/* Dots inside */}
      <circle cx="28" cy="33" r="5" fill="rgba(40,180,40,0.5)" />
      <circle cx="40" cy="33" r="5" fill="rgba(40,180,40,0.5)" />
      <circle cx="52" cy="33" r="5" fill="rgba(40,180,40,0.5)" />
    </svg>
  );
}

// Resume — Pages/iWork–style document (orange-red)
function ResumeArt({ s }: { s: number }) {
  const p = s * 0.6;
  return (
    <svg width={p} height={p} viewBox="0 0 80 80" fill="none">
      {/* Page */}
      <rect
        x="12"
        y="6"
        width="56"
        height="68"
        rx="8"
        fill="white"
        opacity="0.95"
      />
      {/* Folded corner */}
      <path d="M 52 6 L 68 22 L 52 22 Z" fill="rgba(255,120,50,0.35)" />
      <path
        d="M 52 6 L 68 22 L 52 22 Z"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1"
      />
      {/* Text lines */}
      <rect
        x="20"
        y="30"
        width="40"
        height="4"
        rx="2"
        fill="rgba(255,100,40,0.30)"
      />
      <rect
        x="20"
        y="40"
        width="34"
        height="4"
        rx="2"
        fill="rgba(0,0,0,0.14)"
      />
      <rect
        x="20"
        y="50"
        width="38"
        height="4"
        rx="2"
        fill="rgba(0,0,0,0.14)"
      />
      <rect
        x="20"
        y="60"
        width="28"
        height="4"
        rx="2"
        fill="rgba(0,0,0,0.14)"
      />
    </svg>
  );
}

// Settings — macOS System Settings gear
function SettingsArt({ s }: { s: number }) {
  const p = s * 0.6;
  const teeth = 8;
  const cx = 40;
  const cy = 40;
  const outerR = 32;
  const bodyR = 26;
  const holeR = 13;
  const toothW = 10;
  const toothH = 9;
  return (
    <svg width={p} height={p} viewBox="0 0 80 80" fill="none">
      {/* Gear teeth */}
      {Array.from({ length: teeth }, (_, i) => (
        <rect
          key={i}
          x={cx - toothW / 2}
          y={cy - outerR - toothH * 0.1}
          width={toothW}
          height={toothH}
          rx="2.5"
          fill="white"
          opacity="0.92"
          transform={`rotate(${(i * 360) / teeth}, ${cx}, ${cy})`}
        />
      ))}
      {/* Gear body */}
      <circle cx={cx} cy={cy} r={bodyR} fill="white" opacity="0.92" />
      {/* Center hole */}
      <circle
        cx={cx}
        cy={cy}
        r={holeR}
        fill="transparent"
        stroke="rgba(90,104,128,0.65)"
        strokeWidth="12"
      />
    </svg>
  );
}

// Chat GPM — purple chat bubble with sparkle star
function ChatArt({ s }: { s: number }) {
  const p = s * 0.62;
  return (
    <svg width={p} height={p} viewBox="0 0 80 80" fill="none">
      {/* Main bubble */}
      <rect
        x="7"
        y="8"
        width="58"
        height="43"
        rx="13"
        fill="white"
        opacity="0.95"
      />
      {/* Bubble tail */}
      <path d="M 17 51 L 11 67 L 33 55" fill="white" opacity="0.95" />
      {/* 4-point sparkle star */}
      <path
        d="M 36 17 L 38.8 25.2 L 47 28 L 38.8 30.8 L 36 39 L 33.2 30.8 L 25 28 L 33.2 25.2 Z"
        fill="rgba(139,92,246,0.82)"
      />
      {/* Small accent dots */}
      <circle cx="16" cy="35" r="3.2" fill="rgba(139,92,246,0.38)" />
      <circle cx="56" cy="35" r="3.2" fill="rgba(139,92,246,0.38)" />
      {/* Top-right sparkle pip */}
      <circle cx="61" cy="12" r="2.4" fill="rgba(255,255,255,0.75)" />
      <circle cx="68" cy="8" r="1.5" fill="rgba(255,255,255,0.50)" />
    </svg>
  );
}

// Games — orange folder with gamepad inside
function GamesArt({ s }: { s: number }) {
  const p = s * 0.62;
  return (
    <svg width={p} height={p} viewBox="0 0 80 80" fill="none">
      {/* Folder tab */}
      <path
        d="M 7 33 L 7 27 Q 7 21 13 21 L 30 21 Q 35 21 37 25 L 40 33 Z"
        fill="white"
        opacity="0.82"
      />
      {/* Folder body */}
      <rect
        x="7"
        y="33"
        width="66"
        height="38"
        rx="7"
        fill="white"
        opacity="0.95"
      />
      {/* Gamepad body */}
      <rect
        x="18"
        y="42"
        width="44"
        height="22"
        rx="11"
        fill="rgba(249,115,22,0.32)"
      />
      {/* D-pad horizontal */}
      <rect
        x="24"
        y="51"
        width="12"
        height="4"
        rx="2"
        fill="rgba(234,88,12,0.65)"
      />
      {/* D-pad vertical */}
      <rect
        x="28"
        y="47"
        width="4"
        height="12"
        rx="2"
        fill="rgba(234,88,12,0.65)"
      />
      {/* Action buttons */}
      <circle cx="47" cy="50" r="2.8" fill="rgba(234,88,12,0.55)" />
      <circle cx="53" cy="53" r="2.8" fill="rgba(234,88,12,0.55)" />
      <circle cx="47" cy="56" r="2.8" fill="rgba(234,88,12,0.55)" />
      <circle cx="41" cy="53" r="2.8" fill="rgba(234,88,12,0.55)" />
      {/* Center button */}
      <circle cx="37" cy="53" r="2" fill="rgba(234,88,12,0.4)" />
    </svg>
  );
}

// Snake — winding snake on dark bg
function SnakeArt({ s }: { s: number }) {
  const p = s * 0.64;
  return (
    <svg width={p} height={p} viewBox="0 0 80 80" fill="none">
      {/* Snake body — winding S-curve */}
      <path
        d="M 18 62 Q 8 62 8 50 Q 8 38 40 38 Q 72 38 72 26 Q 72 14 58 14"
        stroke="white"
        strokeWidth="13"
        strokeLinecap="round"
        fill="none"
        opacity="0.90"
      />
      {/* Head */}
      <circle cx="58" cy="14" r="9" fill="white" opacity="0.95" />
      {/* Eyes */}
      <circle cx="55" cy="11" r="2.2" fill="rgba(20,83,45,0.85)" />
      <circle cx="62" cy="11" r="2.2" fill="rgba(20,83,45,0.85)" />
      {/* Tongue */}
      <path
        d="M 58 22 L 56 27 M 58 22 L 60 27"
        stroke="rgba(248,113,113,0.9)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Food dot */}
      <circle cx="16" cy="68" r="5.5" fill="#F87171" opacity="0.92" />
      <circle cx="16" cy="66" r="2" fill="white" opacity="0.4" />
    </svg>
  );
}

// Tower of Hanoi — 3 pegs with stacked coloured discs
function HanoiArt({ s }: { s: number }) {
  const p = s * 0.66;
  const pegs = [18, 40, 62]; // x centres
  const discs = [
    { w: 36, y: 62, color: "#F87171" },
    { w: 28, y: 52, color: "#F97316" },
    { w: 20, y: 42, color: "#FBBF24" },
    { w: 13, y: 32, color: "#34D399" },
  ];
  return (
    <svg width={p} height={p} viewBox="0 0 80 80" fill="none">
      {/* Base plate */}
      <rect
        x="8"
        y="68"
        width="64"
        height="5"
        rx="2.5"
        fill="white"
        opacity="0.85"
      />
      {/* Peg sticks */}
      {pegs.map((cx) => (
        <rect
          key={cx}
          x={cx - 2}
          y="20"
          width="4"
          height="48"
          rx="2"
          fill="white"
          opacity="0.55"
        />
      ))}
      {/* Discs on first peg (cx=18) */}
      {discs.map((d) => (
        <rect
          key={d.y}
          x={pegs[0] - d.w / 2}
          y={d.y}
          width={d.w}
          height={8}
          rx="4"
          fill={d.color}
          opacity="0.92"
        />
      ))}
    </svg>
  );
}

// Tetris — colourful stacked blocks
function TetrisArt({ s }: { s: number }) {
  const p = s * 0.66;
  // A small arrangement of tetromino-style blocks
  const blocks: { x: number; y: number; color: string }[] = [
    // I piece (cyan) — horizontal row near bottom
    { x: 8, y: 58, color: "#00E5FF" },
    { x: 20, y: 58, color: "#00E5FF" },
    { x: 32, y: 58, color: "#00E5FF" },
    { x: 44, y: 58, color: "#00E5FF" },
    // O piece (yellow) — 2×2 square
    { x: 56, y: 46, color: "#FFD600" },
    { x: 68, y: 46, color: "#FFD600" },
    { x: 56, y: 58, color: "#FFD600" },
    { x: 68, y: 58, color: "#FFD600" },
    // T piece (purple)
    { x: 20, y: 34, color: "#D500F9" },
    { x: 32, y: 34, color: "#D500F9" },
    { x: 44, y: 34, color: "#D500F9" },
    { x: 32, y: 46, color: "#D500F9" },
    // S piece (green)
    { x: 44, y: 10, color: "#00E676" },
    { x: 56, y: 10, color: "#00E676" },
    { x: 32, y: 22, color: "#00E676" },
    { x: 44, y: 22, color: "#00E676" },
    // L piece (orange)
    { x: 8, y: 10, color: "#FF6D00" },
    { x: 8, y: 22, color: "#FF6D00" },
    { x: 8, y: 34, color: "#FF6D00" },
    { x: 20, y: 34, color: "#FF6D00" },
  ];
  const bsz = 10;
  return (
    <svg width={p} height={p} viewBox="0 0 80 80" fill="none">
      {blocks.map((b, i) => (
        <g key={i}>
          <rect
            x={b.x}
            y={b.y}
            width={bsz}
            height={bsz}
            rx="2"
            fill={b.color}
            opacity="0.92"
          />
          <rect
            x={b.x + 1}
            y={b.y + 1}
            width={bsz - 2}
            height={(bsz - 2) * 0.35}
            rx="1"
            fill="rgba(255,255,255,0.30)"
          />
        </g>
      ))}
    </svg>
  );
}

// Endless Jump — character jumping between platforms
function JumpArt({ s }: { s: number }) {
  const p = s * 0.66;
  return (
    <svg width={p} height={p} viewBox="0 0 80 80" fill="none">
      {/* Platforms */}
      <rect
        x="6"
        y="68"
        width="28"
        height="7"
        rx="3.5"
        fill="white"
        opacity="0.85"
      />
      <rect
        x="44"
        y="52"
        width="24"
        height="7"
        rx="3.5"
        fill="#C084FC"
        opacity="0.85"
      />
      <rect
        x="16"
        y="36"
        width="26"
        height="7"
        rx="3.5"
        fill="#60A5FA"
        opacity="0.85"
      />
      <rect
        x="46"
        y="20"
        width="22"
        height="7"
        rx="3.5"
        fill="#4ADE80"
        opacity="0.85"
      />
      {/* Character body */}
      <rect
        x="22"
        y="20"
        width="14"
        height="16"
        rx="5"
        fill="white"
        opacity="0.95"
      />
      {/* Eyes */}
      <circle cx="27" cy="26" r="2" fill="rgba(30,58,138,0.75)" />
      <circle cx="33" cy="26" r="2" fill="rgba(30,58,138,0.75)" />
      {/* Jump arc trail */}
      <path
        d="M 14 64 Q 36 30 36 20"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="2"
        strokeDasharray="3 4"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

// GitHub — dark squircle with octocat-inspired silhouette
function GitHubArt({ s }: { s: number }) {
  const p = s * 0.6;
  // Simple GitHub mark: circle head + body + tentacle hints
  return (
    <svg width={p} height={p} viewBox="0 0 80 80" fill="none">
      {/* Octocat head circle */}
      <circle cx="40" cy="30" r="18" fill="white" opacity="0.92" />
      {/* Ear notches */}
      <path d="M 28 18 L 22 10 L 30 15 Z" fill="white" opacity="0.92" />
      <path d="M 52 18 L 58 10 L 50 15 Z" fill="white" opacity="0.92" />
      {/* Body */}
      <path
        d="M 22 46 Q 18 56 18 66 L 40 62 L 62 66 Q 62 56 58 46 Q 50 52 40 52 Q 30 52 22 46 Z"
        fill="white"
        opacity="0.92"
      />
      {/* Eye holes (using background-matching fill simulation) */}
      <ellipse cx="33" cy="28" rx="4" ry="5" fill="rgba(50,50,50,0.55)" />
      <ellipse cx="47" cy="28" rx="4" ry="5" fill="rgba(50,50,50,0.55)" />
    </svg>
  );
}

// ── Config map ────────────────────────────────────────────────────────────────

const ICON_MAP: Record<
  AppIconId,
  {
    g1: string;
    g2: string;
    art: (s: number) => React.ReactNode;
    shadow?: string;
  }
> = {
  about: {
    g1: "#5DCDFF",
    g2: "#0579FF",
    art: (s) => <AboutArt s={s} />,
  },
  projects: {
    g1: "#66CBFF",
    g2: "#1278FD",
    art: (s) => <ProjectsArt s={s} />,
  },
  terminal: {
    g1: "#3A3A3A",
    g2: "#1A1A1A",
    shadow:
      "0 3px 14px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.10), inset 0 0 0 1px rgba(255,255,255,0.07)",
    art: (s) => <TerminalArt s={s} />,
  },
  skills: {
    g1: "#42A5F5",
    g2: "#1565C0",
    art: (s) => <SkillsArt s={s} />,
  },
  contact: {
    g1: "#5FD75F",
    g2: "#28B428",
    art: (s) => <ContactArt s={s} />,
  },
  resume: {
    g1: "#FFAA45",
    g2: "#FF5218",
    art: (s) => <ResumeArt s={s} />,
  },
  settings: {
    g1: "#8E9EBA",
    g2: "#5A6880",
    art: (s) => <SettingsArt s={s} />,
  },
  chat: {
    g1: "#C084FC",
    g2: "#7C3AED",
    art: (s) => <ChatArt s={s} />,
  },
  games: {
    g1: "#FB923C",
    g2: "#EA580C",
    art: (s) => <GamesArt s={s} />,
  },
  snake: {
    g1: "#4ADE80",
    g2: "#166534",
    art: (s) => <SnakeArt s={s} />,
  },
  hanoi: {
    g1: "#D8B4FE",
    g2: "#7C3AED",
    art: (s) => <HanoiArt s={s} />,
  },
  tetris: {
    g1: "#1A1A2E",
    g2: "#0D0D1A",
    shadow:
      "0 3px 14px rgba(0,0,0,0.60), inset 0 1px 0 rgba(255,255,255,0.10), inset 0 0 0 1px rgba(0,229,255,0.15)",
    art: (s) => <TetrisArt s={s} />,
  },
  jump: {
    g1: "#6366F1",
    g2: "#3730A3",
    art: (s) => <JumpArt s={s} />,
  },
  github: {
    g1: "#484848",
    g2: "#272727",
    shadow:
      "0 3px 14px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.10), inset 0 0 0 1px rgba(255,255,255,0.08)",
    art: (s) => <GitHubArt s={s} />,
  },
};

// ── Public component ──────────────────────────────────────────────────────────

export function MacAppIcon({ id, size }: { id: AppIconId; size: number }) {
  const cfg = ICON_MAP[id];
  return (
    <IconShell g1={cfg.g1} g2={cfg.g2} size={size} shadow={cfg.shadow}>
      {cfg.art(size)}
    </IconShell>
  );
}
