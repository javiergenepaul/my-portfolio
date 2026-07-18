"use client";

import { useState } from "react";
import { Monitor, Smartphone, Check } from "lucide-react";
import { twMerge } from "tailwind-merge";
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
 * Neutral page stand-in shown inside the frame previews (so the gallery shows
 * the frame style when no real screenshot is supplied). Inline SVG data URI.
 */
export const PLACEHOLDER_SHOT = `data:image/svg+xml,${encodeURIComponent(
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
 * Modal gallery for picking a mockup frame — Desktop/Mobile group then a
 * template, each previewed with a live composite (real screenshot if supplied,
 * else a placeholder). Shared by "Add mockup" and per-item "Change frame".
 */
export function TemplateGalleryDialog({
  open,
  onOpenChange,
  value,
  screenshot,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Currently selected template id (highlighted; sets the initial device). */
  value?: string;
  /** Uploaded screenshot to preview inside the frames, if any. */
  screenshot?: string;
  onSelect: (templateId: string) => void;
}) {
  const [device, setDevice] = useState<MockupDevice>(
    getMockupTemplate(value)?.device ?? "desktop",
  );
  const templates = getTemplatesByDevice(device);
  const shot = screenshot || PLACEHOLDER_SHOT;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Choose a {device} mockup</DialogTitle>
        </DialogHeader>

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

        <div className="grid max-h-[60vh] grid-cols-1 gap-4 overflow-y-auto sm:grid-cols-2">
          {templates.map((t) => {
            const active = value === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  onSelect(t.id);
                  onOpenChange(false);
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
                <MockupFrame templateId={t.id} screenshot={shot} alt={t.label} />
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
  );
}
