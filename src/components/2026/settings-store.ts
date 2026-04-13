"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type TimeFormat = "12h" | "24h";

interface Settings2026State {
  timeFormat: TimeFormat;
  setTimeFormat: (f: TimeFormat) => void;
}

export const use2026Settings = create<Settings2026State>()(
  persist(
    (set) => ({
      timeFormat: "12h",
      setTimeFormat: (timeFormat) => set({ timeFormat }),
    }),
    {
      name: "portfolio-2026-settings",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : (null as any),
      ),
    },
  ),
);
