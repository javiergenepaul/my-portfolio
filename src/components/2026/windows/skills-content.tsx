"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import { translate, useLocaleRefresh } from "@/i18n";
import { useLanguageStore } from "@/stores/language-store";
import { useContent } from "@/lib/content/use-content";
import { rowsToSkillCategories } from "@/lib/content/portfolio";
import { useIsMobile } from "../hooks";

const ACCENT_VARS = [
  "var(--a26-teal)",
  "var(--a26-violet)",
  "var(--a26-green)",
  "var(--a26-blue)",
  "#FBBF24",
  "#FB7185",
];

export function SkillsContent() {
  useLocaleRefresh();
  const isMobile = useIsMobile();
  const locale = useLanguageStore((s) => s.language);
  const SKILL_CATEGORIES = rowsToSkillCategories(useContent("skills"), locale);
  // Store starts empty; fall back to the first category until a tab is picked.
  const [active, setActive] = useState("");
  const activeKey = active || SKILL_CATEGORIES[0]?.key || "";
  const cat = SKILL_CATEGORIES.find((c) => c.key === activeKey);
  const catIdx = SKILL_CATEGORIES.findIndex((c) => c.key === activeKey);
  const col = ACCENT_VARS[catIdx % ACCENT_VARS.length];

  const skillLevel = (s: { isFavorite?: boolean; isStudying?: boolean }) =>
    s.isFavorite ? 90 : s.isStudying ? 35 : 68;

  const categoryTabs = (
    <>
      {SKILL_CATEGORIES.map((c, i) => {
        const color = ACCENT_VARS[i % ACCENT_VARS.length];
        const isActive = activeKey === c.key;
        return (
          <button
            key={c.key}
            onClick={() => setActive(c.key)}
            className="font-mac"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: isMobile ? "6px 12px" : "8px 10px",
              borderRadius: isMobile ? 20 : 7,
              border: isMobile
                ? `1.5px solid ${isActive ? color : "var(--a26-glass-border)"}`
                : "none",
              background: isActive
                ? `color-mix(in srgb, ${color} 13%, transparent)`
                : "transparent",
              color: isActive ? color : "var(--a26-text-mid)",
              fontSize: 12,
              fontWeight: isActive ? 600 : 400,
              cursor: "pointer",
              transition: "all 0.12s",
              whiteSpace: "nowrap",
              flexShrink: 0,
              ...(isMobile
                ? {}
                : {
                    width: "100%",
                    justifyContent: "space-between",
                    textAlign: "left" as const,
                  }),
            }}
          >
            <span>{c.label}</span>
            <span
              style={{
                fontSize: 10,
                background: isActive
                  ? `color-mix(in srgb, ${color} 18%, transparent)`
                  : "var(--a26-glass)",
                color: isActive ? color : "var(--a26-text-muted)",
                borderRadius: 10,
                padding: "1px 6px",
                fontWeight: 600,
              }}
            >
              {c.stacks.length}
            </span>
          </button>
        );
      })}
    </>
  );

  return (
    <div
      className="font-mac flex-1 min-h-0 overflow-hidden flex"
      style={{ flexDirection: isMobile ? "column" : "row" }}
    >
      {/* Mobile: horizontal scroll strip / Desktop: sidebar */}
      {isMobile ? (
        <div
          className="win26-scroll shrink-0 border-b bg-a26-sidebar border-a26-glass-border flex gap-1.5 py-2.5 px-3 overflow-x-auto [scrollbar-width:thin]"
          style={{ scrollbarColor: "rgba(255,255,255,0.18) transparent" }}
        >
          {categoryTabs}
        </div>
      ) : (
        <div
          className="win26-scroll shrink-0 bg-a26-sidebar border-r border-a26-glass-border flex flex-col w-45 py-3.5 px-2 gap-0.5 overflow-y-auto [scrollbar-width:thin]"
          style={{ scrollbarColor: "rgba(255,255,255,0.18) transparent" }}
        >
          <div className="text-a26-muted text-[10px] font-bold px-2 pb-2.5 tracking-[0.08em] uppercase">
            {translate("win26.skills.categories")}
          </div>
          {categoryTabs}
        </div>
      )}

      {/* Main content */}
      <div
        className="win26-scroll flex-1 min-h-0 overflow-y-auto py-5 px-5.5 [scrollbar-width:thin]"
        style={{ scrollbarColor: "rgba(255,255,255,0.18) transparent" }}
      >
        {cat && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeKey}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {/* Category header */}
              <div className="flex items-center border-b border-a26-glass-border gap-2.5 mb-4.5 pb-3.5">
                <div
                  className="flex items-center justify-center shrink-0 w-9 h-9 rounded-[9px] text-lg"
                  style={{
                    background: `color-mix(in srgb, ${col} 13%, transparent)`,
                    border: `1px solid color-mix(in srgb, ${col} 25%, transparent)`,
                  }}
                >
                  {cat.key === "frontend"
                    ? "🎨"
                    : cat.key === "backend"
                      ? "⚙️"
                      : cat.key === "database"
                        ? "🗄️"
                        : cat.key === "devops"
                          ? "🚀"
                          : cat.key === "mobile"
                            ? "📱"
                            : "🧩"}
                </div>
                <div>
                  <h2 className="text-a26-text m-0 text-base font-bold">
                    {cat.label}
                  </h2>
                  <div className="text-a26-muted text-[11px] mt-px">
                    {translate("win26.skills.stats", {
                      fav: cat.stacks.filter((s) => s.isFavorite).length,
                      learning: cat.stacks.filter((s) => s.isStudying).length,
                      total: cat.stacks.length,
                    })}
                  </div>
                </div>
              </div>

              {/* Skill rows with bar */}
              <div className="flex flex-col gap-3">
                {cat.stacks.map((s) => {
                  const level = skillLevel(s);
                  const name =
                    s.label ||
                    translate(`services.stack.${s.name}` as any) ||
                    s.name;
                  return (
                    <div key={s.name}>
                      {/* Name row */}
                      <div className="flex items-center min-w-0 gap-1.5 mb-1.25">
                        {s.isFavorite && (
                          <Star
                            size={10}
                            color={col}
                            fill={col}
                            className="shrink-0"
                          />
                        )}
                        <span
                          className="flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-xs"
                          style={{
                            fontWeight: s.isFavorite ? 600 : 400,
                            color: s.isFavorite
                              ? "var(--a26-text)"
                              : "var(--a26-text-mid)",
                          }}
                        >
                          {name}
                        </span>
                        {s.isStudying && (
                          <span
                            className="shrink-0 text-[9px] font-semibold rounded py-px px-1.25"
                            style={{
                              background:
                                "color-mix(in srgb, var(--a26-violet) 12%, transparent)",
                              color: "var(--a26-violet)",
                              border:
                                "1px solid color-mix(in srgb, var(--a26-violet) 25%, transparent)",
                            }}
                          >
                            {translate("win26.skills.learning")}
                          </span>
                        )}
                        <span className="text-a26-muted shrink-0 text-[10px] font-mono">
                          {level}%
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div className="bg-a26-glass overflow-hidden h-1.25 rounded-[3px]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${level}%` }}
                          transition={{
                            duration: 0.5,
                            ease: "easeOut",
                            delay: 0.05,
                          }}
                          className="h-full rounded-[3px]"
                          style={{
                            background: s.isStudying
                              ? "color-mix(in srgb, var(--a26-violet) 55%, transparent)"
                              : `linear-gradient(90deg, color-mix(in srgb, ${col} 70%, transparent) 0%, ${col} 100%)`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
