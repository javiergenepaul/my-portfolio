"use client";

import { useState, useLayoutEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  Sun,
  Moon,
  Check,
  ZoomIn,
  ZoomOut,
  Download,
  Sparkles,
  LayoutTemplate,
} from "lucide-react";
import type { Color } from "@/stores";
import { MAC_FONT, RESUME_COLORS, RESUME_SWATCHES } from "../constants";
import { useAurora, useIsDark } from "../use-aurora";
import { useIsMobile } from "../hooks";
import { hexRgb } from "../utils";

const ResumeSimple = dynamic(
  () =>
    import("@/screens/2024/resume/templates/simple-template").then((m) => ({
      default: m.SimpleTemplate,
    })),
  {
    ssr: false,
    loading: () => (
      <div style={{ width: 794, height: 600, background: "#f5f5f5" }} />
    ),
  },
);
const ResumeModern = dynamic(
  () =>
    import("@/screens/2024/resume/templates/modern-template").then((m) => ({
      default: m.ModernTemplate,
    })),
  {
    ssr: false,
    loading: () => (
      <div style={{ width: 794, height: 600, background: "#1a1a1a" }} />
    ),
  },
);

export function ResumeContent() {
  const A = useAurora();
  const isSystemDark = useIsDark();
  const isMobile = useIsMobile();
  type ResumeMode = "simple" | "modern";
  const [mode, setMode] = useState<ResumeMode>("modern");
  const [isDark, setIsDark] = useState(true);
  const [color, setColor] = useState<Color>("azure");
  const [zoom, setZoom] = useState(0.55);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-fit zoom to available preview width on mount
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const w = containerRef.current.clientWidth - 48;
    if (w > 0)
      setZoom(Math.min(0.85, Math.max(0.3, Math.floor((w / 794) * 100) / 100)));
  }, []);

  const colors = RESUME_COLORS[color];
  const stepZoom = (d: number) =>
    setZoom((z) => Math.min(1.2, Math.max(0.3, Math.round((z + d) * 10) / 10)));
  const resetZoom = () => {
    if (!containerRef.current) return;
    const w = containerRef.current.clientWidth - 48;
    setZoom(Math.min(0.85, Math.max(0.3, Math.floor((w / 794) * 100) / 100)));
  };

  const handleExport = useCallback(() => {
    const el = document.getElementById("resume-preview-2026");
    if (!el) return;

    // Clone and strip the zoom transform — printing the scaled-down preview
    // would add white margins; we want the natural 794px-wide 1:1 render.
    const clone = el.cloneNode(true) as HTMLElement;
    clone.style.transform = "none";
    clone.style.marginBottom = "0";
    clone.style.boxShadow = "none";
    clone.style.width = "794px";

    const styles = [
      ...Array.from(document.querySelectorAll("style")).map((s) => s.outerHTML),
      ...Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(
        (l) => l.outerHTML,
      ),
    ].join("\n");
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><base href="${window.location.origin}/">${styles}<style>*,*::before,*::after{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}@page{size:A4 portrait;margin:0}html,body{margin:0;padding:0}</style></head><body>${clone.outerHTML}</body><script>window.onload=function(){setTimeout(function(){window.print();window.close()},300)}<\/script></html>`;
    const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }, []);

  const sectionLabel: React.CSSProperties = {
    fontSize: 9,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.10em",
    color: A.textMuted,
    marginBottom: 8,
    display: "block",
  };

  const mobileToolbar = isMobile && (
    <div
      style={{
        flexShrink: 0,
        borderBottom: `1px solid ${A.glassBorder}`,
        background: A.sidebar,
        padding: "10px 12px",
        display: "flex",
        gap: 10,
        alignItems: "center",
        overflowX: "auto",
        scrollbarWidth: "none",
      }}
    >
      {/* Template pills */}
      {[
        { v: "modern" as const, label: "Modern" },
        { v: "simple" as const, label: "Simple" },
      ].map((opt) => (
        <button
          key={opt.v}
          onClick={() => setMode(opt.v)}
          style={{
            padding: "5px 12px",
            borderRadius: 20,
            border: `1.5px solid ${mode === opt.v ? A.teal : A.glassBorder}`,
            background: mode === opt.v ? `rgba(${hexRgb(A.teal)},0.10)` : "transparent",
            color: mode === opt.v ? A.teal : A.textMid,
            fontSize: 12,
            fontWeight: mode === opt.v ? 600 : 400,
            cursor: "pointer",
            fontFamily: MAC_FONT,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {opt.label}
        </button>
      ))}
      <div style={{ width: 1, height: 18, background: A.glassBorder, flexShrink: 0 }} />
      {/* Dark/Light toggle */}
      {[
        { v: false, icon: <Sun size={12} />, label: "Light" },
        { v: true, icon: <Moon size={12} />, label: "Dark" },
      ].map((opt) => (
        <button
          key={String(opt.v)}
          onClick={() => setIsDark(opt.v)}
          style={{
            display: "flex", alignItems: "center", gap: 4,
            padding: "5px 10px",
            borderRadius: 20,
            border: `1.5px solid ${isDark === opt.v ? A.blue : A.glassBorder}`,
            background: isDark === opt.v ? `rgba(${hexRgb(A.blue)},0.10)` : "transparent",
            color: isDark === opt.v ? A.blue : A.textMid,
            fontSize: 12, cursor: "pointer", fontFamily: MAC_FONT,
            whiteSpace: "nowrap", flexShrink: 0,
          }}
        >
          {opt.icon} {opt.label}
        </button>
      ))}
      <div style={{ width: 1, height: 18, background: A.glassBorder, flexShrink: 0 }} />
      {/* Color swatches */}
      {RESUME_SWATCHES.map((s) => (
        <button
          key={s.value}
          onClick={() => setColor(s.value)}
          title={s.label}
          style={{
            width: 20, height: 20, borderRadius: "50%",
            border: "none", background: s.hex, cursor: "pointer",
            outline: "none", flexShrink: 0,
            boxShadow: color === s.value ? `0 0 0 2px ${isSystemDark ? "#1C1C1C" : "#F5F5F5"}, 0 0 0 3.5px ${s.hex}` : "none",
            transform: color === s.value ? "scale(1.2)" : "scale(1)",
            transition: "transform 0.13s, box-shadow 0.13s",
          }}
        />
      ))}
      <div style={{ width: 1, height: 18, background: A.glassBorder, flexShrink: 0 }} />
      <button
        onClick={handleExport}
        style={{
          display: "flex", alignItems: "center", gap: 5,
          padding: "5px 12px", borderRadius: 20, border: "none",
          background: colors.primary, color: colors.text,
          fontSize: 12, fontWeight: 600, cursor: "pointer",
          fontFamily: MAC_FONT, whiteSpace: "nowrap", flexShrink: 0,
        }}
      >
        <Download size={11} /> Export
      </button>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", flex: 1, minHeight: 0, overflow: "hidden", fontFamily: MAC_FONT }}>
      {mobileToolbar}
      {/* ── Controls sidebar (desktop only) ── */}
      {!isMobile && <div
        style={{
          width: 218,
          flexShrink: 0,
          background: A.sidebar,
          borderRight: `1px solid ${A.glassBorder}`,
          padding: "16px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
          overflowY: "auto",
          scrollbarWidth: "none",
        }}
      >
        {/* Template */}
        <div>
          <span style={sectionLabel}>Template</span>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {[
              {
                v: "modern" as ResumeMode,
                icon: <Sparkles size={12} />,
                label: "Modern",
                desc: "Styled sidebar",
              },
              {
                v: "simple" as ResumeMode,
                icon: <LayoutTemplate size={12} />,
                label: "Simple",
                desc: "Classic & clean",
              },
            ].map((opt) => (
              <button
                key={opt.v}
                onClick={() => setMode(opt.v)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  padding: "8px 10px",
                  borderRadius: 8,
                  cursor: "pointer",
                  border: `1px solid ${mode === opt.v ? `rgba(${hexRgb(A.teal)},0.40)` : A.glassBorder}`,
                  background:
                    mode === opt.v ? `rgba(${hexRgb(A.teal)},0.08)` : A.glass,
                  transition: "all 0.14s",
                  fontFamily: MAC_FONT,
                  textAlign: "left",
                }}
              >
                <span style={{ color: mode === opt.v ? A.teal : A.textMuted }}>
                  {opt.icon}
                </span>
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: mode === opt.v ? A.text : A.textMid,
                    }}
                  >
                    {opt.label}
                  </div>
                  <div style={{ fontSize: 10, color: A.textMuted }}>
                    {opt.desc}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Appearance */}
        <div>
          <span style={sectionLabel}>Appearance</span>
          <div style={{ display: "flex", gap: 6 }}>
            {[
              { v: false, icon: <Sun size={13} />, label: "Light" },
              { v: true, icon: <Moon size={13} />, label: "Dark" },
            ].map((opt) => (
              <button
                key={String(opt.v)}
                onClick={() => setIsDark(opt.v)}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 5,
                  padding: "9px 6px",
                  borderRadius: 8,
                  cursor: "pointer",
                  border: `1px solid ${isDark === opt.v ? `rgba(${hexRgb(A.blue)},0.40)` : A.glassBorder}`,
                  background:
                    isDark === opt.v ? `rgba(${hexRgb(A.blue)},0.08)` : A.glass,
                  transition: "all 0.14s",
                  fontFamily: MAC_FONT,
                }}
              >
                <span
                  style={{ color: isDark === opt.v ? A.blue : A.textMuted }}
                >
                  {opt.icon}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: isDark === opt.v ? A.text : A.textMuted,
                  }}
                >
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div>
          <span style={sectionLabel}>Accent Color</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {RESUME_SWATCHES.map((s) => (
              <button
                key={s.value}
                onClick={() => setColor(s.value)}
                title={s.label}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  border: "none",
                  background: s.hex,
                  cursor: "pointer",
                  outline: "none",
                  boxShadow:
                    color === s.value
                      ? `0 0 0 2px ${isSystemDark ? "#1C1C1C" : "#F5F5F5"}, 0 0 0 3.5px ${s.hex}`
                      : "none",
                  transform: color === s.value ? "scale(1.18)" : "scale(1)",
                  transition: "transform 0.13s, box-shadow 0.13s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {color === s.value && (
                  <Check size={11} color="#fff" strokeWidth={3} />
                )}
              </button>
            ))}
          </div>
          <div
            style={{
              fontSize: 11,
              color: A.textMuted,
              marginTop: 7,
              textTransform: "capitalize",
            }}
          >
            {color}
          </div>
        </div>

        {/* Export — pinned to bottom */}
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <button
            onClick={handleExport}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              padding: "9px 0",
              borderRadius: 9,
              border: "none",
              background: colors.primary,
              color: colors.text,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: MAC_FONT,
            }}
          >
            <Download size={14} /> Export PDF
          </button>
          <div
            style={{
              fontSize: 10,
              color: A.textMuted,
              lineHeight: 1.65,
              padding: "8px 10px",
              background: A.glass,
              borderRadius: 7,
              border: `1px solid ${A.glassBorder}`,
            }}
          >
            <div style={{ fontWeight: 600, color: A.textMid, marginBottom: 3 }}>
              Tips
            </div>
            Select <b style={{ color: A.text }}>Save as PDF</b>, margins →{" "}
            <b style={{ color: A.text }}>None</b>, enable{" "}
            <b style={{ color: A.text }}>Background graphics</b>.
          </div>
        </div>
      </div>}

      {/* ── Preview panel ── */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          background: isSystemDark ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0.07)",
        }}
      >
        {/* Zoom toolbar */}
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: 2,
            padding: "6px 12px",
            borderBottom: `1px solid ${A.glassBorder}`,
            background: A.titleBar,
          }}
        >
          <button
            onClick={() => stepZoom(-0.1)}
            style={{
              width: 26,
              height: 22,
              borderRadius: 5,
              border: "none",
              background: "transparent",
              color: A.textMuted,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ZoomOut size={13} />
          </button>
          <button
            onClick={resetZoom}
            style={{
              padding: "0 6px",
              height: 22,
              borderRadius: 5,
              border: "none",
              background: "transparent",
              color: A.textMid,
              fontSize: 11,
              fontFamily: "monospace",
              cursor: "pointer",
            }}
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            onClick={() => stepZoom(0.1)}
            style={{
              width: 26,
              height: 22,
              borderRadius: 5,
              border: "none",
              background: "transparent",
              color: A.textMuted,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ZoomIn size={13} />
          </button>
        </div>

        {/* Scrollable resume */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            overflowX: "auto",
            padding: "20px",
            scrollbarWidth: "thin",
            scrollbarColor: `${A.glassBorder} transparent`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              id="resume-preview-2026"
              style={{
                width: 794,
                transformOrigin: "top center",
                transform: `scale(${zoom})`,
                marginBottom: `${-(794 * (1 - zoom))}px`,
                boxShadow: "0 16px 52px rgba(0,0,0,0.65)",
                overflow: "hidden",
              }}
            >
              {mode === "simple" ? (
                <ResumeSimple colors={colors} isDark={isDark} />
              ) : (
                <ResumeModern colors={colors} isDark={isDark} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
