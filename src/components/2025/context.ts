"use client";

import { createContext, useContext } from "react";

export function makePalette(isLight: boolean) {
  return {
    // Page / sidebar — sidebar is intentionally always dark
    page: isLight ? "#FFF1F2" : "#060108",
    sidebar: "#0C0509",
    sidebarHover: "#1C0510",
    main: isLight ? "#FFFFFF" : "#0F172A",
    // Accent colours (same in both modes)
    indigo: "#FB7185",
    indigoDark: "#E11D48",
    indigoLight: isLight ? "rgba(251,113,133,0.1)" : "rgba(251,113,133,0.15)",
    mint: "#FDA4AF",
    mintDark: "#BE123C",
    mintLight: isLight ? "rgba(253,164,175,0.12)" : "rgba(253,164,175,0.18)",
    amber: "#FBBF24",
    amberLight: isLight ? "rgba(251,191,36,0.1)" : "rgba(251,191,36,0.14)",
    // Content text
    textDark: isLight ? "#0F172A" : "#F1F5F9",
    textMid: isLight ? "#334155" : "#CBD5E1",
    textMuted: isLight ? "#64748B" : "#94A3B8",
    // Sidebar text (always dark sidebar)
    textSidebar: "#F8FAFC",
    textSidebarDim: "#94A3B8",
    // Borders & cards
    border: isLight ? "#E2E8F0" : "#1E293B",
    borderSidebar: "#2A0910",
    card: isLight ? "#F8FAFC" : "#1E293B",
  };
}

export type Palette = ReturnType<typeof makePalette>;
export const CContext = createContext<Palette>(makePalette(false));
export const useC = () => useContext(CContext);
