/**
 * Mockup templates — the "frame" a project screenshot is dropped into on the
 * card. The admin picks a template, uploads a flat page screenshot at the
 * template's suggested size, and the same {@link MockupFrame} component renders
 * the composite everywhere (card + admin preview).
 *
 * Flat frames (browser / phone) are pure CSS chrome, so they need no
 * calibration and stay pixel-crisp. Photographic-scene frames (a screenshot
 * warped into a desk-photo's blank screen) are added in a later pass — they
 * carry a `screen` quad (corner fractions) for the perspective transform.
 */

import type { StaticImageData } from "next/image";
import {
  ProjectTest01,
  ProjectTest03,
  ProjectTest04,
} from "@/assets/projects/test";

export type MockupDevice = "desktop" | "mobile";
export type MockupTemplateKind = "browser" | "phone" | "photo";

/** Screen-quad corners as fractions (0–1) of the base image, order TL,TR,BR,BL. */
export interface MockupScreenQuad {
  tl: [number, number];
  tr: [number, number];
  br: [number, number];
  bl: [number, number];
}

export interface MockupTemplate {
  id: string;
  label: string;
  /** Which frame group the admin picks first (Desktop vs Mobile). */
  device: MockupDevice;
  kind: MockupTemplateKind;
  /** Recommended screenshot upload size (px), surfaced as an admin hint. */
  suggested: { w: number; h: number };
  /** Human aspect note shown next to the size. */
  aspect: string;
  /** Photo-scene frames only: the backdrop photo and its blank-screen quad.
   *  Typed StaticImageData but resolves to a URL string at runtime (see the
   *  next.config webpack rule); consumers handle both. */
  baseImage?: string | StaticImageData;
  screen?: MockupScreenQuad;
  /** Photo base natural pixel size — drives the frame aspect + overlay math. */
  baseSize?: { w: number; h: number };
}

/** Top-level frame groups the admin chooses between. */
export const MOCKUP_DEVICES: { id: MockupDevice; label: string }[] = [
  { id: "desktop", label: "Desktop" },
  { id: "mobile", label: "Mobile" },
];

export const MOCKUP_TEMPLATES: MockupTemplate[] = [
  {
    id: "browser",
    label: "Browser window",
    device: "desktop",
    kind: "browser",
    suggested: { w: 1600, h: 1000 },
    aspect: "16:10 · desktop",
  },
  {
    id: "phone",
    label: "Phone",
    device: "mobile",
    kind: "phone",
    suggested: { w: 1080, h: 2160 },
    aspect: "9:18 · mobile",
  },
  // Photographic scene frames — screenshot warped into the blank screen.
  // `screen` corners were detected from the (watermarked, placeholder) stock
  // photos; swap in licensed images + recalibrate before production.
  {
    id: "monitor",
    label: "Desktop monitor",
    device: "desktop",
    kind: "photo",
    suggested: { w: 1600, h: 900 },
    aspect: "16:9 · on a desk",
    baseImage: ProjectTest03,
    baseSize: { w: 1440, h: 1024 },
    screen: {
      tl: [0.348, 0.233],
      tr: [0.712, 0.233],
      br: [0.712, 0.52],
      bl: [0.348, 0.52],
    },
  },
  {
    id: "macbook",
    label: "MacBook (angled)",
    device: "desktop",
    kind: "photo",
    suggested: { w: 1440, h: 960 },
    aspect: "3:2 · on a desk",
    baseImage: ProjectTest04,
    baseSize: { w: 1440, h: 1024 },
    screen: {
      tl: [0.45, 0.35],
      tr: [0.899, 0.413],
      br: [0.816, 0.916],
      bl: [0.372, 0.761],
    },
  },
  {
    id: "phone-scene",
    label: "Phone on desk",
    device: "mobile",
    kind: "photo",
    suggested: { w: 1080, h: 2340 },
    aspect: "9:19.5 · on a desk",
    baseImage: ProjectTest01,
    baseSize: { w: 1440, h: 1024 },
    screen: {
      tl: [0.331, 0.302],
      tr: [0.468, 0.207],
      br: [0.631, 0.67],
      bl: [0.49, 0.766],
    },
  },
];

export const MOCKUP_TEMPLATE_IDS = MOCKUP_TEMPLATES.map((t) => t.id);

export function getMockupTemplate(
  id: string | undefined,
): MockupTemplate | undefined {
  return id ? MOCKUP_TEMPLATES.find((t) => t.id === id) : undefined;
}

/** Templates in a given device group — drives the picker modal. */
export function getTemplatesByDevice(device: MockupDevice): MockupTemplate[] {
  return MOCKUP_TEMPLATES.filter((t) => t.device === device);
}

/** e.g. "Browser window 1600×1000 · Phone 1080×2160" — for the upload hint. */
export const MOCKUP_SIZE_HINT = MOCKUP_TEMPLATES.map(
  (t) => `${t.label} ${t.suggested.w}×${t.suggested.h}`,
).join(" · ");
