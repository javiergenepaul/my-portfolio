"use client";

import { useState } from "react";
import { Monitor, Smartphone, Check, Eye } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/common/ui/dialog";
import { MockupFrame } from "@/components/mockup/mockup-frame";
import {
  MOCKUP_DEVICES,
  getMockupTemplate,
  getTemplatesByDevice,
  type MockupDevice,
} from "@/lib/mockups/templates";

/**
 * Neutral page stand-in shown inside the frame previews (so the admin sees the
 * frame style, not a specific screenshot). Inline SVG data URI — no asset.
 */
const PLACEHOLDER_SHOT = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250">
     <rect width="400" height="250" fill="#ffffff"/>
     <rect width="400" height="34" fill="#4f46e5"/>
     <circle cx="20" cy="17" r="7" fill="#ffffff" opacity="0.9"/>
     <rect x="36" y="12" width="70" height="10" rx="3" fill="#ffffff" opacity="0.85"/>
     <rect x="320" y="11" width="60" height="12" rx="6" fill="#ffffff" opacity="0.3"/>
     <rect x="0" y="34" width="86" height="216" fill="#0f172a"/>
     <rect x="14" y="52" width="58" height="8" rx="3" fill="#64748b"/>
     <rect x="14" y="74" width="48" height="8" rx="3" fill="#475569"/>
     <rect x="14" y="96" width="58" height="8" rx="3" fill="#475569"/>
     <rect x="14" y="118" width="42" height="8" rx="3" fill="#475569"/>
     <rect x="110" y="54" width="120" height="14" rx="3" fill="#1e293b"/>
     <rect x="110" y="84" width="130" height="52" rx="8" fill="#eef2ff"/>
     <rect x="252" y="84" width="130" height="52" rx="8" fill="#ecfeff"/>
     <rect x="110" y="150" width="272" height="10" rx="3" fill="#e2e8f0"/>
     <rect x="110" y="168" width="240" height="10" rx="3" fill="#e2e8f0"/>
     <rect x="110" y="186" width="256" height="10" rx="3" fill="#e2e8f0"/>
     <rect x="110" y="210" width="180" height="10" rx="3" fill="#eef2f6"/>
   </svg>`,
)}`;

const DEVICE_ICON: Record<MockupDevice, typeof Monitor> = {
  desktop: Monitor,
  mobile: Smartphone,
};

/**
 * Admin picker for a project's mockup frame. Two-step: choose the device group
 * (Desktop / Mobile), then pick a specific template from a modal gallery that
 * previews each frame. Value is the template id (empty = no frame).
 */
export function MockupTemplateField({
  value,
  onChange,
  screenshot,
}: {
  value: string;
  onChange: (v: string) => void;
  /** Uploaded page screenshot (sibling `mockPhoto`), if any. */
  screenshot?: string;
}) {
  const selected = getMockupTemplate(value);
  const [device, setDevice] = useState<MockupDevice>(
    selected?.device ?? "desktop",
  );
  const [open, setOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const templates = getTemplatesByDevice(device);
  // Show the real upload in the previews once it exists; placeholder otherwise.
  const shot = screenshot || PLACEHOLDER_SHOT;

  return (
    <div className="flex flex-col gap-3">
      {/* Step 1 — device group */}
      <div className="flex gap-2">
        {MOCKUP_DEVICES.map((d) => {
          const Icon = DEVICE_ICON[d.id];
          const active = device === d.id;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => setDevice(d.id)}
              className={twMerge(
                "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon size={15} />
              {d.label}
            </button>
          );
        })}
      </div>

      {/* Step 2 — current selection + open gallery */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="w-44 shrink-0">
          {selected ? (
            <MockupFrame
              templateId={selected.id}
              screenshot={shot}
              alt={selected.label}
            />
          ) : (
            <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted-foreground">
              No frame
            </div>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div>
            <div className="text-sm font-medium">
              {selected ? selected.label : "No mockup frame"}
            </div>
            {selected && (
              <div className="text-xs text-muted-foreground">
                Suggested {selected.suggested.w}×{selected.suggested.h} ·{" "}
                {selected.aspect}
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(true)}
            >
              Choose template…
            </Button>
            {selected && screenshot && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setPreviewOpen(true)}
              >
                <Eye size={14} className="mr-1.5" />
                Preview result
              </Button>
            )}
            {value && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onChange("")}
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Modal gallery */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Choose a {device} mockup</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {templates.map((t) => {
              const active = value === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    onChange(t.id);
                    setOpen(false);
                  }}
                  className={twMerge(
                    "group relative flex flex-col gap-2 rounded-xl border p-3 text-left transition-colors",
                    active
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50",
                  )}
                >
                  {active && (
                    <span className="absolute right-3 top-3 z-10 rounded-full bg-primary p-1 text-primary-foreground">
                      <Check size={12} />
                    </span>
                  )}
                  <MockupFrame
                    templateId={t.id}
                    screenshot={shot}
                    alt={t.label}
                  />
                  <div>
                    <div className="text-sm font-medium">{t.label}</div>
                    <div className="text-xs text-muted-foreground">
                      Suggested {t.suggested.w}×{t.suggested.h} · {t.aspect}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Result preview — the actual uploaded screenshot in the chosen frame */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Preview — {selected?.label ?? "result"}
            </DialogTitle>
          </DialogHeader>
          {selected && screenshot && (
            <div className="mx-auto w-full max-w-xl">
              <MockupFrame
                templateId={selected.id}
                screenshot={screenshot}
                alt="Result preview"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
