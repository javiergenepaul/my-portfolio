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
 * Renders a project screenshot warped into a mockup photo's blank screen quad.
 * Corners are fractions of the photo, converted to px against the live
 * container width (height derived from the fixed base aspect, so the warp is
 * ready on first paint). Shared by the public project card and the admin
 * preview, so what the admin sees matches the site exactly.
 *
 * Returns null when there's no template or no screenshot, so callers can fall
 * back to a raw image.
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
  const base = tpl.baseImage;
  // Image imports are plain URL strings in this project (see next.config
  // webpack rule), though typed as StaticImageData — handle both defensively.
  const baseSrc = typeof base === "string" ? base : base.src;
  const scr = tpl.screen;
  const bs = tpl.baseSize;

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
  // Map the detected screen quad to px. A tiny overscan hides sub-pixel edge
  // slivers; the rounded corners now handle the corner fit, so it stays small.
  const corners = [scr.tl, scr.tr, scr.br, scr.bl];
  const mx = corners.reduce((s, c) => s + c[0], 0) / 4;
  const my = corners.reduce((s, c) => s + c[1], 0) / 4;
  const OVER = 0.004;
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

  // Round the screenshot to match the device screen's corner radius (applied in
  // the source box, before the warp, so it follows the perspective). Default is
  // derived from the intended aspect: phones round most, monitors least.
  const sa = tpl.suggested.w / tpl.suggested.h;
  const radiusFrac =
    tpl.radius ??
    (sa < 0.6 ? 0.06 : sa < 0.95 ? 0.032 : sa <= 1.5 ? 0.022 : 0.013);
  const radiusPx = radiusFrac * tpl.suggested.w;

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
            borderRadius: `${radiusPx}px`,
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

export function MockupFrame({
  templateId,
  screenshot,
  alt,
  className,
}: MockupFrameProps) {
  const tpl = getMockupTemplate(templateId);
  if (!tpl || !screenshot) return null;
  return (
    <PhotoFrame
      tpl={tpl}
      screenshot={screenshot}
      alt={alt}
      className={className}
    />
  );
}
