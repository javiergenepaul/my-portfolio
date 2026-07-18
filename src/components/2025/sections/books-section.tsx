"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { useLanguageStore } from "@/stores/language-store";
import { useContent } from "@/lib/content/use-content";
import { rowsToBooks } from "@/lib/content/portfolio";
import { useC } from "../context";
import { useIsMobile } from "../hooks";
import { listAnim, itemAnim } from "../animation";
import { makeThemeColors } from "../constants";
import { Label } from "../components/helpers";

export function BooksSection() {
  const C = useC();
  const isMobile = useIsMobile();
  const locale = useLanguageStore((s) => s.language);
  const BOOKS = rowsToBooks(useContent("books"), locale);
  const THEME_COLORS = makeThemeColors(C);
  return (
    <>
      <Label text="07 — Books" />
      <h2
        style={{
          fontSize: isMobile ? "24px" : "34px",
          fontWeight: 900,
          letterSpacing: "-0.5px",
          margin: "4px 0 8px",
          color: C.textDark,
        }}
      >
        Books That Built Me<span style={{ color: C.amber }}>.</span>
      </h2>
      <p
        style={{
          fontSize: "13px",
          color: C.textMuted,
          marginBottom: "24px",
          lineHeight: 1.6,
        }}
      >
        A curated list of books that shaped the way I think, lead, and build.
      </p>

      <motion.div
        variants={listAnim}
        initial="initial"
        animate="animate"
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: "10px",
        }}
      >
        {BOOKS.map((b, i) => {
          const tc = THEME_COLORS[b.theme] ?? {
            bg: C.card,
            color: C.textMuted,
            border: C.border,
          };
          return (
            <motion.div
              key={i}
              variants={itemAnim}
              whileHover={{
                y: -4,
                boxShadow: `0 10px 30px ${tc.bg.replace("0.08", "0.25")}`,
              }}
              style={{
                padding: "16px",
                borderRadius: "14px",
                border: `1px solid ${C.border}`,
                backgroundColor: C.card,
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "8px",
                }}
              >
                <motion.div
                  whileHover={{ rotate: 8 }}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    backgroundColor: tc.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `1px solid ${tc.border}`,
                    flexShrink: 0,
                  }}
                >
                  <BookOpen size={16} style={{ color: tc.color }} />
                </motion.div>
                <span
                  style={{
                    fontSize: "9px",
                    fontWeight: 600,
                    padding: "3px 8px",
                    borderRadius: "99px",
                    backgroundColor: tc.bg,
                    color: tc.color,
                    border: `1px solid ${tc.border}`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {b.theme}
                </span>
              </div>
              <div>
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: C.textDark,
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  {b.title}
                </p>
                <p
                  style={{
                    fontSize: "11px",
                    color: C.textMuted,
                    margin: "2px 0 8px",
                  }}
                >
                  {b.author}
                </p>
                <p
                  style={{
                    fontSize: "11px",
                    color: C.textMid,
                    lineHeight: 1.6,
                    margin: 0,
                    fontStyle: "italic",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  &quot;{b.quote}&quot;
                </p>
              </div>
              <p
                style={{
                  fontSize: "11px",
                  color: C.textMuted,
                  lineHeight: 1.5,
                  margin: 0,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {b.reflection}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </>
  );
}
