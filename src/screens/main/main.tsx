"use client";

import { FloatingNavbar } from "@/components";

/**
 * Main wrapper used as the root screen.
 * In the Next.js migration, routing is handled by the App Router,
 * so <Outlet /> (react-router-dom) is removed. FloatingNavbar is still
 * rendered here so every 2024 sub-page gets it.
 *
 * Usage: imported by portfolio-2024 shell components as a wrapper.
 */
export const Main = ({ children }: { children?: React.ReactNode }) => {
  return (
    <>
      <FloatingNavbar />
      {children}
    </>
  );
};
