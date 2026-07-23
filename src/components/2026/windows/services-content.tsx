"use client";

import { Sparkles, Check } from "lucide-react";
import { translate, useLocaleRefresh } from "@/i18n";
import { useLanguageStore } from "@/stores/language-store";
import { useContent } from "@/lib/content/use-content";
import { rowsToServices } from "@/lib/content/portfolio";

const ACCENT = "#38BDF8";

export function ServicesContent() {
  useLocaleRefresh();
  const locale = useLanguageStore((s) => s.language);
  // Stack references are stored by name, so the mapper needs the skill rows too.
  const SERVICES = rowsToServices(
    useContent("services"),
    useContent("skills"),
    locale,
  );

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
          <Sparkles size={14} color={ACCENT} />
        </div>
        <div>
          <div className="text-a26-text text-[13px] font-semibold">
            {translate("win26.services.title") || "Services"}
          </div>
          <div className="text-a26-mid text-[11px]">
            {translate("win26.services.subtitle") ||
              "What I build, and how I can help"}
          </div>
        </div>
      </div>

      <div
        className="win26-scroll flex-1 overflow-y-auto px-4 py-4 [scrollbar-width:thin]"
        style={{ scrollbarColor: "rgba(255,255,255,0.18) transparent" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SERVICES.map((s) => (
            <article
              key={s.title}
              className="bg-a26-card border border-a26-card-border rounded-xl p-4 flex flex-col gap-3"
              style={{ boxShadow: "0 10px 28px rgba(0,0,0,0.18)" }}
            >
              <div>
                <h2 className="text-a26-text text-[14px] font-semibold leading-[1.4] m-0">
                  {s.title}
                </h2>
                <p className="text-a26-mid text-[11.5px] leading-[1.7] mt-1.5 mb-0">
                  {s.description}
                </p>
              </div>

              {s.subDetails && s.subDetails.length > 0 && (
                <ul className="list-none p-0 m-0 flex flex-col gap-1.5">
                  {s.subDetails.map((d) => (
                    <li
                      key={d}
                      className="text-a26-mid text-[11.5px] leading-[1.6] flex items-start gap-2"
                    >
                      <Check
                        size={13}
                        color={ACCENT}
                        className="shrink-0 mt-0.5"
                      />
                      {d}
                    </li>
                  ))}
                </ul>
              )}

              {s.stack && s.stack.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {s.stack.map((t) => (
                    <span
                      key={t.name}
                      className="text-[10px] font-medium rounded-full px-2.5 py-1"
                      style={{
                        background:
                          "color-mix(in srgb, var(--a26-glass) 78%, transparent)",
                        border: "1px solid var(--a26-glass-border)",
                        color: "var(--a26-mid)",
                      }}
                    >
                      {t.label ?? t.name}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
