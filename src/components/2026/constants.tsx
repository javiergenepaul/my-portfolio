"use client";

import React from "react";
import {
  FolderOpen,
  TerminalSquare,
  Mail,
  Settings2,
  User,
  FileText,
} from "lucide-react";
import type { Color } from "@/stores";
import type { ResumeColorConfig } from "@/screens/2024/resume/resume";

// ── Palette — macOS dark mode + aurora accents ─────────────────────────────────

export const A = {
  // Aurora accents
  teal: "#2DD4BF",
  violet: "#A78BFA",
  green: "#4ADE80",
  blue: "#60A5FA",
  // Text
  text: "#F0F2F5",
  textMid: "#9BA3AF",
  textMuted: "#4B5563",
  // Chrome — faithful macOS dark grays
  menuBar: "rgba(20,20,20,0.86)",
  menuBorder: "rgba(255,255,255,0.06)",
  window: "rgba(28,28,28,0.93)",
  windowBorder: "rgba(255,255,255,0.09)",
  titleBar: "rgba(44,44,44,0.72)",
  titleBorder: "rgba(255,255,255,0.07)",
  dock: "rgba(30,30,30,0.74)",
  dockBorder: "rgba(255,255,255,0.10)",
  sidebar: "rgba(255,255,255,0.018)",
  // Glass / cards
  glass: "rgba(255,255,255,0.048)",
  glassBorder: "rgba(255,255,255,0.08)",
  card: "rgba(255,255,255,0.032)",
  cardBorder: "rgba(255,255,255,0.07)",
  inputBg: "rgba(255,255,255,0.06)",
  termBg: "#0A0A0A",
};

// ── Resume color config (mirrors src/screens/resume/resume.tsx) ───────────────

export const RESUME_COLORS: Record<Color, ResumeColorConfig> = {
  emerald: {
    primary: "#22C55E",
    light: "#DCFCE7",
    dark: "#15803D",
    text: "#FFFFFF",
  },
  azure: {
    primary: "#3B82F6",
    light: "#DBEAFE",
    dark: "#1D4ED8",
    text: "#FFFFFF",
  },
  golden: {
    primary: "#CA8A04",
    light: "#FEF9C3",
    dark: "#A16207",
    text: "#FFFFFF",
  },
  sunset: {
    primary: "#EA580C",
    light: "#FFEDD5",
    dark: "#C2410C",
    text: "#FFFFFF",
  },
  lavender: {
    primary: "#7C3AED",
    light: "#EDE9FE",
    dark: "#5B21B6",
    text: "#FFFFFF",
  },
  scarlet: {
    primary: "#E11D48",
    light: "#FFE4E6",
    dark: "#BE123C",
    text: "#FFFFFF",
  },
  silver: {
    primary: "#52525B",
    light: "#F4F4F5",
    dark: "#27272A",
    text: "#FFFFFF",
  },
};

export const RESUME_SWATCHES: { value: Color; hex: string; label: string }[] = [
  { value: "emerald", hex: "#22C55E", label: "Emerald" },
  { value: "azure", hex: "#3B82F6", label: "Azure" },
  { value: "golden", hex: "#CA8A04", label: "Golden" },
  { value: "sunset", hex: "#EA580C", label: "Sunset" },
  { value: "lavender", hex: "#7C3AED", label: "Lavender" },
  { value: "scarlet", hex: "#E11D48", label: "Scarlet" },
  { value: "silver", hex: "#52525B", label: "Silver" },
];

// ── Utilities ──────────────────────────────────────────────────────────────────

export const MAC_FONT =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', 'Segoe UI', system-ui, sans-serif";

// ── Window definitions ─────────────────────────────────────────────────────────

export type WinId =
  | "about"
  | "projects"
  | "terminal"
  | "skills"
  | "contact"
  | "resume";

export interface WinDef {
  id: WinId;
  title: string;
  color: string;
  icon: React.ReactNode;
  defaultPos: { x: number; y: number };
  defaultSize: { w: number; h: number };
}

export const WIN_DEFS: WinDef[] = [
  {
    id: "about",
    title: "About Me",
    color: A.teal,
    icon: <User size={14} />,
    defaultPos: { x: 80, y: 50 },
    defaultSize: { w: 720, h: 580 },
  },
  {
    id: "projects",
    title: "Projects",
    color: A.blue,
    icon: <FolderOpen size={14} />,
    defaultPos: { x: 110, y: 70 },
    defaultSize: { w: 760, h: 500 },
  },
  {
    id: "terminal",
    title: "Terminal",
    color: A.green,
    icon: <TerminalSquare size={14} />,
    defaultPos: { x: 140, y: 90 },
    defaultSize: { w: 660, h: 400 },
  },
  {
    id: "skills",
    title: "Skills & Stack",
    color: A.violet,
    icon: <Settings2 size={14} />,
    defaultPos: { x: 100, y: 60 },
    defaultSize: { w: 700, h: 460 },
  },
  {
    id: "contact",
    title: "Contact",
    color: "#FB7185",
    icon: <Mail size={14} />,
    defaultPos: { x: 160, y: 80 },
    defaultSize: { w: 480, h: 480 },
  },
  {
    id: "resume",
    title: "Resume Builder",
    color: "#F59E0B",
    icon: <FileText size={14} />,
    defaultPos: { x: 180, y: 85 },
    defaultSize: { w: 1060, h: 760 },
  },
];

export interface WinState {
  open: boolean;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
}
