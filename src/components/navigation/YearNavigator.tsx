"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  YEARS,
  getPrevYear,
  getNextYear,
  type YearConfig,
} from "@/config/years";
import { YearPreview } from "./YearPreview";
import { cn } from "@/lib/utils";

/**
 * Floating year navigator — fixed bottom-left (prev) and bottom-right (next).
 *
 * Features:
 *  - Derives prev/next from the YEARS config
 *  - Framer Motion enter/exit animations
 *  - Keyboard navigation: ← / →
 *  - Hover to preview the target year in an iframe
 *  - Timeline indicator centred at the bottom
 */
export function YearNavigator() {
  const router = useRouter();
  const pathname = usePathname();

  // Derive the active year from the current pathname (e.g. "/2024" → 2024)
  const activeYear = deriveYear(pathname);
  const prev = activeYear ? getPrevYear(activeYear) : undefined;
  const next = activeYear ? getNextYear(activeYear) : undefined;

  const [previewYear, setPreviewYear] = useState<YearConfig | null>(null);

  const navigate = useCallback(
    (target: YearConfig) => {
      router.push(target.path);
    },
    [router]
  );

  // ── Keyboard navigation ──────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && prev) navigate(prev);
      if (e.key === "ArrowRight" && next) navigate(next);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next, navigate]);

  if (!activeYear) return null; // Only render on /(years)/* routes

  const enabledYears = YEARS.filter((y) => y.enabled).sort(
    (a, b) => a.year - b.year
  );

  return (
    <>
      {/* ── Previous year pill (bottom-left) ─────────────────────────── */}
      <AnimatePresence>
        {prev && (
          <motion.button
            key={`prev-${prev.year}`}
            className={cn("year-nav-pill year-nav-pill-prev")}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={() => navigate(prev)}
            onMouseEnter={() => setPreviewYear(prev)}
            onMouseLeave={() => setPreviewYear(null)}
            aria-label={`Go to ${prev.year} portfolio`}
          >
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">{prev.year}</span>
            <span className="hidden text-muted-foreground sm:inline">
              &larr; Previous
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Next year pill (bottom-right) ─────────────────────────────── */}
      <AnimatePresence>
        {next && (
          <motion.button
            key={`next-${next.year}`}
            className={cn("year-nav-pill year-nav-pill-next")}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={() => navigate(next)}
            onMouseEnter={() => setPreviewYear(next)}
            onMouseLeave={() => setPreviewYear(null)}
            aria-label={`Go to ${next.year} portfolio`}
          >
            <span className="hidden text-muted-foreground sm:inline">
              Next &rarr;
            </span>
            <span className="font-semibold">{next.year}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Timeline dots (bottom-centre) ──────────────────────────────── */}
      <div className="year-timeline" role="tablist" aria-label="Year timeline">
        {enabledYears.map((y) => (
          <button
            key={y.year}
            role="tab"
            aria-selected={y.year === activeYear}
            aria-label={`${y.year} portfolio`}
            onClick={() => navigate(y)}
            className={cn(
              "year-timeline-dot",
              y.year === activeYear && "year-timeline-dot-active"
            )}
          />
        ))}
      </div>

      {/* ── Iframe preview on hover ─────────────────────────────────────── */}
      <AnimatePresence>
        {previewYear && (
          <YearPreview
            key={previewYear.year}
            year={previewYear}
            onClose={() => setPreviewYear(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/** Extract year number from pathname like "/2024", "/2025/about", etc. */
function deriveYear(pathname: string): number | null {
  const match = pathname.match(/^\/(\d{4})/);
  if (!match) return null;
  const year = parseInt(match[1], 10);
  return YEARS.some((y) => y.year === year) ? year : null;
}
