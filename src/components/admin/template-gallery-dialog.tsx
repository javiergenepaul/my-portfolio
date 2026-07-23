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
// Full-bleed sample UI — content fills edge-to-edge and top-to-bottom (soft
// tones, no stark white gaps) so it looks filled cropped into ANY device
// screen, portrait or landscape. It's just a stand-in; real uploads replace it.
export const PLACEHOLDER_SHOT = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260">
     <rect width="400" height="260" fill="#eef2f8"/>
     <rect width="400" height="30" fill="#4f46e5"/>
     <circle cx="17" cy="15" r="7" fill="#ffffff" opacity="0.9"/>
     <rect x="32" y="10" width="78" height="10" rx="3" fill="#ffffff" opacity="0.85"/>
     <rect x="312" y="9" width="72" height="12" rx="6" fill="#ffffff" opacity="0.28"/>
     <rect x="12" y="42" width="185" height="60" rx="9" fill="#dbe4ff"/>
     <rect x="203" y="42" width="185" height="60" rx="9" fill="#cdeee4"/>
     <rect x="12" y="114" width="150" height="12" rx="3" fill="#c3cddd"/>
     <rect x="12" y="136" width="376" height="16" rx="4" fill="#dfe6f1"/>
     <rect x="12" y="158" width="376" height="16" rx="4" fill="#e7edf6"/>
     <rect x="12" y="180" width="376" height="16" rx="4" fill="#dfe6f1"/>
     <rect x="12" y="210" width="120" height="40" rx="9" fill="#e3e9fb"/>
     <rect x="140" y="210" width="120" height="40" rx="9" fill="#d9f0ea"/>
     <rect x="268" y="210" width="120" height="40" rx="9" fill="#fdf3cf"/>
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
  );
}
