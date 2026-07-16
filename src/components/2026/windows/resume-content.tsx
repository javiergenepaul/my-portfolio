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
  Loader2,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import type { Color } from "@/stores";
import { RESUME_COLORS, RESUME_SWATCHES } from "../constants";
import { useIsDark } from "../use-aurora";
import { useIsMobile } from "../hooks";
import { translate, useLocaleRefresh } from "@/i18n";
import { ResumeSkeleton } from "@/screens/2024/resume/templates/resume-skeleton";
import { useResumeContent } from "@/screens/2024/resume/use-resume-content";

const ResumeModern = dynamic(
  () =>
    import("@/screens/2024/resume/templates/modern-template").then((m) => ({
      default: m.ModernTemplate,
    })),
  {
    ssr: false,
    loading: () => <ResumeSkeleton isDark />,
  },
);
const ResumeAts = dynamic(
  () =>
    import("@/screens/2024/resume/templates/ats-template").then((m) => ({
      default: m.AtsTemplate,
    })),
  {
    ssr: false,
    loading: () => <ResumeSkeleton isDark />,
  },
);

export function ResumeContent() {
  useLocaleRefresh();
  const content = useResumeContent();
  const isSystemDark = useIsDark();
  const isMobile = useIsMobile();
  type ResumeMode = "modern" | "ats";
  const [mode, setMode] = useState<ResumeMode>("ats");
  const [isDark, setIsDark] = useState(true);
  const [color, setColor] = useState<Color>("azure");
  const [zoom, setZoom] = useState(0.55);
  const [isExporting, setIsExporting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const calc = () => {
      const w = el.clientWidth - (isMobile ? 24 : 48);
      if (w > 0)
        setZoom(
          Math.min(
            isMobile ? 0.9 : 0.85,
            Math.max(0.3, Math.floor((w / 794) * 100) / 100),
          ),
        );
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

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    try {
      // Both chunks stay out of the main bundle until the first export.
      const [{ pdf }, { ResumeDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/screens/2024/resume/pdf/resume-document"),
      ]);
      const blob = await pdf(
        <ResumeDocument
          mode={mode}
          colors={colors}
          isDark={isDark}
          content={content}
        />,
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `gene-paul-mar-javier-resume-${mode}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setIsExporting(false);
    }
  }, [mode, colors, isDark, content]);

  const sectionLabelCls =
    "text-a26-muted font-mac block mb-2 text-[9px] font-bold tracking-[0.10em] uppercase";

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
        { v: "ats" as const, label: translate("win26.resume.ats") },
        { v: "modern" as const, label: translate("win26.resume.modern") },
      ].map((opt) => (
        <button
          key={opt.v}
          onClick={() => setMode(opt.v)}
          className="font-mac shrink-0 text-xs whitespace-nowrap cursor-pointer py-1.25 px-3 rounded-[20px]"
          style={{
            border: `1.5px solid ${mode === opt.v ? "var(--a26-teal)" : "var(--a26-glass-border)"}`,
            background:
              mode === opt.v
                ? "color-mix(in srgb, var(--a26-teal) 10%, transparent)"
                : "transparent",
            color: mode === opt.v ? "var(--a26-teal)" : "var(--a26-text-mid)",
            fontWeight: mode === opt.v ? 600 : 400,
          }}
        >
          {opt.label}
        </button>
      ))}
      <div className="shrink-0 bg-a26-glass-border w-px h-4.5" />
      {[
        {
          v: false,
          icon: <Sun size={12} />,
          label: translate("win26.resume.light"),
        },
        {
          v: true,
          icon: <Moon size={12} />,
          label: translate("win26.resume.dark"),
        },
      ].map((opt) => (
        <button
          key={String(opt.v)}
          onClick={() => setIsDark(opt.v)}
          className="font-mac shrink-0 flex items-center gap-1 text-xs whitespace-nowrap cursor-pointer py-1.25 px-2.5 rounded-[20px]"
          style={{
            border: `1.5px solid ${isDark === opt.v ? "var(--a26-blue)" : "var(--a26-glass-border)"}`,
            background:
              isDark === opt.v
                ? "color-mix(in srgb, var(--a26-blue) 10%, transparent)"
                : "transparent",
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
            boxShadow:
              color === s.value
                ? `0 0 0 2px ${isSystemDark ? "#1C1C1C" : "#F5F5F5"}, 0 0 0 3.5px ${s.hex}`
                : "none",
            transform: color === s.value ? "scale(1.2)" : "scale(1)",
            transition: "transform 0.13s, box-shadow 0.13s",
          }}
        />
      ))}
      <div className="shrink-0 bg-a26-glass-border w-px h-4.5" />
      <button
        onClick={handleExport}
        disabled={isExporting}
        className="font-mac flex items-center shrink-0 gap-1.25 py-1.25 px-3 rounded-[20px] border-none text-xs font-semibold cursor-pointer whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ background: colors.primary, color: colors.text }}
      >
        {isExporting ? (
          <Loader2 size={11} className="animate-spin" />
        ) : (
          <Download size={11} />
        )}{" "}
        {isExporting
          ? translate("win26.resume.exporting")
          : translate("win26.resume.exportShort")}
      </button>
    </div>
  );

  return (
    <div
      className={`font-mac flex-1 min-h-0 overflow-hidden flex ${isMobile ? "flex-col" : "flex-row"}`}
    >
      {mobileToolbar}

      {/* ── Controls sidebar (desktop only) ── */}
      {!isMobile && (
        <div
          className="win26-scroll shrink-0 bg-a26-sidebar border-r border-a26-glass-border flex flex-col overflow-y-auto w-54.5 py-4 px-3.5 gap-5 [scrollbar-width:thin]"
          style={{ scrollbarColor: "rgba(255,255,255,0.18) transparent" }}
        >
          {/* Template */}
          <div>
            <span className={sectionLabelCls}>
              {translate("win26.resume.template")}
            </span>
            <div className="flex flex-col gap-1.25">
              {[
                {
                  v: "ats" as ResumeMode,
                  icon: <ShieldCheck size={12} />,
                  label: translate("win26.resume.ats"),
                  desc: translate("win26.resume.atsDesc"),
                },
                {
                  v: "modern" as ResumeMode,
                  icon: <Sparkles size={12} />,
                  label: translate("win26.resume.modern"),
                  desc: translate("win26.resume.modernDesc"),
                },
              ].map((opt) => (
                <button
                  key={opt.v}
                  onClick={() => setMode(opt.v)}
                  className="font-mac flex items-center gap-2.25 py-2 px-2.5 rounded-lg cursor-pointer transition-all duration-140 text-left"
                  style={{
                    border: `1px solid ${mode === opt.v ? "color-mix(in srgb, var(--a26-teal) 40%, transparent)" : "var(--a26-glass-border)"}`,
                    background:
                      mode === opt.v
                        ? "color-mix(in srgb, var(--a26-teal) 8%, transparent)"
                        : "var(--a26-glass)",
                  }}
                >
                  <span
                    style={{
                      color:
                        mode === opt.v
                          ? "var(--a26-teal)"
                          : "var(--a26-text-muted)",
                    }}
                  >
                    {opt.icon}
                  </span>
                  <div>
                    <div
                      className="text-xs font-semibold"
                      style={{
                        color:
                          mode === opt.v
                            ? "var(--a26-text)"
                            : "var(--a26-text-mid)",
                      }}
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
            <span className={sectionLabelCls}>
              {translate("win26.resume.appearance")}
            </span>
            <div className="flex gap-1.5">
              {[
                {
                  v: false,
                  icon: <Sun size={13} />,
                  label: translate("win26.resume.light"),
                },
                {
                  v: true,
                  icon: <Moon size={13} />,
                  label: translate("win26.resume.dark"),
                },
              ].map((opt) => (
                <button
                  key={String(opt.v)}
                  onClick={() => setIsDark(opt.v)}
                  className="font-mac flex-1 flex flex-col items-center gap-1.25 py-2.25 px-1.5 rounded-lg cursor-pointer transition-all duration-140"
                  style={{
                    border: `1px solid ${isDark === opt.v ? "color-mix(in srgb, var(--a26-blue) 40%, transparent)" : "var(--a26-glass-border)"}`,
                    background:
                      isDark === opt.v
                        ? "color-mix(in srgb, var(--a26-blue) 8%, transparent)"
                        : "var(--a26-glass)",
                  }}
                >
                  <span
                    style={{
                      color:
                        isDark === opt.v
                          ? "var(--a26-blue)"
                          : "var(--a26-text-muted)",
                    }}
                  >
                    {opt.icon}
                  </span>
                  <span
                    className="text-[11px]"
                    style={{
                      color:
                        isDark === opt.v
                          ? "var(--a26-text)"
                          : "var(--a26-text-muted)",
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
            <span className={sectionLabelCls}>
              {translate("win26.resume.accentColor")}
            </span>
            <div className="flex flex-wrap gap-2">
              {RESUME_SWATCHES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setColor(s.value)}
                  title={s.label}
                  className="flex items-center justify-center w-6 h-6 rounded-full border-none cursor-pointer outline-none"
                  style={{
                    background: s.hex,
                    boxShadow:
                      color === s.value
                        ? `0 0 0 2px ${isSystemDark ? "#1C1C1C" : "#F5F5F5"}, 0 0 0 3.5px ${s.hex}`
                        : "none",
                    transform: color === s.value ? "scale(1.18)" : "scale(1)",
                    transition: "transform 0.13s, box-shadow 0.13s",
                  }}
                >
                  {color === s.value && (
                    <Check size={11} color="#fff" strokeWidth={3} />
                  )}
                </button>
              ))}
            </div>
            <div className="text-a26-muted text-[11px] mt-1.75 capitalize">
              {color}
            </div>
          </div>

          {/* Export — pinned to bottom */}
          <div className="flex flex-col mt-auto gap-2.5">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="font-mac flex items-center justify-center w-full gap-1.75 py-2.25 rounded-[9px] border-none text-[13px] font-semibold cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: colors.primary, color: colors.text }}
            >
              {isExporting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Download size={14} />
              )}{" "}
              {isExporting
                ? translate("win26.resume.exporting")
                : translate("win26.resume.export")}
            </button>
            <div
              className="bg-a26-glass border border-a26-glass-border text-[10px] leading-[1.65] py-2 px-2.5 rounded-[7px]"
              style={{ color: "var(--a26-text-muted)" }}
            >
              <div
                className="font-semibold mb-0.75"
                style={{ color: "var(--a26-text-mid)" }}
              >
                {translate("win26.resume.tips")}
              </div>
              {translate("win26.resume.tipsDownload")}
            </div>
          </div>
        </div>
      )}

      {/* ── Preview panel ── */}
      <div
        ref={containerRef}
        className="flex-1 flex flex-col overflow-hidden"
        style={{
          background: isSystemDark ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0.07)",
        }}
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
          <div
            style={{ width: `${Math.round(794 * zoom)}px`, margin: "0 auto" }}
          >
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
              {mode === "ats" ? (
                <ResumeAts colors={colors} isDark={isDark} content={content} />
              ) : (
                <ResumeModern
                  colors={colors}
                  isDark={isDark}
                  content={content}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
