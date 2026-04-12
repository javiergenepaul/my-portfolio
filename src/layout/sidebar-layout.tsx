"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSwipeable } from "react-swipeable";
import { twMerge } from "tailwind-merge";
import { ChevronLeft } from "lucide-react";
import { triggerNavigationStart } from "@/components/navigation/NavigationProgress";
import { SideBar } from "@/components/sidebar/sidebar";
import { PATH } from "@/config";
import { useSiderStore, useSettingsStore } from "@/stores";
import { translate, useLocaleRefresh } from "@/i18n";
import ContactLogo from "../assets/contact-logo.svg";

interface SideBarLayoutProps {
  children: React.ReactNode;
}

const isDev = process.env.NODE_ENV === "development";

export const SideBarLayout = ({ children }: SideBarLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { setIsOpen } = useSiderStore();
  const {
    font,
    sidenavSwipeToggle,
    sidenavSwipeSensitivity,
    isBackgroundOnly,
  } = useSettingsStore();
  useLocaleRefresh();

  const handlers = useSwipeable({
    onSwipedLeft: (event) => {
      if (
        sidenavSwipeToggle &&
        Math.abs(event.deltaX) >= sidenavSwipeSensitivity
      ) {
        setIsOpen(true);
      }
    },
    onSwipedRight: (event) => {
      if (Math.abs(event.deltaX) >= sidenavSwipeSensitivity) {
        setIsOpen(false);
      }
    },
  });

  const fontClass =
    {
      inter: "font-inter",
      "work-sans": "font-work-sans",
      poppins: "font-poppins",
    }[font] ?? "font-inter";

  const isSubPage = pathname !== PATH.HOME.path;

  const goHome = () => {
    triggerNavigationStart();
    router.push(PATH.HOME.path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* ── Mobile top nav ──────────────────────────────────────────── */}
      <nav
        className={twMerge(
          "block lg:hidden w-full h-fit py-2.5 px-6 bg-primary dark:bg-primary/60 backdrop-blur-xl z-60 text-foreground sticky top-0 transition-all duration-300",
          isBackgroundOnly ? "opacity-0 pointer-events-none" : "",
        )}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            {/* Back arrow — only on sub-pages */}
            {isSubPage && (
              <button
                onClick={goHome}
                aria-label="Back to home"
                className="flex items-center justify-center rounded-full p-1 hover:bg-foreground/10 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            <div
              className="flex items-center gap-4 cursor-pointer select-none"
              onClick={goHome}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ContactLogo}
                alt="Gene Paul Mar Javier — Logo"
                width={36}
                height={36}
              />
              {translate("navName")}
            </div>
          </div>
          <SideBar />
        </div>
      </nav>

      {/* ── Desktop back button — fixed top-left, only on sub-pages ─── */}
      {isSubPage && (
        <button
          onClick={goHome}
          aria-label="Back to home"
          className={twMerge(
            "hidden lg:flex items-center gap-1.5 fixed top-6 left-6 z-50",
            "rounded-full border border-border bg-background/80 backdrop-blur-md",
            "px-3 py-1.5 text-sm font-medium text-muted-foreground",
            "shadow-sm hover:text-foreground hover:border-foreground/30 hover:bg-background",
            "transition-all duration-200",
            isBackgroundOnly ? "opacity-0 pointer-events-none" : "",
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
      )}

      {/* ── Main content area ───────────────────────────────────────── */}
      <main
        id="main-content"
        {...handlers}
        className={twMerge(
          "relative w-full h-full min-h-dvh px-6 py-12 mx-auto min-w-screen-xl lg:px-24 lg:py-0 select-none duration-300 transition-all",
          fontClass,
          isBackgroundOnly ? "opacity-0 pointer-events-none" : "",
          isDev ? "debug-screens" : "",
          pathname === PATH.ABOUT.path ? "overflow-x-hidden" : "",
        )}
      >
        {children}
      </main>
    </>
  );
};

export default SideBarLayout;
