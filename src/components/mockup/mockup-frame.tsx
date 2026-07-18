"use client";

import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { getMockupTemplate, type MockupTemplate } from "@/lib/mockups/templates";
import { matrix3dForQuad } from "@/lib/mockups/perspective";

interface MockupFrameProps {
  /** Template id (see MOCKUP_TEMPLATES). Unknown/empty → renders nothing. */
  templateId: string | undefined;
  /** Uploaded page screenshot URL. */
  screenshot: string;
  alt: string;
  className?: string;
}

/**
 * Photographic-scene frame: the backdrop photo with the screenshot warped into
 * its blank screen quad. Corners are fractions of the photo, converted to px
 * against the live container size (tracked via ResizeObserver) so the composite
 * stays aligned at any width.
 */
function PhotoFrame({
  tpl,
  screenshot,
  alt,
  className,
}: {
  tpl: MockupTemplate;
  screenshot: string;
  alt: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [cw, setCw] = useState(0);
  const base = tpl.baseImage!;
  // Image imports are plain URL strings in this project (see next.config
  // webpack rule), though typed as StaticImageData — handle both defensively.
  const baseSrc = typeof base === "string" ? base : base.src;
  const scr = tpl.screen!;
  const bs = tpl.baseSize ?? { w: 16, h: 10 };

  // Track container width only; height is derived from the fixed base aspect so
  // the warp is ready on first paint (no dependency on the large photo loading).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setCw(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const ch = (cw * bs.h) / bs.w;
  // Overscan the screen quad outward from its centre so the fill bleeds a hair
  // over the bezel — no sliver of the original blank screen shows at the edges.
  const corners = [scr.tl, scr.tr, scr.br, scr.bl];
  const mx = corners.reduce((s, c) => s + c[0], 0) / 4;
  const my = corners.reduce((s, c) => s + c[1], 0) / 4;
  const OVER = 0.02;
  const dst = corners.map(
    ([fx, fy]) =>
      [(fx + (fx - mx) * OVER) * cw, (fy + (fy - my) * OVER) * ch] as [
        number,
        number,
      ],
  );
  const transform = cw
    ? matrix3dForQuad(tpl.suggested.w, tpl.suggested.h, dst)
    : undefined;

  return (
    <div
      ref={ref}
      className={twMerge("relative w-full overflow-hidden", className)}
      style={{ aspectRatio: `${bs.w} / ${bs.h}` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={baseSrc}
        alt=""
        className="absolute inset-0 h-full w-full select-none object-cover"
      />
      {transform && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={screenshot}
          alt={alt}
          loading="lazy"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: tpl.suggested.w,
            height: tpl.suggested.h,
            // Tailwind Preflight sets `img { max-width: 100% }`, which would cap
            // this to the container and break the matrix (built for the full
            // suggested-px box). Opt out so the source box is its true size.
            maxWidth: "none",
            transformOrigin: "0 0",
            transform,
            objectFit: "cover",
            backfaceVisibility: "hidden",
          }}
        />
      )}
    </div>
  );
}

/**
 * Renders a project screenshot inside a chosen mockup frame. Shared by the
 * public project card and the admin preview so what the admin sees matches the
 * site exactly.
 *
 * Returns null when there's no template or no screenshot, so callers can fall
 * back to a raw image.
 */
export function MockupFrame({
  templateId,
  screenshot,
  alt,
  className,
}: MockupFrameProps) {
  const tpl = getMockupTemplate(templateId);
  if (!tpl || !screenshot) return null;

  if (tpl.kind === "photo") {
    return (
      <PhotoFrame
        tpl={tpl}
        screenshot={screenshot}
        alt={alt}
        className={className}
      />
    );
  }

  if (tpl.kind === "phone") {
    return (
      <div
        className={twMerge(
          "mx-auto w-full max-w-55 overflow-hidden rounded-4xl border-[6px] border-neutral-800 bg-neutral-800 shadow-xl",
          className,
        )}
      >
        <div className="relative aspect-9/18 w-full overflow-hidden rounded-[1.4rem] bg-white">
          <div className="absolute left-1/2 top-0 z-10 h-4 w-24 -translate-x-1/2 rounded-b-xl bg-neutral-800" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={screenshot}
            alt={alt}
            loading="lazy"
            className="h-full w-full object-cover object-top"
          />
        </div>
      </div>
    );
  }

  // Browser window
  return (
    <div
      className={twMerge(
        "w-full overflow-hidden rounded-xl border border-border bg-card shadow-md",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 border-b border-border bg-muted/60 px-3 py-2">
        <span className="h-3 w-3 rounded-full bg-red-400/80" />
        <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
        <span className="h-3 w-3 rounded-full bg-green-400/80" />
        <span className="ml-3 hidden h-4 flex-1 rounded-full bg-background/70 sm:block" />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={screenshot}
        alt={alt}
        loading="lazy"
        className="aspect-16/10 w-full object-cover object-top"
      />
    </div>
  );
}
