"use client";

import { useEffect } from "react";

/**
 * Fades out and removes the server-rendered splash screen once the React
 * tree has hydrated. Must be rendered inside the Providers tree so the
 * splash stays visible until the app is genuinely ready to display.
 */
export function SplashRemover() {
  useEffect(() => {
    const el = document.getElementById("__splash");
    if (!el) return;

    // The splash is faded out by a CSS animation on first paint (see the
    // #__splash rule in layout.tsx), independent of hydration — so it never
    // gates LCP. Nothing mutates this React-owned node before hydration; we
    // only remove it from the DOM here, after the tree has hydrated.
    const removeTimer = setTimeout(() => el.remove(), 700);
    return () => clearTimeout(removeTimer);
  }, []);

  return null;
}
