"use client";

import { useState, useEffect } from "react";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

/** True on small laptop screens (< 1400px wide or < 820px tall) */
export function useIsCompact() {
  const [compact, setCompact] = useState(true);
  useEffect(() => {
    const check = () =>
      setCompact(window.innerWidth < 1400 || window.innerHeight < 820);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return compact;
}
