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
import { RESUME_COLORS, RESUME_SWATCHES } from "../constants";
import { useIsDark } from "../use-aurora";
import { useIsMobile } from "../hooks";

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
  const isSystemDark = useIsDark();
  const isMobile = useIsMobile();
  type ResumeMode = "simple" | "modern";
  const [mode, setMode] = useState<ResumeMode>("modern");
  const [isDark, setIsDark] = useState(true);
  const [color, setColor] = useState<Color>("azure");
  const [zoom, setZoom] = useState(0.55);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const sectionLabelCls = "text-a26-muted font-mac block mb-2";
  const sectionLabelStyle = {
    fontSize: 9,
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: "0.10em",
  };

  const mobileToolbar = isMobile && (
    <div
      className="win26-scroll shrink-0 border-b bg-a26-sidebar border-a26-glass-border flex items-center"
      style={{
        padding: "10px 12px",
        gap: 10,
        overflowX: "auto",
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(255,255,255,0.18) transparent",
      }}
    >
      {[
        { v: "modern" as const, label: "Modern" },
        { v: "simple" as const, label: "Simple" },
      ].map((opt) => (
        <button
          key={opt.v}
          onClick={() => setMode(opt.v)}
          className="font-mac shrink-0"
          style={{
            padding: "5px 12px",
            borderRadius: 20,
            border: `1.5px solid ${mode === opt.v ? "var(--a26-teal)" : "var(--a26-glass-border)"}`,
            background: mode === opt.v ? "color-mix(in srgb, var(--a26-teal) 10%, transparent)" : "transparent",
            color: mode === opt.v ? "var(--a26-teal)" : "var(--a26-text-mid)",
            fontSize: 12,
            fontWeight: mode === opt.v ? 600 : 400,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {opt.label}
        </button>
      ))}
      <div className="shrink-0 bg-a26-glass-border" style={{ width: 1, height: 18 }} />
      {[
        { v: false, icon: <Sun size={12} />, label: "Light" },
        { v: true, icon: <Moon size={12} />, label: "Dark" },
      ].map((opt) => (
        <button
          key={String(opt.v)}
          onClick={() => setIsDark(opt.v)}
          className="font-mac shrink-0"
          style={{
            display: "flex", alignItems: "center", gap: 4,
            padding: "5px 10px",
            borderRadius: 20,
            border: `1.5px solid ${isDark === opt.v ? "var(--a26-blue)" : "var(--a26-glass-border)"}`,
            background: isDark === opt.v ? "color-mix(in srgb, var(--a26-blue) 10%, transparent)" : "transparent",
            color: isDark === opt.v ? "var(--a26-blue)" : "var(--a26-text-mid)",
            fontSize: 12, cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {opt.icon} {opt.label}
        </button>
      ))}
      <div className="shrink-0 bg-a26-glass-border" style={{ width: 1, height: 18 }} />
      {RESUME_SWATCHES.map((s) => (
        <button
          key={s.value}
          onClick={() => setColor(s.value)}
          title={s.label}
          className="shrink-0"
          style={{
            width: 20, height: 20, borderRadius: "50%",
            border: "none", background: s.hex, cursor: "pointer",
            outline: "none",
            boxShadow: color === s.value ? `0 0 0 2px ${isSystemDark ? "#1C1C1C" : "#F5F5F5"}, 0 0 0 3.5px ${s.hex}` : "none",
            transform: color === s.value ? "scale(1.2)" : "scale(1)",
            transition: "transform 0.13s, box-shadow 0.13s",
          }}
        />
      ))}
      <div className="shrink-0 bg-a26-glass-border" style={{ width: 1, height: 18 }} />
      <button
        onClick={handleExport}
        className="font-mac flex items-center shrink-0"
        style={{
          gap: 5,
          padding: "5px 12px", borderRadius: 20, border: "none",
          background: colors.primary, color: colors.text,
          fontSize: 12, fontWeight: 600, cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        <Download size={11} /> Export
      </button>
    </div>
  );

  return (
    <div
      className="font-mac flex-1 min-h-0 overflow-hidden flex"
      style={{ flexDirection: isMobile ? "column" : "row" }}
    >
      {mobileToolbar}

      {/* ── Controls sidebar (desktop only) ── */}
      {!isMobile && (
        <div
          className="win26-scroll shrink-0 bg-a26-sidebar border-r border-a26-glass-border flex flex-col overflow-y-auto"
          style={{
            width: 218,
            padding: "16px 14px",
            gap: 20,
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.18) transparent",
          }}
        >
          {/* Template */}
          <div>
            <span className={sectionLabelCls} style={sectionLabelStyle}>Template</span>
            <div className="flex flex-col" style={{ gap: 5 }}>
              {[
                { v: "modern" as ResumeMode, icon: <Sparkles size={12} />, label: "Modern", desc: "Styled sidebar" },
                { v: "simple" as ResumeMode, icon: <LayoutTemplate size={12} />, label: "Simple", desc: "Classic & clean" },
              ].map((opt) => (
                <button
                  key={opt.v}
                  onClick={() => setMode(opt.v)}
                  className="font-mac flex items-center"
                  style={{
                    gap: 9,
                    padding: "8px 10px",
                    borderRadius: 8,
                    cursor: "pointer",
                    border: `1px solid ${mode === opt.v ? "color-mix(in srgb, var(--a26-teal) 40%, transparent)" : "var(--a26-glass-border)"}`,
                    background: mode === opt.v ? "color-mix(in srgb, var(--a26-teal) 8%, transparent)" : "var(--a26-glass)",
                    transition: "all 0.14s",
                    textAlign: "left",
                  }}
                >
                  <span style={{ color: mode === opt.v ? "var(--a26-teal)" : "var(--a26-text-muted)" }}>
                    {opt.icon}
                  </span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: mode === opt.v ? "var(--a26-text)" : "var(--a26-text-mid)" }}>
                      {opt.label}
                    </div>
                    <div className="text-a26-muted" style={{ fontSize: 10 }}>{opt.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Appearance */}
          <div>
            <span className={sectionLabelCls} style={sectionLabelStyle}>Appearance</span>
            <div className="flex" style={{ gap: 6 }}>
              {[
                { v: false, icon: <Sun size={13} />, label: "Light" },
                { v: true, icon: <Moon size={13} />, label: "Dark" },
              ].map((opt) => (
                <button
                  key={String(opt.v)}
                  onClick={() => setIsDark(opt.v)}
                  className="font-mac flex-1 flex flex-col items-center"
                  style={{
                    gap: 5,
                    padding: "9px 6px",
                    borderRadius: 8,
                    cursor: "pointer",
                    border: `1px solid ${isDark === opt.v ? "color-mix(in srgb, var(--a26-blue) 40%, transparent)" : "var(--a26-glass-border)"}`,
                    background: isDark === opt.v ? "color-mix(in srgb, var(--a26-blue) 8%, transparent)" : "var(--a26-glass)",
                    transition: "all 0.14s",
                  }}
                >
                  <span style={{ color: isDark === opt.v ? "var(--a26-blue)" : "var(--a26-text-muted)" }}>
                    {opt.icon}
                  </span>
                  <span style={{ fontSize: 11, color: isDark === opt.v ? "var(--a26-text)" : "var(--a26-text-muted)" }}>
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <span className={sectionLabelCls} style={sectionLabelStyle}>Accent Color</span>
            <div className="flex flex-wrap" style={{ gap: 8 }}>
              {RESUME_SWATCHES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setColor(s.value)}
                  title={s.label}
                  className="flex items-center justify-center"
                  style={{
                    width: 24, height: 24, borderRadius: "50%",
                    border: "none", background: s.hex, cursor: "pointer", outline: "none",
                    boxShadow: color === s.value
                      ? `0 0 0 2px ${isSystemDark ? "#1C1C1C" : "#F5F5F5"}, 0 0 0 3.5px ${s.hex}`
                      : "none",
                    transform: color === s.value ? "scale(1.18)" : "scale(1)",
                    transition: "transform 0.13s, box-shadow 0.13s",
                  }}
                >
                  {color === s.value && <Check size={11} color="#fff" strokeWidth={3} />}
                </button>
              ))}
            </div>
            <div className="text-a26-muted" style={{ fontSize: 11, marginTop: 7, textTransform: "capitalize" }}>
              {color}
            </div>
          </div>

          {/* Export — pinned to bottom */}
          <div className="flex flex-col" style={{ marginTop: "auto", gap: 10 }}>
            <button
              onClick={handleExport}
              className="font-mac flex items-center justify-center w-full"
              style={{
                gap: 7, padding: "9px 0", borderRadius: 9, border: "none",
                background: colors.primary, color: colors.text,
                fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}
            >
              <Download size={14} /> Export PDF
            </button>
            <div
              className="bg-a26-glass border border-a26-glass-border"
              style={{ fontSize: 10, color: "var(--a26-text-muted)", lineHeight: 1.65, padding: "8px 10px", borderRadius: 7 }}
            >
              <div style={{ fontWeight: 600, color: "var(--a26-text-mid)", marginBottom: 3 }}>Tips</div>
              Select <b style={{ color: "var(--a26-text)" }}>Save as PDF</b>, margins →{" "}
              <b style={{ color: "var(--a26-text)" }}>None</b>, enable{" "}
              <b style={{ color: "var(--a26-text)" }}>Background graphics</b>.
            </div>
          </div>
        </div>
      )}

      {/* ── Preview panel ── */}
      <div
        ref={containerRef}
        className="flex-1 flex flex-col overflow-hidden"
        style={{ background: isSystemDark ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0.07)" }}
      >
        {/* Zoom toolbar */}
        <div
          className="shrink-0 flex items-center border-b bg-a26-title-bar border-a26-glass-border"
          style={{ gap: 2, padding: "6px 12px" }}
        >
          <button
            onClick={() => stepZoom(-0.1)}
            className="text-a26-muted flex items-center justify-center"
            style={{ width: 26, height: 22, borderRadius: 5, border: "none", background: "transparent", cursor: "pointer" }}
          >
            <ZoomOut size={13} />
          </button>
          <button
            onClick={resetZoom}
            className="text-a26-mid"
            style={{ padding: "0 6px", height: 22, borderRadius: 5, border: "none", background: "transparent", fontSize: 11, fontFamily: "monospace", cursor: "pointer" }}
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            onClick={() => stepZoom(0.1)}
            className="text-a26-muted flex items-center justify-center"
            style={{ width: 26, height: 22, borderRadius: 5, border: "none", background: "transparent", cursor: "pointer" }}
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
            scrollbarColor: "var(--a26-glass-border) transparent",
          }}
        >
          <div className="flex justify-center">
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
