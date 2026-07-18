"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useLanguageStore } from "@/stores/language-store";
import { useContent } from "@/lib/content/use-content";
import { rowsToTestimonials } from "@/lib/content/portfolio";
import { useC } from "../context";
import { useIsMobile } from "../hooks";
import { listAnim, itemAnim } from "../animation";
import { Label } from "../components/helpers";

export function TestimonialsSection() {
  const C = useC();
  const isMobile = useIsMobile();
  const locale = useLanguageStore((s) => s.language);
  const TESTIMONIALS = rowsToTestimonials(useContent("testimonials"), locale);
  return (
    <>
      <Label text="05 — Testimonials" />
      <h2
        style={{
          fontSize: isMobile ? "24px" : "34px",
          fontWeight: 900,
          letterSpacing: "-0.5px",
          margin: "4px 0 24px",
          color: C.textDark,
        }}
      >
        What They Say<span style={{ color: C.indigo }}>.</span>
      </h2>

      {TESTIMONIALS.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 20px",
            borderRadius: "16px",
            border: `1.5px dashed ${C.border}`,
            backgroundColor: C.card,
            gap: "12px",
            textAlign: "center",
          }}
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              backgroundColor: C.indigoLight,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Quote size={22} style={{ color: C.indigoDark }} />
          </motion.div>
          <p
            style={{
              fontWeight: 700,
              fontSize: "14px",
              color: C.textDark,
              margin: 0,
            }}
          >
            No testimonials yet
          </p>
          <p
            style={{
              fontSize: "12px",
              color: C.textMuted,
              margin: 0,
              maxWidth: "260px",
              lineHeight: 1.6,
            }}
          >
            Testimonials will appear here once collected.
          </p>
        </motion.div>
      ) : (
        <motion.div
          variants={listAnim}
          initial="initial"
          animate="animate"
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: "12px",
          }}
        >
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              variants={itemAnim}
              whileHover={{
                y: -3,
                boxShadow: `0 8px 28px rgba(225,29,72,0.12)`,
              }}
              style={{
                padding: "18px",
                borderRadius: "14px",
                border: `1px solid ${C.border}`,
                backgroundColor: C.card,
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div style={{ display: "flex", gap: "2px" }}>
                {Array.from({ length: 5 }).map((_, s) => (
                  <svg
                    key={s}
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill={s < Math.floor(t.rating) ? C.amber : C.border}
                    stroke="none"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <div style={{ position: "relative" }}>
                <Quote
                  size={16}
                  style={{
                    color: C.indigoLight,
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                />
                <p
                  style={{
                    fontSize: "12px",
                    lineHeight: 1.7,
                    color: C.textMid,
                    margin: 0,
                    paddingLeft: "20px",
                  }}
                >
                  {t.text}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  paddingTop: "4px",
                  borderTop: `1px solid ${C.border}`,
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${C.indigoDark}, ${C.indigo})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{ fontSize: "10px", fontWeight: 700, color: "#fff" }}
                  >
                    {t.avatar}
                  </span>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: C.textDark,
                      margin: 0,
                    }}
                  >
                    {t.name}
                  </p>
                  <p
                    style={{
                      fontSize: "10px",
                      color: C.textMuted,
                      margin: "1px 0 0",
                    }}
                  >
                    {t.role} · {t.company}
                  </p>
                </div>
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: "9px",
                    padding: "2px 8px",
                    borderRadius: "99px",
                    fontWeight: 600,
                    backgroundColor: C.mintLight,
                    color: C.mintDark,
                  }}
                >
                  {t.relationship}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </>
  );
}
