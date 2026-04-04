"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CURRENT_YEAR } from "@/config/years";

export default function Page2026() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-8 px-6 text-center">
      {/* Year badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <span className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          2026 Edition
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        className="text-6xl font-bold tracking-tight sm:text-7xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        Coming Soon
      </motion.h1>

      {/* Sub-copy */}
      <motion.p
        className="max-w-md text-lg text-muted-foreground"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
      >
        The 2026 edition is planned for the future. In the meantime, explore
        earlier years for projects and experience.
      </motion.p>

      {/* CTA */}
      <motion.div
        className="flex gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
      >
        <Button asChild>
          <Link href={`/${CURRENT_YEAR}`}>View {CURRENT_YEAR} Portfolio</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/2025">View 2025</Link>
        </Button>
      </motion.div>

      {/* Decorative blurred circle */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden"
      >
        <div className="h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
      </div>
    </div>
  );
}
