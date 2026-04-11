"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ResumeBuilder } from "@/screens/resume/resume";
import { useSettingsStore } from "@/stores/settings-store";
import type { Color } from "@/stores/settings-store";

interface ResumeModalProps {
  open: boolean;
  onClose: () => void;
  /** Year label shown as a badge in the header, e.g. 2025 */
  year?: number;
  /** Brand accent colour for the top border and interactive highlights */
  accentColor?: string;
  /** Seed the resume colour picker with this colour (defaults to store value) */
  defaultColor?: Color;
}

const DEFAULT_ACCENT = "#6366F1";

export function ResumeModal({
  open,
  onClose,
  year,
  accentColor = DEFAULT_ACCENT,
  defaultColor,
}: ResumeModalProps) {
  const [mounted, setMounted] = useState(false);
  const [closeHover, setCloseHover] = useState(false);

  const theme = useSettingsStore((s) => s.theme);
  const isDark = theme === "dark" || (
    theme === "system" &&
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  // Explicit neutral colours — bypasses the CSS color-theme variables on <html>
  const bg     = isDark ? "#0F172A" : "#FFFFFF";
  const border  = isDark ? "#1E293B" : "#E2E8F0";
  const titleColor  = isDark ? "#F1F5F9" : "#0F172A";
  const subColor    = isDark ? "#94A3B8" : "#64748B";
  const scrollBg    = isDark ? "#0F172A" : "#F8FAFC";

  useEffect(() => { setMounted(true); }, []);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="resume-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: "fixed", inset: 0, zIndex: 9998,
              backgroundColor: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(6px)",
            }}
          />

          {/* Centering shell */}
          <div
            style={{
              position: "fixed", inset: 0, zIndex: 9999,
              display: "flex", alignItems: "center", justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <motion.div
              key="resume-sheet"
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: "90vw", height: "90vh",
                borderRadius: "20px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                backgroundColor: bg,
                border: `1px solid ${border}`,
                borderTop: `3px solid ${accentColor}`,
                boxShadow: `0 40px 100px rgba(0,0,0,0.55), 0 0 0 1px ${accentColor}22`,
                pointerEvents: "all",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "14px 24px", flexShrink: 0,
                  backgroundColor: bg,
                  borderBottom: `1px solid ${border}`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {year && (
                    <span
                      style={{
                        fontSize: "11px", fontWeight: 700,
                        padding: "3px 10px", borderRadius: "99px",
                        backgroundColor: `${accentColor}18`,
                        color: accentColor,
                        border: `1px solid ${accentColor}44`,
                        letterSpacing: "0.04em",
                      }}
                    >
                      {year}
                    </span>
                  )}
                  <div>
                    <h2 style={{ fontSize: "17px", fontWeight: 700, color: titleColor, margin: 0, lineHeight: 1.3 }}>
                      Resume Builder
                    </h2>
                    <p style={{ fontSize: "12px", color: subColor, margin: "2px 0 0" }}>
                      Choose a template and theme, then export as PDF.
                    </p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  onMouseEnter={() => setCloseHover(true)}
                  onMouseLeave={() => setCloseHover(false)}
                  aria-label="Close"
                  style={{
                    width: "36px", height: "36px", borderRadius: "10px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: "none", cursor: "pointer",
                    backgroundColor: closeHover ? `${accentColor}18` : "transparent",
                    color: closeHover ? accentColor : subColor,
                    transition: "background-color 0.15s, color 0.15s",
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable content */}
              <div style={{ flex: 1, overflowY: "auto", backgroundColor: scrollBg }}>
                <ResumeBuilder defaultColor={defaultColor} />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
