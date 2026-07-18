import dayjs from "dayjs";
import "dayjs/locale/ja";
import { translate } from "@/i18n";
import { useLanguageStore } from "@/stores";

const MOMENT_LOCALE: Record<string, string> = {
  en: "en",
  ja: "ja",
  fil: "en",
  ceb: "en",
};
const DATE_FMT: Record<string, string> = {
  en: "MMM YYYY",
  ja: "YYYY年M月",
  fil: "MMM YYYY",
  ceb: "MMM YYYY",
};

export function formatDateRange(
  start: dayjs.Dayjs,
  end: dayjs.Dayjs | "present",
): string {
  const lang = useLanguageStore.getState().language ?? "en";
  const locale = MOMENT_LOCALE[lang] ?? "en";
  const fmt = DATE_FMT[lang] ?? "MMM YYYY";
  const s = start.locale(locale).format(fmt);
  const e =
    end === "present"
      ? translate("win26.present")
      : (end as dayjs.Dayjs).locale(locale).format(fmt);
  return `${s} – ${e}`;
}

/** Split a description paragraph into clean sentence bullets. */
export function toBullets(description: string): string[] {
  return description
    .split(". ")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => (s.endsWith(".") ? s : s + "."));
}

export function employmentLabel(
  type?: "Full-time" | "Part-time",
): string | undefined {
  if (!type) return undefined;
  return type === "Full-time"
    ? translate("win26.employment.fullTime")
    : translate("win26.employment.partTime");
}

/**
 * Font styles per locale — built-in Helvetica variants for Latin locales,
 * the embedded Noto Sans JP weights for Japanese (which has no italic).
 */
export function getPdfFonts() {
  const lang = useLanguageStore.getState().language ?? "en";
  const isJa = lang === "ja";
  return {
    base: isJa ? { fontFamily: "NotoSansJP" } : { fontFamily: "Helvetica" },
    bold: isJa
      ? { fontFamily: "NotoSansJP", fontWeight: 700 as const }
      : { fontFamily: "Helvetica-Bold" },
    italic: isJa
      ? { fontFamily: "NotoSansJP" }
      : { fontFamily: "Helvetica-Oblique" },
  };
}

export type PdfFonts = ReturnType<typeof getPdfFonts>;

/**
 * Solid-color stand-in for the templates' alpha-hex tints (e.g. `accent +
 * "22"`): mixes `fg` over `bg` at the given opacity so no PDF alpha handling
 * is needed.
 */
export function mixColor(fg: string, bg: string, opacity: number): string {
  const parse = (hex: string) => {
    const h = hex.replace("#", "");
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16),
    ];
  };
  const [fr, fg_, fb] = parse(fg);
  const [br, bg_, bb] = parse(bg);
  const mix = (a: number, b: number) =>
    Math.round(a * opacity + b * (1 - opacity));
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(mix(fr, br))}${toHex(mix(fg_, bg_))}${toHex(mix(fb, bb))}`;
}
