"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Icon } from "@iconify/react";
import { Banner } from "../../components";
import { getColor } from "@/lib";
import {
  useSettingsStore,
  useLanguageStore,
  type LanguageType,
} from "@/stores";
import { cn } from "@/lib/utils";
import {
  LANGUAGES,
  type ProficiencyLevel,
  type LanguageInterface,
} from "@/config";

const PROFICIENCY: Record<ProficiencyLevel, { pct: number; style: string }> = {
  Native: { pct: 100, style: "bg-emerald-500/15 text-emerald-500" },
  Fluent: { pct: 85, style: "bg-blue-500/15 text-blue-500" },
  Conversational: { pct: 55, style: "bg-amber-500/15 text-amber-500" },
  Basic: { pct: 25, style: "bg-rose-500/15 text-rose-500" },
};

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

function LanguageCard({
  lang,
  accent,
  active,
  onHoverStart,
  onHoverEnd,
  onClick,
}: {
  lang: LanguageInterface;
  accent: string;
  active: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onClick: () => void;
}) {
  const { pct, style } = PROFICIENCY[lang.level];

  return (
    <motion.div
      variants={item}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onClick={onClick}
      className={cn(
        "rounded-xl border bg-card shadow-sm cursor-pointer transition-colors duration-200",
        "p-4 flex flex-row items-center gap-4",
        "sm:p-5 sm:flex-col sm:items-stretch sm:gap-4",
        active
          ? "border-primary shadow-md"
          : "border-border hover:border-primary/50",
      )}
    >
      {/* Flag — large on mobile (left), top row on sm+ */}
      <Icon
        icon={lang.flagIcon}
        className="h-12 w-12 shrink-0 sm:h-8 sm:w-8"
        aria-hidden
      />

      {/* Right side on mobile / full content on sm+ */}
      <div className="flex-1 min-w-0 flex flex-col gap-2 sm:gap-4">
        {/* Name + level badge */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-bold leading-tight sm:text-base">
              {lang.name}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {lang.nativeName}
            </p>
          </div>
          <span
            className={cn(
              "text-[10px] font-semibold px-2.5 py-0.5 rounded-full shrink-0",
              style,
            )}
          >
            {lang.level}
          </span>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: accent }}
              initial={{ width: 0 }}
              whileInView={{ width: `${pct}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground/70">{lang.note}</p>
        </div>
      </div>
    </motion.div>
  );
}

export const LanguageSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { color } = useSettingsStore();
  const accent = getColor(color);
  const { language, setLanguage } = useLanguageStore();
  const pinnedRef = useRef<LanguageType>(language);

  return (
    <div className="relative pb-16">
      <Banner />
      <section ref={ref} className="py-10">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-2">
            Languages
          </p>
          <h2 className="text-2xl font-bold">How I communicate</h2>
          <div className="flex items-center justify-center gap-1.5 mt-3">
            <Icon icon="circle-flags:ph" className="h-5 w-5" aria-hidden />
            <span className="text-xs text-muted-foreground">Filipino</span>
          </div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          {LANGUAGES.map((lang) => (
            <LanguageCard
              key={lang.name}
              lang={lang}
              accent={accent}
              active={language === lang.locale}
              onHoverStart={() => setLanguage(lang.locale)}
              onHoverEnd={() => setLanguage(pinnedRef.current)}
              onClick={() => {
                pinnedRef.current = lang.locale;
                setLanguage(lang.locale);
              }}
            />
          ))}
        </motion.div>
      </section>
    </div>
  );
};
