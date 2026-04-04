"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { type YearConfig } from "@/config/years";
import { cn } from "@/lib/utils";

interface YearPreviewProps {
  year: YearConfig;
  onClose: () => void;
}

/**
 * Floating iframe preview shown when hovering a year pill.
 *
 * - Lazy-loaded: the iframe src is set only after the component mounts
 * - Shows a skeleton while the iframe loads
 * - Positioned above the navigator pill (bottom-centre)
 * - Closes on Escape or the × button
 */
export function YearPreview({ year, onClose }: YearPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      className={cn(
        "fixed bottom-24 left-1/2 z-50 -translate-x-1/2",
        "w-[min(480px,90vw)] overflow-hidden rounded-2xl",
        "border bg-background shadow-2xl"
      )}
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.95 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      role="dialog"
      aria-label={`Preview of ${year.year} portfolio`}
    >
      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{year.year} Portfolio</span>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
            Preview
          </span>
        </div>
        <button
          onClick={onClose}
          className="rounded-md p-1 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Close preview"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* ── Iframe area ───────────────────────────────────────────────── */}
      <div className="relative h-[320px] w-full bg-muted">
        {/* Skeleton shown while iframe loads */}
        {!loaded && (
          <div className="absolute inset-0 animate-pulse">
            <div className="h-full w-full bg-gradient-to-br from-muted to-muted-foreground/10" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              Loading {year.year} preview…
            </div>
          </div>
        )}

        {/*
          The iframe is scaled down (0.5×) and then visually expanded to fill
          the container, giving a "thumbnail" view of the full-width page.
          pointer-events: none prevents accidental clicks inside the preview.
        */}
        <iframe
          ref={iframeRef}
          src={year.path}
          title={`${year.year} portfolio preview`}
          className={cn(
            "absolute left-0 top-0 origin-top-left",
            "pointer-events-none select-none",
            loaded ? "opacity-100" : "opacity-0"
          )}
          style={{
            width: "200%",
            height: "200%",
            transform: "scale(0.5)",
            border: "none",
          }}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          // Security: sandbox the iframe to prevent scripts from navigating the parent
          sandbox="allow-same-origin allow-scripts"
        />
      </div>

      {/* ── Footer CTA ────────────────────────────────────────────────── */}
      <div className="border-t px-4 py-2.5 text-xs text-muted-foreground">
        {year.description} &nbsp;·&nbsp;
        <span className="text-primary">Click the arrow to navigate →</span>
      </div>
    </motion.div>
  );
}
