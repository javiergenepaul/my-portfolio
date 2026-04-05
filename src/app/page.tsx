"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { YEARS, type YearConfig } from "@/config/years";
import { cn } from "@/lib/utils";

export default function RootPage() {
  const enabledYears = YEARS.filter((y) => y.enabled).sort(
    (a, b) => a.year - b.year
  );

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#08080c] text-white flex flex-col">
      {/* Star field background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#0d1a2a_0%,#08080c_60%)]" />
        {/* CSS star dots */}
        <div className="stars-sm" />
        <div className="stars-md" />
      </div>

      {/* Header */}
      <header className="pt-16 pb-6 text-center px-6">
        <motion.p
          className="text-xs font-semibold uppercase tracking-[0.3em] text-white/30 mb-3"
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

      {/* Year cards */}
      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="flex flex-wrap gap-8 justify-center items-start">
          {enabledYears.map((year, i) => (
            <YearCard key={year.year} year={year} index={i} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="pb-8 text-center text-xs text-white/20">
        &copy; {new Date().getFullYear()} Gene Paul Mar Javier
      </footer>
    </div>
  );
}

function YearCard({ year, index }: { year: YearConfig; index: number }) {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const isComingSoon = year.theme === "Coming Soon";

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.12, ease: "easeOut" }}
      onClick={() => router.push(year.path)}
      className={cn(
        "group relative w-72 cursor-pointer select-none",
        "rounded-2xl border border-white/8 bg-white/3",
        "hover:border-white/20 hover:bg-white/6",
        "transition-all duration-300",
        "shadow-[0_4px_32px_rgba(0,0,0,0.4)]",
        "hover:shadow-[0_8px_48px_rgba(0,0,0,0.6)]",
        "hover:-translate-y-1"
      )}
    >
      {/* ── iframe preview ─────────────────────────────────────────── */}
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
            loaded ? "opacity-100" : "opacity-0"
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

        {/* Coming-soon tint */}
        {isComingSoon && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/70">
              Coming Soon
            </span>
          </div>
        )}

        {/* Year badge */}
        <div className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/50 px-2.5 py-0.5 text-xs font-bold backdrop-blur-sm">
          {year.year}
        </div>
      </div>

      {/* ── Card body ──────────────────────────────────────────────── */}
      <div className="px-5 py-4 space-y-3">
        {/* Title */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white/90">
            My Portfolio&nbsp;·&nbsp;{year.year}
          </h2>
          <ArrowRight className="h-4 w-4 text-white/20 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-white/60" />
        </div>

        {/* Theme */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
            Theme
          </span>
          <span className="h-px flex-1 bg-white/8" />
          <span className="text-xs text-white/50">{year.theme}</span>
        </div>

        {/* Journey */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-1">
            My Journey
          </p>
          <p className="text-xs leading-relaxed text-white/50 line-clamp-2">
            {year.journey}
          </p>
        </div>
      </div>

      {/* Bottom CTA bar */}
      <div
        className={cn(
          "rounded-b-2xl border-t border-white/5 px-5 py-2.5",
          "flex items-center justify-between",
          "text-[11px] text-white/30 transition-colors duration-200",
          "group-hover:text-white/60"
        )}
      >
        <span>{isComingSoon ? "Preview available" : "Click to explore"}</span>
        <span className="font-semibold text-white/20 group-hover:text-white/50">
          {year.label} Edition
        </span>
      </div>
    </motion.article>
  );
}
