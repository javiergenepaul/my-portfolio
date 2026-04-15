"use client";

import { translate } from "@/i18n";
import { useLanguageStore } from "@/stores/language-store";
import "moment/locale/ja";

const MOMENT_LOCALE: Record<string, string> = {
  en: "en",
  ja: "ja",
  fil: "en",
  ceb: "en",
};

const DATE_FORMAT: Record<string, string> = {
  en: "MMM YYYY",
  ja: "YYYY年M月",
  fil: "MMM YYYY",
  ceb: "MMM YYYY",
};

export function hexRgb(hex: string) {
  return `${parseInt(hex.slice(1, 3), 16)},${parseInt(hex.slice(3, 5), 16)},${parseInt(hex.slice(5, 7), 16)}`;
}

export function formatDate(m: import("moment").Moment | "present") {
  if (m === "present") return translate("win26.present");
  const lang = useLanguageStore.getState().language ?? "en";
  const locale = MOMENT_LOCALE[lang] ?? "en";
  const fmt = DATE_FORMAT[lang] ?? "MMM YYYY";
  return m.clone().locale(locale).format(fmt);
}
