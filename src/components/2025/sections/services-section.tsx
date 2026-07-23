"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useLanguageStore } from "@/stores/language-store";
import { useContent } from "@/lib/content/use-content";
import { rowsToServices } from "@/lib/content/portfolio";
import { useC } from "../context";
import { useIsMobile } from "../hooks";
import { listAnim, itemAnim } from "../animation";
import { Label, StackChips } from "../components/helpers";

export function ServicesSection() {
  const C = useC();
  const isMobile = useIsMobile();
  const locale = useLanguageStore((s) => s.language);
  // Services carry stack references by name, so the mapper needs the skill rows
  // too in order to resolve them.
  const SERVICES = rowsToServices(
    useContent("services"),
    useContent("skills"),
    locale,
  );

  return (
    <>
      <Label text="04 — Services" />
      <h2
        style={{
          fontSize: isMobile ? "24px" : "34px",
          fontWeight: 900,
          letterSpacing: "-0.5px",
          margin: "4px 0 8px",
          color: C.textDark,
        }}
      >
        Services<span style={{ color: C.mint }}>.</span>
      </h2>
      <p
        style={{
          fontSize: "13px",
          color: C.textMuted,
          marginBottom: "28px",
          lineHeight: 1.6,
        }}
      >
        What I build, and how I can help.
      </p>

      <motion.div
        variants={listAnim}
        initial="initial"
        animate="animate"
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
      >
        {SERVICES.map((s) => (
          <motion.div
            key={s.title}
            variants={itemAnim}
            whileHover={{ x: 3 }}
            style={{
              padding: "18px 20px",
              borderRadius: "14px",
              border: `1px solid ${C.border}`,
              backgroundColor: C.card,
            }}
          >
            <p
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: C.textDark,
                margin: 0,
              }}
            >
              {s.title}
            </p>
            <p
              style={{
                fontSize: "12px",
                color: C.textMuted,
                margin: "6px 0 0",
                lineHeight: 1.65,
              }}
            >
              {s.description}
            </p>

            {s.subDetails && s.subDetails.length > 0 && (
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "12px 0 0",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                {s.subDetails.map((d) => (
                  <li
                    key={d}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "8px",
                      fontSize: "12px",
                      color: C.textMuted,
                      lineHeight: 1.5,
                    }}
                  >
                    <Check
                      size={13}
                      style={{ color: C.mintDark, flexShrink: 0, marginTop: 2 }}
                    />
                    {d}
                  </li>
                ))}
              </ul>
            )}

            <StackChips stack={s.stack?.map((t) => t.name)} />
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}
