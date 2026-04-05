"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// 2024-exclusive UI chrome — floating settings panel + particle background.
// Both are heavy, so they're dynamically imported and the particle system is
// deferred until the browser is idle to keep first paint fast.

const FloatingNavigation = dynamic(
  () =>
    import("@/components/draggable/floating-navigation").then(
      (m) => m.FloatingNavigation
    ),
  { ssr: false }
);

const BackgroundParticle = dynamic(
  () =>
    import("@/components/particles/background-particle").then(
      (m) => m.BackgroundParticle
    ),
  { ssr: false }
);

export function Layout2024Client({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mountParticles, setMountParticles] = useState(false);

  useEffect(() => {
    const id =
      typeof requestIdleCallback !== "undefined"
        ? requestIdleCallback(() => setMountParticles(true), { timeout: 3000 })
        : setTimeout(() => setMountParticles(true), 1500);

    return () => {
      if (typeof requestIdleCallback !== "undefined") {
        cancelIdleCallback(id as number);
      } else {
        clearTimeout(id as ReturnType<typeof setTimeout>);
      }
    };
  }, []);

  return (
    <>
      {/* children MUST come first — FloatingNavigation and BackgroundParticle
          use ssr:false so they render as null on the server but mount on the
          client. Placing them after children keeps every fiber node inside
          children at the same tree position on both server and client,
          preventing useId() mismatches in forms (Radix UI FormItem). */}
      {children}
      <FloatingNavigation />
      {mountParticles && <BackgroundParticle />}
    </>
  );
}
