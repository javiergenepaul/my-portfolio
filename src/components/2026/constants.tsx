"use client";

import React from "react";
import {
  FolderOpen,
  TerminalSquare,
  Mail,
  Settings2,
  User,
  FileText,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import type { Color } from "@/stores";
import type { ResumeColorConfig } from "@/screens/2024/resume/resume";

// ── Palettes ───────────────────────────────────────────────────────────────────

export const A_DARK = {
  teal: "#2DD4BF",
  violet: "#A78BFA",
  green: "#4ADE80",
  blue: "#60A5FA",
  text: "#F0F2F5",
  textMid: "#9BA3AF",
  textMuted: "#4B5563",
  menuBar: "rgba(20,20,20,0.86)",
  menuBorder: "rgba(255,255,255,0.06)",
  window: "rgba(28,28,28,0.93)",
  windowBorder: "rgba(255,255,255,0.09)",
  titleBar: "rgba(44,44,44,0.72)",
  titleBorder: "rgba(255,255,255,0.07)",
  dock: "rgba(30,30,30,0.74)",
  dockBorder: "rgba(255,255,255,0.10)",
  sidebar: "rgba(255,255,255,0.018)",
  glass: "rgba(255,255,255,0.048)",
  glassBorder: "rgba(255,255,255,0.08)",
  card: "rgba(255,255,255,0.032)",
  cardBorder: "rgba(255,255,255,0.07)",
  inputBg: "rgba(255,255,255,0.06)",
  termBg: "#0A0A0A",
};

export const A_LIGHT = {
  teal: "#0D9488",
  violet: "#7C3AED",
  green: "#16A34A",
  blue: "#2563EB",
  text: "#111827",
  textMid: "#6B7280",
  textMuted: "#9CA3AF",
  menuBar: "rgba(232,232,232,0.90)",
  menuBorder: "rgba(0,0,0,0.10)",
  window: "rgba(250,250,250,0.97)",
  windowBorder: "rgba(0,0,0,0.10)",
  titleBar: "rgba(220,220,220,0.92)",
  titleBorder: "rgba(0,0,0,0.07)",
  dock: "rgba(200,200,200,0.82)",
  dockBorder: "rgba(0,0,0,0.15)",
  sidebar: "rgba(0,0,0,0.03)",
  glass: "rgba(0,0,0,0.04)",
  glassBorder: "rgba(0,0,0,0.09)",
  card: "rgba(0,0,0,0.03)",
  cardBorder: "rgba(0,0,0,0.08)",
  inputBg: "rgba(0,0,0,0.05)",
  termBg: "#0A0A0A",
};

// Keep backward-compat alias (mac-app-icons uses this for static art, not chrome)
export const A = A_DARK;

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
  | "resume"
  | "settings"
  | "chat";

export interface WinDef {
  id: WinId;
  title: string;
  color: string;
  icon: React.ReactNode;
  defaultPos: { x: number; y: number } | ((vw: number) => { x: number; y: number });
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
    defaultPos: (vw: number) => ({ x: vw - 660 - 120, y: 90 }),
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
  {
    id: "settings",
    title: "System Settings",
    color: "#A0A0A0",
    icon: <SlidersHorizontal size={14} />,
    defaultPos: { x: 200, y: 90 },
    defaultSize: { w: 680, h: 520 },
  },
  {
    id: "chat",
    title: "Chat GPM",
    color: "#A855F7",
    icon: <Sparkles size={14} />,
    defaultPos: (vw: number) => ({ x: vw - 620, y: 510 }),
    defaultSize: { w: 520, h: 500 },
  },
];

export interface WinState {
  open: boolean;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
}
