"use client";

import { motion } from "framer-motion";
import { useLanguageStore } from "@/stores/language-store";
import { useContent } from "@/lib/content/use-content";
import { rowsToLanguages } from "@/lib/content/portfolio";
import { useC } from "../context";
import { useIsMobile } from "../hooks";
import { listAnim, itemAnim } from "../animation";
import { LEVEL_PCT } from "../constants";
import { Label } from "../components/helpers";

function AnimatedBar({
  pct,
  accent,
  delay = 0,
}: {
  pct: number;
  accent: string;
  delay?: number;
}) {
  const C = useC();
  return (
    <div
      style={{
        height: "6px",
        borderRadius: "99px",
        backgroundColor: C.border,
        overflow: "hidden",
      }}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
        style={{ height: "100%", borderRadius: "99px", background: accent }}
      />
    </div>
  );
}

export function LanguagesSection() {
  const C = useC();
  const isMobile = useIsMobile();
  const locale = useLanguageStore((s) => s.language);
  const LANGUAGES = rowsToLanguages(useContent("languages"), locale);
  return (
    <>
      <Label text="06 — Languages" />
      <h2
        style={{
          fontSize: isMobile ? "24px" : "34px",
          fontWeight: 900,
          letterSpacing: "-0.5px",
          margin: "4px 0 8px",
          color: C.textDark,
        }}
      >
        Languages<span style={{ color: C.mint }}>.</span>
      </h2>
      <p
        style={{
          fontSize: "13px",
          color: C.textMuted,
          marginBottom: "28px",
          lineHeight: 1.6,
        }}
      >
        Spoken languages I use for communication and collaboration.
      </p>

      <motion.div
        variants={listAnim}
        initial="initial"
        animate="animate"
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
      >
        {LANGUAGES.map((l, i) => {
          const pct = LEVEL_PCT[l.level] ?? 50;
          return (
            <motion.div
              key={l.name}
              variants={itemAnim}
              whileHover={{ x: 3 }}
              style={{
                padding: "16px 18px",
                borderRadius: "14px",
                border: `1px solid ${C.border}`,
                backgroundColor: C.card,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "10px",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: C.textDark,
                      margin: 0,
                    }}
                  >
                    {l.name}
                  </p>
                  <p
                    style={{
                      fontSize: "11px",
                      color: C.textMuted,
                      margin: "2px 0 0",
                    }}
                  >
                    {l.nativeName}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: "10px",
                    padding: "3px 10px",
                    borderRadius: "99px",
                    fontWeight: 600,
                    backgroundColor: C.indigoLight,
                    color: C.indigoDark,
                  }}
                >
                  {l.level}
                </span>
              </div>
              <AnimatedBar
                pct={pct}
                delay={i * 0.1 + 0.2}
                accent={`linear-gradient(to right, ${C.indigoDark}, ${C.indigo})`}
              />
              <p
                style={{
                  fontSize: "11px",
                  color: C.textMuted,
                  margin: "8px 0 0",
                }}
              >
                {l.note}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </>
  );
}
