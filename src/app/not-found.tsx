"use client";

import Link from "next/link";
import { CURRENT_YEAR } from "@/config/years";
import { Button } from "@/components/common/ui/button";
import { FadeAnimation } from "@/components/common/animation";

export default function NotFound() {
  return (
    <FadeAnimation>
      <div className="flex min-h-dvh flex-col items-center justify-center gap-6 text-center px-4">
        <h1 className="text-8xl font-bold text-primary">404</h1>
        <p className="text-2xl font-semibold">Page Not Found</p>
        <p className="text-muted-foreground max-w-md">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button asChild>
          <Link href={`/${CURRENT_YEAR}`}>Back to Portfolio</Link>
        </Button>
      </div>
    </FadeAnimation>
  );
}
