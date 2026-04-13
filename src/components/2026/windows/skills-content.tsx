"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SKILL_CATEGORIES } from "@/config";
import { translate } from "@/i18n";
import { MAC_FONT } from "../constants";
import { useAurora } from "../use-aurora";
import { hexRgb } from "../utils";

export function SkillsContent() {
  const A = useAurora();
  const [active, setActive] = useState(SKILL_CATEGORIES[0]?.key ?? "");
  const cat = SKILL_CATEGORIES.find((c) => c.key === active);
  const ACCENT = [A.teal, A.violet, A.green, A.blue, "#FBBF24", "#FB7185"];

  return (
    <div style={{ display: "flex", height: "100%", fontFamily: MAC_FONT }}>
      <div
        style={{
          width: 170,
          flexShrink: 0,
          background: A.sidebar,
          borderRight: `1px solid ${A.glassBorder}`,
          padding: "12px 6px",
          overflowY: "auto",
          scrollbarWidth: "none",
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: A.textMuted,
            padding: "0 8px 8px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Categories
        </div>
        {SKILL_CATEGORIES.map((c, i) => {
          const col = ACCENT[i % ACCENT.length];
          return (
            <button
              key={c.key}
              onClick={() => setActive(c.key)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                padding: "7px 9px",
                borderRadius: 6,
                border: "none",
                background:
                  active === c.key
                    ? `rgba(${hexRgb(col)},0.12)`
                    : "transparent",
                color: active === c.key ? col : A.textMid,
                fontSize: 12,
                cursor: "pointer",
                fontFamily: MAC_FONT,
              }}
            >
              <span>{c.label}</span>
              <span style={{ fontSize: 10, opacity: 0.55 }}>
                {c.stacks.length}
              </span>
            </button>
          );
        })}
      </div>
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "18px 22px",
          scrollbarWidth: "none",
        }}
      >
        {cat && (
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <h2
                style={{
                  margin: "0 0 14px",
                  fontSize: 15,
                  fontWeight: 700,
                  color: A.text,
                }}
              >
                {cat.label}{" "}
                <span
                  style={{ fontSize: 12, color: A.textMuted, fontWeight: 400 }}
                >
                  ({cat.stacks.length} technologies)
                </span>
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {cat.stacks.map((s) => {
                  const col =
                    ACCENT[
                      SKILL_CATEGORIES.findIndex((c) => c.key === active) %
                        ACCENT.length
                    ];
                  return (
                    <div
                      key={s.name}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        background: A.card,
                        border: `1px solid ${A.cardBorder}`,
                        borderRadius: 7,
                        padding: "5px 11px",
                        fontSize: 12,
                        color: A.text,
                        transition: "border-color 0.14s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.borderColor = `rgba(${hexRgb(col)},0.35)`)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.borderColor = A.cardBorder)
                      }
                    >
                      {s.isFavorite && (
                        <div
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background: col,
                            boxShadow: `0 0 5px ${col}`,
                            flexShrink: 0,
                          }}
                        />
                      )}
                      {translate(`services.stack.${s.name}` as any) || s.name}
                      {s.isStudying && (
                        <span
                          style={{
                            fontSize: 9,
                            color: A.textMuted,
                            background: A.glass,
                            borderRadius: 3,
                            padding: "0 3px",
                          }}
                        >
                          learning
                        </span>
                      )}
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
