"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const calc = () => {
      const w = el.clientWidth - (isMobile ? 24 : 48);
      if (w > 0)
        setZoom(Math.min(isMobile ? 0.9 : 0.85, Math.max(0.3, Math.floor((w / 794) * 100) / 100)));
    };
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isMobile]);

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

  const sectionLabelCls = "text-a26-muted font-mac block mb-2 text-[9px] font-bold tracking-[0.10em] uppercase";

  const mobileToolbar = isMobile && (
    <div
      className="win26-scroll shrink-0 border-b bg-a26-sidebar border-a26-glass-border flex items-center overflow-x-auto [scrollbar-width:thin] py-2.5 px-3 gap-2.5"
      style={{ scrollbarColor: "rgba(255,255,255,0.18) transparent" }}
    >
      {/* Zoom — leftmost */}
      <div className="shrink-0 flex items-center bg-a26-glass border border-a26-glass-border rounded-[20px] overflow-hidden">
        <button
          onClick={() => stepZoom(-0.1)}
          className="text-a26-muted flex items-center justify-center cursor-pointer border-none bg-transparent w-7 h-7"
          aria-label="Zoom out"
        >
          <ZoomOut size={12} />
        </button>
        <span className="text-a26-mid font-mono text-[11px] select-none min-w-8 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => stepZoom(0.1)}
          className="text-a26-muted flex items-center justify-center cursor-pointer border-none bg-transparent w-7 h-7"
          aria-label="Zoom in"
        >
          <ZoomIn size={12} />
        </button>
      </div>
      <div className="shrink-0 bg-a26-glass-border w-px h-4.5" />
      {[
        { v: "modern" as const, label: "Modern" },
        { v: "simple" as const, label: "Simple" },
      ].map((opt) => (
        <button
          key={opt.v}
          onClick={() => setMode(opt.v)}
          className="font-mac shrink-0 text-xs whitespace-nowrap cursor-pointer py-1.25 px-3 rounded-[20px]"
          style={{
            border: `1.5px solid ${mode === opt.v ? "var(--a26-teal)" : "var(--a26-glass-border)"}`,
            background: mode === opt.v ? "color-mix(in srgb, var(--a26-teal) 10%, transparent)" : "transparent",
            color: mode === opt.v ? "var(--a26-teal)" : "var(--a26-text-mid)",
            fontWeight: mode === opt.v ? 600 : 400,
          }}
        >
          {opt.label}
        </button>
      ))}
      <div className="shrink-0 bg-a26-glass-border w-px h-4.5" />
      {[
        { v: false, icon: <Sun size={12} />, label: "Light" },
        { v: true, icon: <Moon size={12} />, label: "Dark" },
      ].map((opt) => (
        <button
          key={String(opt.v)}
          onClick={() => setIsDark(opt.v)}
          className="font-mac shrink-0 flex items-center gap-1 text-xs whitespace-nowrap cursor-pointer py-1.25 px-2.5 rounded-[20px]"
          style={{
            border: `1.5px solid ${isDark === opt.v ? "var(--a26-blue)" : "var(--a26-glass-border)"}`,
            background: isDark === opt.v ? "color-mix(in srgb, var(--a26-blue) 10%, transparent)" : "transparent",
            color: isDark === opt.v ? "var(--a26-blue)" : "var(--a26-text-mid)",
          }}
        >
          {opt.icon} {opt.label}
        </button>
      ))}
      <div className="shrink-0 bg-a26-glass-border w-px h-4.5" />
      {RESUME_SWATCHES.map((s) => (
        <button
          key={s.value}
          onClick={() => setColor(s.value)}
          title={s.label}
          className="shrink-0 w-5 h-5 rounded-full border-none cursor-pointer outline-none"
          style={{
            background: s.hex,
            boxShadow: color === s.value ? `0 0 0 2px ${isSystemDark ? "#1C1C1C" : "#F5F5F5"}, 0 0 0 3.5px ${s.hex}` : "none",
            transform: color === s.value ? "scale(1.2)" : "scale(1)",
            transition: "transform 0.13s, box-shadow 0.13s",
          }}
        />
      ))}
      <div className="shrink-0 bg-a26-glass-border w-px h-4.5" />
      <button
        onClick={handleExport}
        className="font-mac flex items-center shrink-0 gap-1.25 py-1.25 px-3 rounded-[20px] border-none text-xs font-semibold cursor-pointer whitespace-nowrap"
        style={{ background: colors.primary, color: colors.text }}
      >
        <Download size={11} /> Export
      </button>
    </div>
  );

  return (
    <div className={`font-mac flex-1 min-h-0 overflow-hidden flex ${isMobile ? "flex-col" : "flex-row"}`}>
      {mobileToolbar}

      {/* ── Controls sidebar (desktop only) ── */}
      {!isMobile && (
        <div
          className="win26-scroll shrink-0 bg-a26-sidebar border-r border-a26-glass-border flex flex-col overflow-y-auto w-[218px] py-4 px-3.5 gap-5 [scrollbar-width:thin]"
          style={{ scrollbarColor: "rgba(255,255,255,0.18) transparent" }}
        >
          {/* Template */}
          <div>
            <span className={sectionLabelCls}>Template</span>
            <div className="flex flex-col gap-1.25">
              {[
                { v: "modern" as ResumeMode, icon: <Sparkles size={12} />, label: "Modern", desc: "Styled sidebar" },
                { v: "simple" as ResumeMode, icon: <LayoutTemplate size={12} />, label: "Simple", desc: "Classic & clean" },
              ].map((opt) => (
                <button
                  key={opt.v}
                  onClick={() => setMode(opt.v)}
                  className="font-mac flex items-center gap-2.25 py-2 px-2.5 rounded-lg cursor-pointer transition-all duration-[140ms] text-left"
                  style={{
                    border: `1px solid ${mode === opt.v ? "color-mix(in srgb, var(--a26-teal) 40%, transparent)" : "var(--a26-glass-border)"}`,
                    background: mode === opt.v ? "color-mix(in srgb, var(--a26-teal) 8%, transparent)" : "var(--a26-glass)",
                  }}
                >
                  <span style={{ color: mode === opt.v ? "var(--a26-teal)" : "var(--a26-text-muted)" }}>
                    {opt.icon}
                  </span>
                  <div>
                    <div
                      className="text-xs font-semibold"
                      style={{ color: mode === opt.v ? "var(--a26-text)" : "var(--a26-text-mid)" }}
                    >
                      {opt.label}
                    </div>
                    <div className="text-a26-muted text-[10px]">{opt.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Appearance */}
          <div>
            <span className={sectionLabelCls}>Appearance</span>
            <div className="flex gap-1.5">
              {[
                { v: false, icon: <Sun size={13} />, label: "Light" },
                { v: true, icon: <Moon size={13} />, label: "Dark" },
              ].map((opt) => (
                <button
                  key={String(opt.v)}
                  onClick={() => setIsDark(opt.v)}
                  className="font-mac flex-1 flex flex-col items-center gap-1.25 py-2.25 px-1.5 rounded-lg cursor-pointer transition-all duration-[140ms]"
                  style={{
                    border: `1px solid ${isDark === opt.v ? "color-mix(in srgb, var(--a26-blue) 40%, transparent)" : "var(--a26-glass-border)"}`,
                    background: isDark === opt.v ? "color-mix(in srgb, var(--a26-blue) 8%, transparent)" : "var(--a26-glass)",
                  }}
                >
                  <span style={{ color: isDark === opt.v ? "var(--a26-blue)" : "var(--a26-text-muted)" }}>
                    {opt.icon}
                  </span>
                  <span
                    className="text-[11px]"
                    style={{ color: isDark === opt.v ? "var(--a26-text)" : "var(--a26-text-muted)" }}
                  >
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <span className={sectionLabelCls}>Accent Color</span>
            <div className="flex flex-wrap gap-2">
              {RESUME_SWATCHES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setColor(s.value)}
                  title={s.label}
                  className="flex items-center justify-center w-6 h-6 rounded-full border-none cursor-pointer outline-none"
                  style={{
                    background: s.hex,
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
            <div className="text-a26-muted text-[11px] mt-1.75 capitalize">{color}</div>
          </div>

          {/* Export — pinned to bottom */}
          <div className="flex flex-col mt-auto gap-2.5">
            <button
              onClick={handleExport}
              className="font-mac flex items-center justify-center w-full gap-1.75 py-2.25 rounded-[9px] border-none text-[13px] font-semibold cursor-pointer"
              style={{ background: colors.primary, color: colors.text }}
            >
              <Download size={14} /> Export PDF
            </button>
            <div
              className="bg-a26-glass border border-a26-glass-border text-[10px] leading-[1.65] py-2 px-2.5 rounded-[7px]"
              style={{ color: "var(--a26-text-muted)" }}
            >
              <div className="font-semibold mb-0.75" style={{ color: "var(--a26-text-mid)" }}>Tips</div>
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
        {/* Zoom toolbar — desktop only */}
        {!isMobile && (
          <div className="shrink-0 flex items-center border-b bg-a26-title-bar border-a26-glass-border gap-0.5 py-1.5 px-3">
            <button
              onClick={() => stepZoom(-0.1)}
              className="text-a26-muted flex items-center justify-center w-6.5 h-5.5 rounded-[5px] border-none bg-transparent cursor-pointer"
            >
              <ZoomOut size={13} />
            </button>
            <button
              onClick={resetZoom}
              className="text-a26-mid h-5.5 px-1.5 rounded-[5px] border-none bg-transparent text-[11px] font-mono cursor-pointer"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              onClick={() => stepZoom(0.1)}
              className="text-a26-muted flex items-center justify-center w-6.5 h-5.5 rounded-[5px] border-none bg-transparent cursor-pointer"
            >
              <ZoomIn size={13} />
            </button>
          </div>
        )}

        {/* Scrollable resume */}
        <div
          className="win26-scroll flex-1 min-h-0 overflow-y-auto overflow-x-auto py-5 [scrollbar-width:thin]"
          style={{ scrollbarColor: "var(--a26-glass-border) transparent" }}
        >
          {/* Wrapper matches the visual (scaled) width so no horizontal overflow */}
          <div style={{ width: `${Math.round(794 * zoom)}px`, margin: "0 auto" }}>
            <div
              id="resume-preview-2026"
              style={{
                width: 794,
                transformOrigin: "top left",
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
