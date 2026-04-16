"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { YEARS, type YearConfig } from "@/config/years";
import { cn } from "@/lib/utils";

function SplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const timeoutId = setTimeout(onDone, 1800);
    return () => clearTimeout(timeoutId);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#08080c]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <motion.p
        className="mb-4 text-[10px] font-semibold uppercase tracking-[0.4em] text-white/30"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Portfolio
      </motion.p>
      <motion.p
        className="text-4xl font-bold tracking-tight text-white sm:text-5xl"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.22 }}
      >
        Gene Paul Mar Javier
      </motion.p>
      <motion.div
        className="mt-8 h-px w-16 bg-white/20"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      />
    </motion.div>
  );
}

export function RootLanding() {
  const [splash, setSplash] = useState(true);
  const [navigating, setNavigating] = useState(false);
  const enabledYears = YEARS.filter((year) => year.enabled).sort(
    (left, right) => left.year - right.year,
  );

  return (
    <>
      <AnimatePresence>
        {splash && <SplashScreen onDone={() => setSplash(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {navigating && (
          <motion.div
            key="root-progress"
            className="fixed left-0 top-0 z-50 h-0.5 bg-white/60"
            initial={{ width: "0%" }}
            animate={{
              width: "80%",
              transition: { duration: 2, ease: "easeOut" },
            }}
            exit={{ width: "100%", opacity: 0, transition: { duration: 0.25 } }}
          />
        )}
      </AnimatePresence>

      <div className="relative flex min-h-dvh flex-col overflow-hidden bg-[#08080c] text-white">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#0d1a2a_0%,#08080c_60%)]" />
          <div className="stars-sm" />
          <div className="stars-md" />
        </div>

        <header className="px-6 pb-6 pt-16 text-center">
          <motion.p
            className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/30"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Portfolio
          </motion.p>
          <motion.h1
            className="text-4xl font-bold tracking-tight sm:text-5xl"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            Gene Paul Mar Javier
          </motion.h1>
          <motion.p
            className="mt-3 text-sm text-white/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Select a year to explore my journey
          </motion.p>
        </header>

        <main className="flex flex-1 items-center justify-center px-6 py-10">
          <div className="flex flex-wrap items-start justify-center gap-8">
            {enabledYears.map((year, index) => (
              <YearCard
                key={year.year}
                year={year}
                index={index}
                onNavigate={() => setNavigating(true)}
              />
            ))}
          </div>
        </main>

        <footer className="pb-8 text-center text-xs text-white/20">
          &copy; {new Date().getFullYear()} Gene Paul Mar Javier
        </footer>
      </div>
    </>
  );
}

function YearCard({
  year,
  index,
  onNavigate,
}: {
  year: YearConfig;
  index: number;
  onNavigate: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const isComingSoon = year.theme === "Coming Soon";

  function handleNavigate() {
    setNavigating(true);
    onNavigate();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.12, ease: "easeOut" }}
      className={cn("w-72", navigating && "pointer-events-none")}
    >
      <Link
        href={year.path}
        onClick={handleNavigate}
        className={cn(
          "group relative block cursor-pointer select-none overflow-hidden rounded-2xl",
          "border border-white/8 bg-white/3 shadow-[0_4px_32px_rgba(0,0,0,0.4)]",
          "transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/6",
          "hover:shadow-[0_8px_48px_rgba(0,0,0,0.6)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08080c]",
        )}
        aria-label={`Open ${year.year} portfolio`}
      >
        <AnimatePresence>
          {navigating && (
            <motion.div
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-2xl bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Loader2 className="h-6 w-6 animate-spin text-white/70" />
              <span className="text-[11px] tracking-wide text-white/50">
                Loading {year.year}…
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative h-44 w-full overflow-hidden rounded-t-2xl bg-white/5">
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-white/20" />
            </div>
          )}

          <iframe
            src={year.path}
            title={`${year.year} portfolio preview`}
            className={cn(
              "absolute left-0 top-0 origin-top-left transition-opacity duration-300",
              loaded ? "opacity-100" : "opacity-0",
            )}
            style={{
              width: "200%",
              height: "200%",
              transform: "scale(0.5)",
              border: "none",
              pointerEvents: "none",
            }}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            sandbox="allow-same-origin allow-scripts"
          />

          {isComingSoon && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/70">
                Coming Soon
              </span>
            </div>
          )}

          <div className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/50 px-2.5 py-0.5 text-xs font-bold backdrop-blur-sm">
            {year.year}
          </div>
        </div>

        <div className="space-y-3 px-5 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white/90">
              My Portfolio&nbsp;·&nbsp;{year.year}
            </h2>
            <ArrowRight className="h-4 w-4 text-white/20 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-white/60" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
              Theme
            </span>
            <span className="h-px flex-1 bg-white/8" />
            <span className="text-xs text-white/50">{year.theme}</span>
          </div>

          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-white/30">
              My Journey
            </p>
            <p className="line-clamp-2 text-xs leading-relaxed text-white/50">
              {year.journey}
            </p>
          </div>
        </div>

        <div
          className={cn(
            "flex items-center justify-between rounded-b-2xl border-t border-white/5 px-5 py-2.5",
            "text-[11px] text-white/30 transition-colors duration-200 group-hover:text-white/60",
          )}
        >
          <span>{isComingSoon ? "Preview available" : "Click to explore"}</span>
          <span className="font-semibold text-white/20 group-hover:text-white/50">
            {year.label} Edition
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
