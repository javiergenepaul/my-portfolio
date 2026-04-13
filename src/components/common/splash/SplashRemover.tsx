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

    // Short delay so the first painted frame is fully composited before fade.
    const fadeTimer = setTimeout(() => {
      el.style.opacity = "0";
      el.style.pointerEvents = "none";
    }, 120);

    const removeTimer = setTimeout(() => el.remove(), 650);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  return null;
}
