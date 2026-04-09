"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { BookOpen } from "lucide-react";
import { Banner } from "../../components";
import { getColor } from "@/lib";
import { useSettingsStore } from "@/stores";
import { cn } from "@/lib/utils";
import { BOOKS, type BookInterface } from "@/config";

const THEME_STYLES: Record<string, string> = {
  Purpose:    "bg-blue-500/10 text-blue-500",
  Humility:   "bg-amber-500/10 text-amber-500",
  Systems:    "bg-emerald-500/10 text-emerald-500",
  Resilience: "bg-rose-500/10 text-rose-500",
  Stoicism:   "bg-violet-500/10 text-violet-500",
  Focus:      "bg-cyan-500/10 text-cyan-500",
  Leadership: "bg-orange-500/10 text-orange-500",
};

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

function BookCard({ book, index, accent }: { book: BookInterface; index: number; accent: string }) {
  const themeStyle = THEME_STYLES[book.theme] ?? "bg-muted text-muted-foreground";

  return (
    <motion.div
      variants={item}
      className="group relative rounded-xl border border-border bg-card shadow-sm flex flex-col overflow-hidden"
    >
      {/* Colored top bar */}
      <div
        className="h-1 w-full shrink-0"
        style={{ backgroundColor: accent, opacity: 0.7 }}
      />

      <div className="flex flex-col gap-4 p-5 flex-1">
        {/* Number + theme */}
        <div className="flex items-center justify-between gap-2">
          <span
            className="text-xs font-bold tabular-nums"
            style={{ color: accent }}
            aria-hidden
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className={cn("text-[10px] font-semibold px-2.5 py-0.5 rounded-full shrink-0", themeStyle)}>
            {book.theme}
          </span>
        </div>

        {/* Quote */}
        <blockquote className="flex-1">
          <BookOpen
            className="h-3.5 w-3.5 mb-2 opacity-40"
            style={{ color: accent }}
            aria-hidden
          />
          <p className="text-sm leading-relaxed text-muted-foreground italic line-clamp-4">
            "{book.quote}"
          </p>
        </blockquote>

        {/* Divider */}
        <div className="h-px w-full bg-border" />

        {/* Title + author + reflection */}
        <div className="space-y-1">
          <p className="text-sm font-bold leading-tight">{book.title}</p>
          <p className="text-xs text-muted-foreground">{book.author}</p>
        </div>

        <p className="text-[11px] text-muted-foreground/70 leading-relaxed">
          {book.reflection}
        </p>
      </div>
    </motion.div>
  );
}

export const BooksSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { color } = useSettingsStore();
  const accent = getColor(color);

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
            Reading List
          </p>
          <h2 className="text-2xl font-bold">Books that shaped me</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
            Not just books I've read — books I return to. Each one left a dent in how I think, build, and lead.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {BOOKS.map((book, index) => (
            <BookCard key={book.title} book={book} index={index} accent={accent} />
          ))}
        </motion.div>
      </section>
    </div>
  );
};
