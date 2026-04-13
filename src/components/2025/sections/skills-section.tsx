"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SKILL_CATEGORIES } from "@/config";
import { translate } from "@/i18n";
import type { TxKeyPath } from "@/i18n";
import { useC } from "../context";
import { useIsMobile } from "../hooks";
import { listAnim, iconAnim, ease } from "../animation";
import { SKILL_TABS, SkillTab } from "../constants";
import { Label } from "../components/helpers";

export function SkillsSection({
  skillGroups,
}: {
  skillGroups: typeof SKILL_CATEGORIES;
}) {
  const C = useC();
  const isMobile = useIsMobile();
  const [tab, setTab] = useState<SkillTab>("backend");

  const grouped: Record<SkillTab, typeof SKILL_CATEGORIES> = {
    backend: skillGroups.filter((c) => c.key === "backend"),
    frontend: skillGroups.filter((c) => c.key === "frontend"),
    others: skillGroups.filter(
      (c) => c.key !== "backend" && c.key !== "frontend",
    ),
  };

  const activeTab = SKILL_TABS.find((t) => t.id === tab)!;
  const activeGroups = grouped[tab];

  return (
    <>
      <Label text="03 — Tech Stack" />
      <h2
        style={{
          fontSize: isMobile ? "24px" : "34px",
          fontWeight: 900,
          letterSpacing: "-0.5px",
          margin: "4px 0 20px",
          color: C.textDark,
        }}
      >
        Tech Stack<span style={{ color: C.amber }}>.</span>
      </h2>

      {/* Tab nav */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          marginBottom: "28px",
          padding: "5px",
          backgroundColor: "#0F172A",
          borderRadius: "14px",
        }}
      >
        {SKILL_TABS.map(({ id, label, accent }) => {
          const on = tab === id;
          return (
            <motion.button
              key={id}
              onClick={() => setTab(id)}
              whileTap={{ scale: 0.97 }}
              style={{
                flex: 1,
                padding: "10px 0",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 700,
                position: "relative",
                overflow: "hidden",
                background: on
                  ? `linear-gradient(135deg, ${accent}cc, ${accent})`
                  : "transparent",
                color: on ? "#fff" : "#64748B",
                boxShadow: on ? `0 4px 14px ${accent}66` : "none",
                transition: "all 0.2s",
              }}
            >
              {label}
            </motion.button>
          );
        })}
      </div>

      {/* Icon grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25, ease }}
        >
          {activeGroups.map((cat) => (
            <div key={cat.key} style={{ marginBottom: "20px" }}>
              {activeGroups.length > 1 && (
                <p
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: C.textMuted,
                    margin: "0 0 12px",
                  }}
                >
                  {cat.label}
                </p>
              )}
              <motion.div
                variants={listAnim}
                initial="initial"
                animate="animate"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))",
                  gap: "10px",
                }}
              >
                {cat.stacks.map((s) => {
                  const displayName = translate(
                    `services.stack.${s.name}` as TxKeyPath,
                  );
                  return (
                    <motion.div
                      key={s.name}
                      variants={iconAnim}
                      whileHover={{
                        scale: 1.07,
                        y: -3,
                        boxShadow: `0 8px 24px ${activeTab.glow}, 0 0 0 1px ${activeTab.accent}44`,
                      }}
                      whileTap={{ scale: 0.96 }}
                      title={displayName}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "10px",
                        padding: "18px 10px 14px",
                        borderRadius: "16px",
                        cursor: "default",
                        background: "#0F172A",
                        border: `1px solid rgba(255,255,255,0.06)`,
                        boxShadow: s.isFavorite
                          ? `0 0 0 1px ${activeTab.accent}44, 0 4px 16px ${activeTab.glow}`
                          : "none",
                        position: "relative",
                        overflow: "hidden",
                        transition: "box-shadow 0.2s",
                      }}
                    >
                      {/* Glow blob */}
                      <div
                        style={{
                          position: "absolute",
                          top: "8px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "52px",
                          height: "52px",
                          borderRadius: "50%",
                          background: activeTab.glow,
                          filter: "blur(16px)",
                          pointerEvents: "none",
                        }}
                      />

                      {/* Icon */}
                      <div
                        style={{
                          position: "relative",
                          width: "40px",
                          height: "40px",
                        }}
                      >
                        <img
                          src={s.icon as unknown as string}
                          alt={s.alt}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                        />
                      </div>

                      {/* Name */}
                      <p
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          textAlign: "center",
                          color: "#CBD5E1",
                          margin: 0,
                          lineHeight: 1.3,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "100%",
                        }}
                      >
                        {displayName}
                      </p>

                      {/* Favorite star */}
                      {s.isFavorite && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            delay: 0.1,
                            type: "spring",
                            stiffness: 400,
                          }}
                          style={{
                            position: "absolute",
                            top: "6px",
                            right: "6px",
                          }}
                        >
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill={C.amber}
                            stroke="none"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
