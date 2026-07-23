"use client";

import { Languages as LanguagesIcon } from "lucide-react";
import { translate, useLocaleRefresh } from "@/i18n";
import { useLanguageStore } from "@/stores/language-store";
import { useContent } from "@/lib/content/use-content";
import { rowsToLanguages } from "@/lib/content/portfolio";

const ACCENT = "#34D399";

/** Proficiency → bar fill. Mirrors LEVEL_PCT in the 2025 shell. */
const LEVEL_PCT: Record<string, number> = {
  Native: 100,
  Fluent: 90,
  Conversational: 65,
  Basic: 25,
};

export function LanguagesContent() {
  useLocaleRefresh();
  const locale = useLanguageStore((s) => s.language);
  const LANGUAGES = rowsToLanguages(useContent("languages"), locale);

  return (
    <div className="font-mac flex flex-col flex-1 min-h-0 overflow-hidden">
      <div className="flex items-center shrink-0 border-b bg-a26-title-bar border-a26-glass-border gap-2 py-2 px-3.5">
        <div
          className="flex items-center justify-center w-7 h-7 rounded-[8px]"
          style={{
            background: `color-mix(in srgb, ${ACCENT} 14%, transparent)`,
            border: `1px solid color-mix(in srgb, ${ACCENT} 26%, transparent)`,
          }}
        >
          <LanguagesIcon size={14} color={ACCENT} />
        </div>
        <div>
          <div className="text-a26-text text-[13px] font-semibold">
            {translate("win26.languages.title") || "Languages"}
          </div>
          <div className="text-a26-mid text-[11px]">
            {translate("win26.languages.subtitle") ||
              "Languages I work and collaborate in"}
          </div>
        </div>
      </div>

      <div
        className="win26-scroll flex-1 overflow-y-auto px-4 py-4 [scrollbar-width:thin]"
        style={{ scrollbarColor: "rgba(255,255,255,0.18) transparent" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {LANGUAGES.map((l) => {
            const pct = LEVEL_PCT[l.level] ?? 50;
            return (
              <article
                key={l.name}
                className="bg-a26-card border border-a26-card-border rounded-xl p-4 flex flex-col gap-3"
                style={{ boxShadow: "0 10px 28px rgba(0,0,0,0.18)" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-a26-text text-[14px] font-semibold leading-[1.4] m-0">
                      {l.name}
                    </h2>
                    <p className="text-a26-mid text-[11px] mt-1 mb-0">
                      {l.nativeName}
                    </p>
                  </div>
                  <span
                    className="shrink-0 text-[10px] font-semibold rounded-full px-2.5 py-1"
                    style={{
                      background: `color-mix(in srgb, ${ACCENT} 12%, transparent)`,
                      border: `1px solid color-mix(in srgb, ${ACCENT} 22%, transparent)`,
                      color: ACCENT,
                    }}
                  >
                    {l.level}
                  </span>
                </div>

                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: "var(--a26-glass-border)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, background: ACCENT }}
                  />
                </div>

                {l.note && (
                  <p className="text-a26-mid text-[11.5px] leading-[1.7] m-0">
                    {l.note}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
