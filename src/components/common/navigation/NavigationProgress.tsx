"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

/** Dispatch this event anywhere you call router.push() programmatically. */
export function triggerNavigationStart() {
  window.dispatchEvent(new CustomEvent("navigation-start"));
}

/**
 * Thin top progress bar that appears whenever the user navigates between
 * pages. Works with:
 *  - <a href> / Next.js <Link> clicks (document click listener)
 *  - Programmatic router.push() calls that dispatch "navigation-start"
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const [navigating, setNavigating] = useState(false);

  // Start bar on programmatic navigation (router.push via triggerNavigationStart)
  useEffect(() => {
    const handle = () => setNavigating(true);
    window.addEventListener("navigation-start", handle);
    return () => window.removeEventListener("navigation-start", handle);
  }, []);

  // Start bar when an internal anchor is clicked
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as Element).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Only internal paths (starts with /) — skip external, hash-only, mailto, etc.
      if (!href.startsWith("/")) return;

      // Don't re-trigger if already on that path
      if (href === pathname) return;

      setNavigating(true);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname]);

  // Complete bar when Next.js commits the new route
  useEffect(() => {
    setNavigating(false);
  }, [pathname]);

  return (
    <AnimatePresence>
      {navigating && (
        <motion.div
          key="nav-progress"
          className="fixed top-0 left-0 z-100 h-0.5 bg-primary"
          initial={{ width: "0%" }}
          animate={{
            width: "80%",
            transition: { duration: 2, ease: "easeOut" },
          }}
          exit={{
            width: "100%",
            opacity: 0,
            transition: { duration: 0.25 },
          }}
        />
      )}
    </AnimatePresence>
  );
}
