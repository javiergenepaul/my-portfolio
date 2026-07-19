import type { StaticImageData } from "next/image";
import {
  ProjectTest01,
  ProjectTest03,
  ProjectTest04,
  ProjectTest05,
} from "@/assets/projects/test";
import {
  LaptopConsole,
  IphoneIsland,
  IphoneStanding,
  MonitorUltrawide,
  MonitorSetup,
  IpadHands,
  IpadKeyboard,
  IpadPencil,
  IphoneMinimal,
  IphoneHands,
  IphoneFlatlay,
  IphoneGradient,
  IphoneBokeh,
  Imac,
  IpadUpright,
  IphoneOffice,
} from "@/assets/projects/scenes";

/**
 * Mockup templates — real-world device photos a project screenshot is warped
 * into (the blank screen of a desk-scene photo). The admin picks a device
 * group (Desktop / Mobile) then a template.
 *
 * Adding a template: drop a blank-screen device photo into
 * src/assets/projects, detect its screen-quad corners (fractions of the image,
 * order TL,TR,BR,BL — see scripts/detect-screen.js), and add an entry below.
 */

export type MockupDevice = "desktop" | "mobile";

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
  device: MockupDevice;
  /** Recommended screenshot upload size (px). */
  suggested: { w: number; h: number };
  /** Human aspect note shown next to the size. */
  aspect: string;
  /** Backdrop photo (typed StaticImageData but a URL string at runtime — see
   *  the next.config webpack rule; consumers handle both). */
  baseImage: string | StaticImageData;
  /** Blank-screen quad the screenshot is warped into. */
  screen: MockupScreenQuad;
  /** Base photo natural pixel size — drives the frame aspect + overlay math. */
  baseSize: { w: number; h: number };
  /** Screen corner radius as a fraction of the screenshot width. Defaults from
   *  the device aspect (phones round most, monitors least). */
  radius?: number;
}

/** Top-level frame groups the admin chooses between. */
export const MOCKUP_DEVICES: { id: MockupDevice; label: string }[] = [
  { id: "desktop", label: "Desktop" },
  { id: "mobile", label: "Mobile" },
];

export const MOCKUP_TEMPLATES: MockupTemplate[] = [
  {
    id: "monitor",
    label: "Desktop monitor",
    device: "desktop",
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
    label: "MacBook, angled",
    device: "desktop",
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
    id: "macbook-front",
    label: "MacBook (front)",
    device: "desktop",
    suggested: { w: 1600, h: 1000 },
    aspect: "16:10 · on a desk",
    baseImage: ProjectTest05,
    baseSize: { w: 1440, h: 1024 },
    // Detected from the gray screen (brightness + low-saturation mask) — the
    // screen tilts slightly clockwise (right side lower).
    screen: {
      tl: [0.354, 0.259],
      tr: [0.742, 0.277],
      br: [0.715, 0.639],
      bl: [0.32, 0.601],
    },
  },
  {
    id: "monitor-ultrawide",
    label: "Ultrawide monitor",
    device: "desktop",
    suggested: { w: 2560, h: 1080 },
    aspect: "21:9 · ultrawide",
    baseImage: MonitorUltrawide,
    baseSize: { w: 1600, h: 1200 },
    screen: {
      tl: [0.112, 0.178],
      tr: [0.891, 0.178],
      br: [0.891, 0.63],
      bl: [0.112, 0.63],
    },
  },
  {
    id: "monitor-setup",
    label: "Ultrawide + keyboard",
    device: "desktop",
    suggested: { w: 2560, h: 1080 },
    aspect: "21:9 · desk setup",
    baseImage: MonitorSetup,
    baseSize: { w: 1600, h: 1200 },
    screen: {
      tl: [0.159, 0.142],
      tr: [0.863, 0.142],
      br: [0.863, 0.541],
      bl: [0.159, 0.541],
    },
  },
  {
    id: "imac",
    label: "iMac",
    device: "desktop",
    suggested: { w: 1920, h: 1080 },
    aspect: "16:9 · on a desk",
    baseImage: Imac,
    baseSize: { w: 1400, h: 933 },
    screen: {
      tl: [0.283, 0.301],
      tr: [0.732, 0.301],
      br: [0.732, 0.679],
      bl: [0.283, 0.679],
    },
  },
  {
    id: "ipad-landscape",
    label: "iPad (upright)",
    device: "desktop",
    suggested: { w: 1536, h: 2048 },
    aspect: "3:4 · held",
    baseImage: IpadUpright,
    baseSize: { w: 1400, h: 788 },
    screen: {
      tl: [0.417, 0.067],
      tr: [0.683, 0.179],
      br: [0.585, 0.854],
      bl: [0.328, 0.739],
    },
  },
  {
    id: "ipad-hands",
    label: "iPad (held)",
    device: "desktop",
    suggested: { w: 1600, h: 1120 },
    aspect: "4:3 · held",
    baseImage: IpadHands,
    baseSize: { w: 1400, h: 788 },
    screen: {
      tl: [0.21, 0.116],
      tr: [0.786, 0.116],
      br: [0.786, 0.835],
      bl: [0.21, 0.835],
    },
  },
  {
    id: "ipad-keyboard",
    label: "iPad + keyboard",
    device: "desktop",
    suggested: { w: 1600, h: 1200 },
    aspect: "4:3 · flat lay",
    baseImage: IpadKeyboard,
    baseSize: { w: 1400, h: 1913 },
    screen: {
      tl: [0.165, 0.214],
      tr: [0.79, 0.214],
      br: [0.79, 0.556],
      bl: [0.165, 0.556],
    },
  },
  {
    id: "laptop-console",
    label: "Laptop (front)",
    device: "desktop",
    suggested: { w: 1600, h: 1000 },
    aspect: "16:10 · on a shelf",
    baseImage: LaptopConsole,
    baseSize: { w: 1600, h: 1067 },
    screen: {
      tl: [0.291, 0.333],
      tr: [0.71, 0.333],
      br: [0.71, 0.72],
      bl: [0.291, 0.72],
    },
  },
  {
    id: "iphone-island",
    label: "iPhone (front)",
    device: "mobile",
    suggested: { w: 1080, h: 2340 },
    aspect: "9:19.5 · floating",
    baseImage: IphoneIsland,
    baseSize: { w: 1600, h: 2000 },
    screen: {
      tl: [0.316, 0.184],
      tr: [0.686, 0.184],
      br: [0.686, 0.82],
      bl: [0.316, 0.82],
    },
  },
  {
    id: "iphone-standing",
    label: "iPhone (standing)",
    device: "mobile",
    suggested: { w: 1080, h: 2340 },
    aspect: "9:19.5 · on wood",
    baseImage: IphoneStanding,
    baseSize: { w: 1600, h: 1067 },
    // Slight lean — screen treated as near-axis-aligned; nudge if off.
    screen: {
      tl: [0.275, 0.184],
      tr: [0.482, 0.184],
      br: [0.482, 0.814],
      bl: [0.275, 0.814],
    },
  },
  {
    id: "iphone-minimal",
    label: "iPhone (minimal)",
    device: "mobile",
    suggested: { w: 1080, h: 2340 },
    aspect: "9:19.5 · floating",
    baseImage: IphoneMinimal,
    baseSize: { w: 1400, h: 933 },
    screen: {
      tl: [0.39, 0.142],
      tr: [0.613, 0.142],
      br: [0.613, 0.87],
      bl: [0.39, 0.87],
    },
  },
  {
    id: "iphone-hands",
    label: "iPhone (in hands)",
    device: "mobile",
    suggested: { w: 1080, h: 2340 },
    aspect: "9:19.5 · held",
    baseImage: IphoneHands,
    baseSize: { w: 1400, h: 784 },
    screen: {
      tl: [0.383, 0.104],
      tr: [0.591, 0.104],
      br: [0.591, 0.901],
      bl: [0.383, 0.901],
    },
  },
  {
    id: "iphone-flatlay",
    label: "iPhone (flat lay)",
    device: "mobile",
    suggested: { w: 1080, h: 2340 },
    aspect: "9:19.5 · flat lay",
    baseImage: IphoneFlatlay,
    baseSize: { w: 1400, h: 1120 },
    screen: {
      tl: [0.301, 0.356],
      tr: [0.435, 0.356],
      br: [0.435, 0.719],
      bl: [0.301, 0.719],
    },
  },
  {
    id: "ipad-portrait",
    label: "iPad (Pencil)",
    device: "mobile",
    suggested: { w: 1536, h: 2048 },
    aspect: "3:4 · with pencil",
    baseImage: IpadPencil,
    baseSize: { w: 1400, h: 2100 },
    screen: {
      tl: [0.336, 0.381],
      tr: [0.8, 0.402],
      br: [0.811, 0.819],
      bl: [0.393, 0.835],
    },
  },
  {
    id: "iphone-office",
    label: "iPhone (office)",
    device: "mobile",
    suggested: { w: 1080, h: 2340 },
    aspect: "9:19.5 · office",
    baseImage: IphoneOffice,
    baseSize: { w: 1400, h: 934 },
    screen: {
      tl: [0.436, 0.185],
      tr: [0.559, 0.193],
      br: [0.572, 0.602],
      bl: [0.445, 0.616],
    },
  },
  {
    id: "iphone-bokeh",
    label: "iPhone (bokeh)",
    device: "mobile",
    suggested: { w: 1080, h: 2340 },
    aspect: "9:19.5 · held",
    baseImage: IphoneBokeh,
    baseSize: { w: 1400, h: 934 },
    screen: {
      tl: [0.271, 0.214],
      tr: [0.457, 0.199],
      br: [0.514, 0.811],
      bl: [0.328, 0.853],
    },
  },
  {
    id: "iphone-gradient",
    label: "iPhone (gradient)",
    device: "mobile",
    suggested: { w: 1080, h: 2340 },
    aspect: "9:19.5 · held",
    baseImage: IphoneGradient,
    baseSize: { w: 1400, h: 916 },
    screen: {
      tl: [0.422, 0.306],
      tr: [0.543, 0.303],
      br: [0.578, 0.712],
      bl: [0.45, 0.731],
    },
  },
  {
    id: "phone-scene",
    label: "Phone on desk",
    device: "mobile",
    suggested: { w: 1080, h: 2340 },
    aspect: "9:19.5 · on a desk",
    baseImage: ProjectTest01,
    baseSize: { w: 1440, h: 1024 },
    screen: {
      tl: [0.333, 0.283],
      tr: [0.484, 0.214],
      br: [0.629, 0.682],
      bl: [0.477, 0.761],
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

/** Short upload-size hint for the admin (each template also lists its own). */
export const MOCKUP_SIZE_HINT =
  "Desktop ≈ 1600×900, Mobile ≈ 1080×2340 — each frame shows its own";
