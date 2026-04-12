"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { triggerNavigationStart } from "./NavigationProgress";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  YEARS,
  getPrevYear,
  getNextYear,
  type YearConfig,
} from "@/config/years";
import { cn } from "@/lib/utils";

/**
 * Floating year navigator — fixed bottom-left (prev) and bottom-right (next).
 *
 * Features:
 *  - Each button is a mini-screen showing an iframe preview of the target year
 *  - Top progress bar while navigation is in flight
 *  - Keyboard navigation: ← / →
 *  - Timeline indicator centred at the bottom
 */
export function YearNavigator() {
  const router = useRouter();
  const pathname = usePathname();

  const activeYear = deriveYear(pathname);
  const prev = activeYear ? getPrevYear(activeYear) : undefined;
  const next = activeYear ? getNextYear(activeYear) : undefined;

  const [navigating, setNavigating] = useState(false);

  const navigate = useCallback(
    (target: YearConfig) => {
      setNavigating(true);
      triggerNavigationStart();
      router.push(target.path);
    },
    [router],
  );

  // Reset loading flag once Next.js has committed the new route
  useEffect(() => {
    setNavigating(false);
  }, [pathname]);

  // ── Keyboard navigation ──────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && prev) navigate(prev);
      if (e.key === "ArrowRight" && next) navigate(next);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next, navigate]);

  if (!activeYear) return null;

  const enabledYears = YEARS.filter((y) => y.enabled).sort(
    (a, b) => a.year - b.year,
  );

  return (
    <>
      {/* ── Top loading bar ─────────────────────────────────────────────── */}
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
            exit={{ width: "100%", opacity: 0, transition: { duration: 0.25 } }}
          />
        )}
      </AnimatePresence>

      {/* ── Previous year mini screen (bottom-left) ─────────────────────── */}
      <AnimatePresence>
        {prev && (
          <motion.button
            key={`prev-${prev.year}`}
            className="year-nav-screen year-nav-screen-prev"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={() => navigate(prev)}
            aria-label={`Go to ${prev.year} portfolio`}
          >
            <YearMiniScreen year={prev} />
            <div className="year-nav-screen-label">
              <ChevronLeft className="h-3 w-3" />
              <span>{prev.year}</span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Next year mini screen (bottom-right) ────────────────────────── */}
      <AnimatePresence>
        {next && (
          <motion.button
            key={`next-${next.year}`}
            className="year-nav-screen year-nav-screen-next"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={() => navigate(next)}
            aria-label={`Go to ${next.year} portfolio`}
          >
            <YearMiniScreen year={next} />
            <div className="year-nav-screen-label">
              <span>{next.year}</span>
              <ChevronRight className="h-3 w-3" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Timeline dots (bottom-centre) — hidden on 2026 (dock overlap) ── */}
      <TooltipProvider delayDuration={200}>
        <div
          className="year-timeline"
          role="tablist"
          aria-label="Year timeline"
          style={activeYear === 2026 ? { display: "none" } : undefined}
        >
          {enabledYears.map((y) => (
            <Tooltip key={y.year}>
              <TooltipTrigger asChild>
                <button
                  role="tab"
                  aria-selected={y.year === activeYear}
                  aria-label={`${y.year} portfolio`}
                  onClick={() => navigate(y)}
                  className={cn(
                    "year-timeline-dot",
                    y.year === activeYear && "year-timeline-dot-active",
                  )}
                />
              </TooltipTrigger>
              <TooltipContent
                side="top"
                sideOffset={12}
                className="w-64 p-0 overflow-hidden"
              >
                {/* iframe preview */}
                <YearTooltipPreview year={y} />

                {/* Info */}
                <div className="flex flex-col gap-2 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm">
                      My Portfolio &middot; {y.year}
                    </span>
                    {y.year === activeYear && (
                      <span className="shrink-0 rounded-full bg-primary/20 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-primary">
                        Viewing
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground/70">
                      Theme:
                    </span>{" "}
                    {y.theme}
                  </p>

                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {y.journey}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </>
  );
}

/** Mini iframe thumbnail embedded directly inside the nav button. */
function YearMiniScreen({ year }: { year: YearConfig }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="year-mini-screen">
      {!loaded && (
        <div className="year-mini-screen-skeleton">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}
      <iframe
        src={year.path}
        title={`${year.year} portfolio preview`}
        className={cn(
          "year-mini-screen-iframe",
          loaded ? "opacity-100" : "opacity-0",
        )}
        style={{
          width: "800px",
          height: "500px",
          transform: "scale(0.2)",
          transformOrigin: "top left",
          border: "none",
          pointerEvents: "none",
          userSelect: "none",
        }}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        sandbox="allow-same-origin allow-scripts"
      />
    </div>
  );
}

/** Iframe preview sized to fill the 256px-wide tooltip (w-64). */
function YearTooltipPreview({ year }: { year: YearConfig }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full h-36 overflow-hidden bg-muted">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}
      <iframe
        src={year.path}
        title={`${year.year} preview`}
        className={cn(
          "absolute top-0 left-0",
          loaded ? "opacity-100" : "opacity-0",
        )}
        style={{
          width: "800px",
          height: "450px",
          transform: "scale(0.32)",
          transformOrigin: "top left",
          border: "none",
          pointerEvents: "none",
          userSelect: "none",
          transition: "opacity 0.2s",
        }}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        sandbox="allow-same-origin allow-scripts"
      />
      {/* Year badge */}
      <div className="absolute top-2 left-2 rounded-full border border-white/20 bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
        {year.year}
      </div>
    </div>
  );
}

/** Extract year number from pathname like "/2024", "/2025/about", etc. */
function deriveYear(pathname: string): number | null {
  const match = pathname.match(/^\/(\d{4})/);
  if (!match) return null;
  const year = parseInt(match[1], 10);
  return YEARS.some((y) => y.year === year) ? year : null;
}
