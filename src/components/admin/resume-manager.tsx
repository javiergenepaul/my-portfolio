"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  ShieldCheck,
  Sparkles,
  Sun,
  Moon,
  Pencil,
  Save,
  RotateCcw,
  Loader2,
} from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  useToast,
} from "@/components";
import { cn } from "@/lib/utils";
import {
  CONTENT_TYPES,
  type ContentTypeDef,
  type ContentRow,
} from "./admin-config";
import { saveResume } from "@/lib/content/actions";
import { ContentList } from "./content-list";
import { ContentEditForm } from "./content-edit-form";
import { AtsTemplate } from "@/screens/2024/resume/templates/ats-template";
import { ModernTemplate } from "@/screens/2024/resume/templates/modern-template";
import type { ResumeColorConfig } from "@/screens/2024/resume/resume";
import { rowsToResumeData } from "@/screens/2024/resume/resume-data";

const RESUME_SECTIONS = CONTENT_TYPES.filter((t) => t.group === "Resume");

const PREVIEW_COLORS: ResumeColorConfig = {
  primary: "#22C55E",
  light: "#DCFCE7",
  dark: "#15803D",
  text: "#FFFFFF",
};

export function ResumeManager({
  /** Rows for every résumé section, fetched server-side from Supabase. */
  initialSections,
}: {
  initialSections: Record<string, ContentRow[]>;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const [mode, setMode] = useState<"ats" | "modern">("ats");
  const [isDark, setIsDark] = useState(false);
  const [section, setSection] = useState<ContentTypeDef | null>(null);
  const [saving, setSaving] = useState(false);

  // Working draft (edited in the modals) + the last-saved snapshot to revert to.
  const [savedDraft, setSavedDraft] = useState<Record<string, ContentRow[]>>(
    () => structuredClone(initialSections),
  );
  const [draft, setDraft] = useState<Record<string, ContentRow[]>>(() =>
    structuredClone(initialSections),
  );
  const [dirty, setDirty] = useState(false);

  const updateSection = (key: string, rows: ContentRow[]) => {
    setDraft((d) => ({ ...d, [key]: rows }));
    setDirty(true);
    toast({
      title: "Applied to draft",
      description: "Not saved yet — use Save changes to commit.",
      duration: 2000,
    });
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      const payload = Object.fromEntries(
        RESUME_SECTIONS.map((t) => [
          t.key,
          (draft[t.key] ?? []).map((r) => ({
            // Rows added in the admin carry a temporary client id — drop it so
            // they're inserted rather than treated as an existing row.
            id: r.id.startsWith("tmp-") ? undefined : r.id,
            published: r.published,
            values: r.values,
          })),
        ]),
      );

      await saveResume(payload);

      setSavedDraft(structuredClone(draft));
      setDirty(false);
      toast({
        title: "Résumé saved",
        description: "Your changes are live in the database.",
        duration: 3000,
      });
      router.refresh();
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Save failed",
        description: e instanceof Error ? e.message : "Unknown error",
        duration: 8000,
      });
    } finally {
      setSaving(false);
    }
  };

  const resetAll = () => {
    setDraft(structuredClone(savedDraft));
    setDirty(false);
    toast({
      title: "Changes discarded",
      description: "Reverted to the last saved version.",
      duration: 2000,
    });
  };

  // Live preview content, recomputed from the draft on every edit.
  const previewContent = rowsToResumeData(draft);

  const previewRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(0.5);
  useLayoutEffect(() => {
    const fit = () => {
      const w = previewRef.current?.clientWidth ?? 0;
      if (w > 0) setZoom(Math.min(0.85, Math.max(0.3, (w - 32) / 794)));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  return (
    <div>
      {/* ── Top bar: title + single Save ────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2.5">
            <FileText size={22} className="text-primary" />
            Resume
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Edit each section, then save once. Preview the ATS and Modern
            layouts.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {dirty && (
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-amber-500">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Unsaved changes
            </span>
          )}
          {dirty && (
            <Button
              variant="outline"
              onClick={resetAll}
              disabled={saving}
              className="gap-1.5"
            >
              <RotateCcw size={15} /> Reset
            </Button>
          )}
          <Button
            onClick={() => void saveAll()}
            disabled={!dirty || saving}
            className="gap-1.5"
          >
            {saving ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Save size={15} />
            )}
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── Controls + sections ───────────────────────────────────── */}
        <div className="lg:w-80 shrink-0 flex flex-col gap-5">
          <ControlCard title="Template">
            <div className="flex gap-2">
              <ToggleBtn
                active={mode === "ats"}
                onClick={() => setMode("ats")}
                icon={<ShieldCheck size={15} />}
                label="ATS"
              />
              <ToggleBtn
                active={mode === "modern"}
                onClick={() => setMode("modern")}
                icon={<Sparkles size={15} />}
                label="Modern"
              />
            </div>
          </ControlCard>

          <ControlCard title="Background">
            <div className="flex gap-2">
              <ToggleBtn
                active={!isDark}
                onClick={() => setIsDark(false)}
                icon={<Sun size={15} />}
                label="Light"
              />
              <ToggleBtn
                active={isDark}
                onClick={() => setIsDark(true)}
                icon={<Moon size={15} />}
                label="Dark"
              />
            </div>
          </ControlCard>

          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-1">
              Sections
            </p>
            {RESUME_SECTIONS.map((t) => {
              const count = draft[t.key]?.length ?? 0;
              return (
                <button
                  key={t.key}
                  onClick={() => setSection(t)}
                  className="group flex items-center gap-3 rounded-lg border border-border bg-card px-3.5 py-2.5 text-left hover:border-primary/40 transition-colors"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <t.icon size={15} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">
                      {t.label.replace(/^Resume /, "")}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {t.singleton
                        ? "Summary & contact"
                        : `${count} item${count !== 1 ? "s" : ""}`}
                    </span>
                  </span>
                  <Pencil
                    size={14}
                    className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Preview ───────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          <div
            ref={previewRef}
            className="rounded-xl border border-border bg-muted/30 p-4 overflow-auto"
            style={{ maxHeight: "calc(100dvh - 210px)" }}
          >
            <div className="mx-auto" style={{ width: 794 * zoom }}>
              <div
                className="shadow-xl ring-1 ring-border/30 origin-top-left"
                style={{ width: 794, zoom }}
              >
                {mode === "ats" ? (
                  <AtsTemplate
                    colors={PREVIEW_COLORS}
                    isDark={isDark}
                    content={previewContent}
                  />
                ) : (
                  <ModernTemplate
                    colors={PREVIEW_COLORS}
                    isDark={isDark}
                    content={previewContent}
                  />
                )}
              </div>
            </div>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground text-center">
            Live {mode === "ats" ? "ATS" : "Modern"} preview — updates as you
            edit. Only published items appear.
          </p>
        </div>
      </div>

      {/* ── Section modal (edits the draft) ─────────────────────────── */}
      <Dialog open={!!section} onOpenChange={(o) => !o && setSection(null)}>
        <DialogContent className="max-w-3xl p-0 gap-0 flex flex-col max-h-[85vh] overflow-hidden">
          <div className="flex items-center gap-2.5 border-b border-border px-5 py-4 shrink-0">
            {section && <section.icon size={18} className="text-primary" />}
            <DialogTitle className="text-base font-semibold">
              {section?.label}
            </DialogTitle>
          </div>
          {section &&
            (section.singleton ? (
              <div className="flex flex-1 min-h-0 flex-col">
                <ContentEditForm
                  type={section}
                  row={draft[section.key]?.[0]}
                  embedded
                  onDone={() => setSection(null)}
                  onSubmit={(r) =>
                    updateSection(section.key, [
                      {
                        id: draft[section.key]?.[0]?.id ?? section.key,
                        order: 0,
                        published: r.published,
                        values: r.values,
                      },
                    ])
                  }
                />
              </div>
            ) : (
              <div className="flex-1 min-h-0 overflow-y-auto p-5">
                <ContentList
                  type={section}
                  embedded
                  rows={draft[section.key] ?? []}
                  onRowsChange={(rows) => updateSection(section.key, rows)}
                />
              </div>
            ))}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ControlCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
        {title}
      </p>
      {children}
    </div>
  );
}

function ToggleBtn({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary/5 text-primary"
          : "border-border text-muted-foreground hover:text-foreground",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
