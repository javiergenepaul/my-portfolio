import { CAREER_START_DATE } from "@/config";
import dayjs from "dayjs";
import type { Palette } from "./context";

export type SkillTab = "backend" | "frontend" | "others";

export const NAV_ITEMS = [
  { id: "about", label: "About", num: "01" },
  { id: "experience", label: "Edu & Exp", num: "02" },
  { id: "skills", label: "Tech Stack", num: "03" },
  { id: "projects", label: "Projects", num: "04" },
  { id: "testimonials", label: "Testimonials", num: "05" },
  { id: "languages", label: "Languages", num: "06" },
  { id: "books", label: "Books", num: "07" },
  { id: "contact", label: "Contact", num: "08" },
];

export const SIDEBAR_STATS = [
  {
    label: "Yrs Exp",
    value: `${dayjs().diff(dayjs(CAREER_START_DATE), "years")}+`,
  },
  { label: "Projects", value: "15+" },
  { label: "Stacks", value: "30+" },
];

export const LEVEL_PCT: Record<string, number> = {
  Native: 100,
  Fluent: 90,
  Conversational: 65,
  Basic: 25,
};

export function makeTypeColors(
  C: Palette,
): Record<string, { bg: string; color: string; border: string }> {
  return {
    confidential: {
      bg: "rgba(239,68,68,0.08)",
      color: "#DC2626",
      border: "rgba(239,68,68,0.2)",
    },
    client: {
      bg: C.indigoLight,
      color: C.indigoDark,
      border: "rgba(225,29,72,0.2)",
    },
    personal: {
      bg: C.mintLight,
      color: C.mintDark,
      border: "rgba(190,18,60,0.2)",
    },
    tutorial: {
      bg: C.amberLight,
      color: "#B45309",
      border: "rgba(251,191,36,0.2)",
    },
  };
}

export function makeThemeColors(
  C: Palette,
): Record<string, { bg: string; color: string; border: string }> {
  return {
    Purpose: {
      bg: C.indigoLight,
      color: C.indigoDark,
      border: "rgba(225,29,72,0.2)",
    },
    Humility: {
      bg: C.mintLight,
      color: C.mintDark,
      border: "rgba(190,18,60,0.2)",
    },
    Systems: {
      bg: C.amberLight,
      color: "#B45309",
      border: "rgba(251,191,36,0.2)",
    },
    Resilience: {
      bg: "rgba(99,102,241,0.08)",
      color: "#4F46E5",
      border: "rgba(99,102,241,0.2)",
    },
    Stoicism: {
      bg: "rgba(20,184,166,0.08)",
      color: "#0D9488",
      border: "rgba(20,184,166,0.2)",
    },
    Focus: {
      bg: "rgba(168,85,247,0.08)",
      color: "#9333EA",
      border: "rgba(168,85,247,0.2)",
    },
    Leadership: {
      bg: "rgba(249,115,22,0.08)",
      color: "#EA580C",
      border: "rgba(249,115,22,0.2)",
    },
    Productivity: {
      bg: "rgba(16,185,129,0.08)",
      color: "#059669",
      border: "rgba(16,185,129,0.2)",
    },
  };
}

export const SKILL_TABS: {
  id: SkillTab;
  label: string;
  accent: string;
  glow: string;
}[] = [
  {
    id: "backend",
    label: "Backend",
    accent: "#E11D48",
    glow: "rgba(225,29,72,0.2)",
  },
  {
    id: "frontend",
    label: "Frontend",
    accent: "#BE123C",
    glow: "rgba(190,18,60,0.18)",
  },
  {
    id: "others",
    label: "Others",
    accent: "#B45309",
    glow: "rgba(180,83,9,0.18)",
  },
];

export function fmt(s: dayjs.Dayjs, e: dayjs.Dayjs | "present") {
  return `${s.format("MMM YYYY")} — ${e === "present" ? "Present" : (e as dayjs.Dayjs).format("MMM YYYY")}`;
}
