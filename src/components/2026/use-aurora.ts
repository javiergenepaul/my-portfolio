"use client";

import { useSettingsStore } from "@/stores";
import { A_DARK, A_LIGHT } from "./constants";
import { useSystemDark } from "./hooks";

export function useAurora() {
  const theme = useSettingsStore((s) => s.theme);
  const systemDark = useSystemDark();
  const isDark = theme === "dark" || (theme === "system" && systemDark);
  return isDark ? A_DARK : A_LIGHT;
}

export function useIsDark() {
  const theme = useSettingsStore((s) => s.theme);
  const systemDark = useSystemDark();
  return theme === "dark" || (theme === "system" && systemDark);
}
