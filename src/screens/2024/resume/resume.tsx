"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Download,
  Sparkles,
  ShieldCheck,
  Check,
  ZoomIn,
  ZoomOut,
  Sun,
  Moon,
  TriangleAlert,
  Loader2,
} from "lucide-react";
import { useSettingsStore, type Color } from "@/stores";
import { cn } from "@/lib/utils";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components";
import { ModernTemplate } from "./templates/modern-template";
import { AtsTemplate } from "./templates/ats-template";
import type { ResumeData } from "./resume-content";
import { useProfile } from "@/lib/content/use-content";
import { useResumeContent } from "./use-resume-content";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ResumeMode = "modern" | "ats";

export interface ResumeColorConfig {
  primary: string;
  light: string;
  dark: string;
  /** Text colour to use on the primary background */
  text: string;
}

// ─── Color map ────────────────────────────────────────────────────────────────

const COLOR_CONFIG: Record<Color, ResumeColorConfig> = {
  emerald: {
    primary: "#22C55E",
    light: "#DCFCE7",
    dark: "#15803D",
    text: "#FFFFFF",
  },
  azure: {
    primary: "#3B82F6",
    light: "#DBEAFE",
    dark: "#1D4ED8",
    text: "#FFFFFF",
  },
  golden: {
    primary: "#CA8A04",
    light: "#FEF9C3",
    dark: "#A16207",
    text: "#FFFFFF",
  },
  sunset: {
    primary: "#EA580C",
    light: "#FFEDD5",
    dark: "#C2410C",
    text: "#FFFFFF",
  },
  lavender: {
    primary: "#7C3AED",
    light: "#EDE9FE",
    dark: "#5B21B6",
    text: "#FFFFFF",
  },
  scarlet: {
    primary: "#E11D48",
    light: "#FFE4E6",
    dark: "#BE123C",
    text: "#FFFFFF",
  },
  silver: {
    primary: "#52525B",
    light: "#F4F4F5",
    dark: "#27272A",
    text: "#FFFFFF",
  },
};

const COLOR_SWATCHES: { value: Color; hex: string }[] = [
  { value: "emerald", hex: "#22C55E" },
  { value: "azure", hex: "#3B82F6" },
  { value: "golden", hex: "#CA8A04" },
  { value: "sunset", hex: "#EA580C" },
  { value: "lavender", hex: "#7C3AED" },
  { value: "scarlet", hex: "#E11D48" },
  { value: "silver", hex: "#52525B" },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface ResumeBuilderProps {
  /** Seed the color picker with a specific colour instead of the store value */
  defaultColor?: Color;
  /** Résumé content from the DB; falls back to the built-in default when absent. */
  content?: ResumeData;
}

export const ResumeBuilder = ({
  defaultColor,
  content,
}: ResumeBuilderProps = {}) => {
  // The page passes `content` (server-fetched); other mounts (the résumé modal)
  // don't, so fall back to a client fetch of the same DB data.
  const dbContent = useResumeContent(!!content);
  const profile = useProfile();
  const resumeContent = content ?? dbContent;
  const { color: storeColor, theme } = useSettingsStore();
  const [mode, setMode] = useState<ResumeMode>("ats");
  const [color, setColor] = useState<Color>(defaultColor ?? storeColor);
  const [isDark, setIsDark] = useState(() => {
    if (theme === "dark") return true;
    if (theme === "light") return false;
    return (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  });
  const [zoom, setZoom] = useState(0.85);
  const [autoZoom, setAutoZoom] = useState(0.85);
  const [isExporting, setIsExporting] = useState(false);
  const [atsWarningOpen, setAtsWarningOpen] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-fit the preview to the available container width on mount
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const available = containerRef.current.clientWidth;
    if (available > 0) {
      const fit = Math.min(
        0.85,
        Math.max(0.4, Math.floor((available / 794) * 100) / 100),
      );
      setAutoZoom(fit);
      setZoom(fit);
    }
  }, []);

  // Warn once per session that the Modern template favours visual polish over
  // ATS-parsing accuracy — the builder also opens on Modern by default.
  const hasWarnedRef = useRef(false);
  useEffect(() => {
    if (mode === "modern" && !hasWarnedRef.current) {
      setAtsWarningOpen(true);
      hasWarnedRef.current = true;
    }
  }, [mode]);

  const handleModeSelect = useCallback((next: ResumeMode) => {
    setMode(next);
    if (next === "modern" && !hasWarnedRef.current) {
      setAtsWarningOpen(true);
      hasWarnedRef.current = true;
    }
  }, []);

  const stepZoom = (delta: number) =>
    setZoom((z) =>
      Math.min(1.5, Math.max(0.4, Math.round((z + delta) * 10) / 10)),
    );

  const colors = COLOR_CONFIG[color];

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    try {
      // Both chunks stay out of the main bundle until the first export.
      const [{ pdf }, { ResumeDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("./pdf/resume-document"),
      ]);

      const blob = await pdf(
        <ResumeDocument
          mode={mode}
          colors={colors}
          isDark={isDark}
          content={resumeContent}
          ownerName={profile.fullName}
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
  }, [mode, colors, isDark, resumeContent]);

  return (
    <div className="flex flex-col lg:flex-row min-h-full">
      {/* ── Controls panel — sticky ───────────────────────────────────── */}
      <div className="w-full lg:w-96 shrink-0 border-b lg:border-b-0 lg:border-r border-border lg:sticky lg:top-0 lg:self-start flex flex-col gap-5 p-6">
        {/* Mode */}
        <ControlCard title="Template">
          <div className="flex gap-3">
            <ModeButton
              active={mode === "ats"}
              onClick={() => handleModeSelect("ats")}
              icon={<ShieldCheck size={15} />}
              label="ATS"
              description="ATS-optimized"
            />
            <ModeButton
              active={mode === "modern"}
              onClick={() => handleModeSelect("modern")}
              icon={<Sparkles size={15} />}
              label="Modern"
              description="Styled sidebar"
            />
          </div>
        </ControlCard>

        {/* Dark / Light */}
        <ControlCard title="Background">
          <div className="flex gap-3">
            <ModeButton
              active={!isDark}
              onClick={() => setIsDark(false)}
              icon={<Sun size={15} />}
              label="Light"
              description="White paper"
            />
            <ModeButton
              active={isDark}
              onClick={() => setIsDark(true)}
              icon={<Moon size={15} />}
              label="Dark"
              description="Dark paper"
            />
          </div>
        </ControlCard>

        {/* Theme */}
        <ControlCard title="Color Theme">
          <div className="flex flex-wrap gap-3">
            {COLOR_SWATCHES.map(({ value, hex }) => (
              <button
                key={value}
                onClick={() => setColor(value)}
                aria-label={value}
                title={value}
                className={cn(
                  "h-8 w-8 rounded-full border-2 transition-all flex items-center justify-center",
                  color === value
                    ? "border-foreground scale-110 shadow-md"
                    : "border-transparent hover:scale-105",
                )}
                style={{ backgroundColor: hex }}
              >
                {color === value && (
                  <Check size={13} style={{ color: "#fff", strokeWidth: 3 }} />
                )}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground capitalize">{color}</p>
        </ControlCard>

        {/* Export */}
        <Button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full gap-2 h-11 text-sm font-semibold"
          style={{ backgroundColor: colors.primary, color: colors.text }}
        >
          {isExporting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Download size={16} />
          )}
          {isExporting ? "Generating PDF…" : "Export PDF"}
        </Button>

        {/* Tips */}
        <div className="rounded-xl border border-dashed border-border px-4 py-4 flex flex-col gap-2 text-xs text-muted-foreground leading-relaxed">
          <p className="font-semibold text-foreground text-sm">Export tips</p>
          <ul className="space-y-1.5 list-disc list-inside">
            <li>
              Downloads a real <b>PDF file</b> — no print dialog needed.
            </li>
            <li>
              Text stays <b>selectable</b> and ATS-parseable.
            </li>
            <li>
              Use the <b>ATS</b> template for automated screeners.
            </li>
          </ul>
        </div>
      </div>

      {/* ── Preview ──────────────────────────────────────────────────── */}
      <div
        ref={containerRef}
        className="flex-1 min-w-0 w-full p-6 pb-10 flex flex-col gap-3 items-center"
      >
        {/* Zoom toolbar */}
        <div className="flex items-center gap-1 lg:sticky lg:top-4 z-10 bg-background/80 backdrop-blur-sm rounded-lg px-2 py-1 border border-border/50 shadow-sm">
          <button
            onClick={() => stepZoom(-0.1)}
            disabled={zoom <= 0.4}
            className="h-7 w-7 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 transition-colors"
            title="Zoom out"
          >
            <ZoomOut size={14} />
          </button>
          <button
            onClick={() => setZoom(autoZoom)}
            className="h-7 px-2 rounded text-[11px] font-mono text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Reset zoom"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            onClick={() => stepZoom(0.1)}
            disabled={zoom >= 1.5}
            className="h-7 w-7 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 transition-colors"
            title="Zoom in"
          >
            <ZoomIn size={14} />
          </button>
        </div>

        <div className="w-full overflow-x-auto">
          <div className="mx-auto" style={{ width: `${794 * zoom}px` }}>
            <div
              ref={previewRef}
              className="shadow-2xl rounded ring-1 ring-border/20 origin-top-left"
              style={{ width: "794px", zoom }}
            >
              {mode === "modern" ? (
                <ModernTemplate
                  colors={colors}
                  isDark={isDark}
                  content={resumeContent}
                />
              ) : (
                <AtsTemplate
                  colors={colors}
                  isDark={isDark}
                  content={resumeContent}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Modern-theme ATS warning ──────────────────────────────────── */}
      <Dialog open={atsWarningOpen} onOpenChange={setAtsWarningOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-start gap-3">
              <div className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-amber-500/15 text-amber-500">
                <TriangleAlert size={18} />
              </div>
              <div className="flex-1 text-left">
                <DialogTitle>Modern isn&apos;t fully ATS-ready</DialogTitle>
                <DialogDescription className="mt-1.5 leading-relaxed">
                  The Modern template is built for looks — its two-column,
                  styled layout can confuse some Applicant Tracking Systems. If
                  this resume is going through an automated screener, use the{" "}
                  <strong className="text-foreground">ATS</strong> template
                  instead — it&apos;s designed to be as close to 100%
                  ATS-friendly as possible.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setAtsWarningOpen(false)}>
              Keep Modern
            </Button>
            <Button
              onClick={() => {
                setMode("ats");
                setAtsWarningOpen(false);
              }}
            >
              Switch to ATS
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function ControlCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card px-5 py-4 flex flex-col gap-4">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </p>
      {children}
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  icon,
  label,
  description,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  description: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 rounded-lg border px-3 py-3 text-left transition-all",
        active
          ? "border-primary bg-primary/5 text-primary"
          : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground",
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-sm font-semibold">{label}</span>
      </div>
      <p className="text-[11px] opacity-60">{description}</p>
    </button>
  );
}
