"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import { SKILL_CATEGORIES } from "@/config";
import { translate } from "@/i18n";
import { MAC_FONT } from "../constants";
import { useAurora } from "../use-aurora";
import { useIsMobile } from "../hooks";
import { hexRgb } from "../utils";

const ACCENT = (A: ReturnType<typeof useAurora>) => [
  A.teal, A.violet, A.green, A.blue, "#FBBF24", "#FB7185",
];

export function SkillsContent() {
  const A = useAurora();
  const isMobile = useIsMobile();
  const COLORS = ACCENT(A);
  const [active, setActive] = useState(SKILL_CATEGORIES[0]?.key ?? "");
  const cat = SKILL_CATEGORIES.find((c) => c.key === active);
  const catIdx = SKILL_CATEGORIES.findIndex((c) => c.key === active);
  const col = COLORS[catIdx % COLORS.length];

  const skillLevel = (s: { isFavorite?: boolean; isStudying?: boolean }) =>
    s.isFavorite ? 90 : s.isStudying ? 35 : 68;

  const categoryTabs = (
    <>
      {SKILL_CATEGORIES.map((c, i) => {
        const color = COLORS[i % COLORS.length];
        const isActive = active === c.key;
        return (
          <button
            key={c.key}
            onClick={() => setActive(c.key)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: isMobile ? "6px 12px" : "8px 10px",
              borderRadius: isMobile ? 20 : 7,
              border: isMobile
                ? `1.5px solid ${isActive ? color : A.glassBorder}`
                : "none",
              background: isActive ? `rgba(${hexRgb(color)},0.13)` : "transparent",
              color: isActive ? color : A.textMid,
              fontSize: 12,
              fontWeight: isActive ? 600 : 400,
              cursor: "pointer",
              fontFamily: MAC_FONT,
              transition: "all 0.12s",
              whiteSpace: "nowrap",
              flexShrink: 0,
              ...(isMobile ? {} : { width: "100%", justifyContent: "space-between", textAlign: "left" }),
            }}
          >
            <span>{c.label}</span>
            <span
              style={{
                fontSize: 10,
                background: isActive ? `rgba(${hexRgb(color)},0.18)` : A.glass,
                color: isActive ? color : A.textMuted,
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
    <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", flex: 1, minHeight: 0, overflow: "hidden", fontFamily: MAC_FONT }}>
      {/* Mobile: horizontal scroll strip / Desktop: sidebar */}
      {isMobile ? (
        <div
          style={{
            flexShrink: 0,
            overflowX: "auto",
            scrollbarWidth: "none",
            display: "flex",
            gap: 6,
            padding: "10px 12px",
            borderBottom: `1px solid ${A.glassBorder}`,
            background: A.sidebar,
          }}
        >
          {categoryTabs}
        </div>
      ) : (
        <div
          style={{
            width: 180,
            flexShrink: 0,
            background: A.sidebar,
            borderRight: `1px solid ${A.glassBorder}`,
            padding: "14px 8px",
            overflowY: "auto",
            scrollbarWidth: "none",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: A.textMuted,
              padding: "0 8px 10px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Categories
          </div>
          {categoryTabs}
        </div>
      )}

      {/* Main content */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          padding: "20px 22px",
          scrollbarWidth: "none",
        }}
      >
        {cat && (
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {/* Category header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 18,
                  paddingBottom: 14,
                  borderBottom: `1px solid ${A.glassBorder}`,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 9,
                    background: `rgba(${hexRgb(col)},0.13)`,
                    border: `1px solid rgba(${hexRgb(col)},0.25)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                  }}
                >
                  {cat.key === "frontend" ? "🎨" : cat.key === "backend" ? "⚙️" : cat.key === "database" ? "🗄️" : cat.key === "devops" ? "🚀" : cat.key === "mobile" ? "📱" : "🧩"}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: A.text }}>
                    {cat.label}
                  </h2>
                  <div style={{ fontSize: 11, color: A.textMuted, marginTop: 1 }}>
                    {cat.stacks.filter((s) => s.isFavorite).length} favorite · {cat.stacks.filter((s) => s.isStudying).length} learning · {cat.stacks.length} total
                  </div>
                </div>
              </div>

              {/* Skill rows with bar */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {cat.stacks.map((s) => {
                  const level = skillLevel(s);
                  const name = translate(`services.stack.${s.name}` as any) || s.name;
                  return (
                    <div key={s.name}>
                      {/* Name row */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          marginBottom: 5,
                          minWidth: 0,
                        }}
                      >
                        {s.isFavorite && (
                          <Star size={10} color={col} fill={col} style={{ flexShrink: 0 }} />
                        )}
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: s.isFavorite ? 600 : 400,
                            color: s.isFavorite ? A.text : A.textMid,
                            flex: 1,
                            minWidth: 0,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {name}
                        </span>
                        {s.isStudying && (
                          <span
                            style={{
                              fontSize: 9,
                              fontWeight: 600,
                              background: `rgba(${hexRgb(A.violet)},0.12)`,
                              color: A.violet,
                              border: `1px solid rgba(${hexRgb(A.violet)},0.25)`,
                              borderRadius: 4,
                              padding: "1px 5px",
                              flexShrink: 0,
                            }}
                          >
                            learning
                          </span>
                        )}
                        <span style={{ fontSize: 10, color: A.textMuted, fontFamily: "monospace", flexShrink: 0 }}>
                          {level}%
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div
                        style={{
                          height: 5,
                          borderRadius: 3,
                          background: A.glass,
                          overflow: "hidden",
                        }}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${level}%` }}
                          transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
                          style={{
                            height: "100%",
                            borderRadius: 3,
                            background: s.isStudying
                              ? `rgba(${hexRgb(A.violet)},0.55)`
                              : `linear-gradient(90deg, rgba(${hexRgb(col)},0.7) 0%, ${col} 100%)`,
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
