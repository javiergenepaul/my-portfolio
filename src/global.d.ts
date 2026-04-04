/// <reference types="next" />
/// <reference types="next/image-types/global" />

// CSS imports (e.g. import './globals.css' in layout.tsx)
declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}

// Static asset imports — return URL strings via webpack asset/resource
declare module "*.svg" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.webp" {
  const src: string;
  export default src;
}

declare module "*.gif" {
  const src: string;
  export default src;
}

declare module "*.pdf" {
  const src: string;
  export default src;
}
