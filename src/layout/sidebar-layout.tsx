"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSwipeable } from "react-swipeable";
import { twMerge } from "tailwind-merge";
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
  const { font, sidenavSwipeToggle, sidenavSwipeSensitivity, isBackgroundOnly } =
    useSettingsStore();
  useLocaleRefresh();

  const handlers = useSwipeable({
    onSwipedLeft: (event) => {
      if (sidenavSwipeToggle && Math.abs(event.deltaX) >= sidenavSwipeSensitivity) {
        setIsOpen(true);
      }
    },
    onSwipedRight: (event) => {
      if (Math.abs(event.deltaX) >= sidenavSwipeSensitivity) {
        setIsOpen(false);
      }
    },
  });

  const fontClass = {
    inter: "font-inter",
    "work-sans": "font-work-sans",
    poppins: "font-poppins",
  }[font] ?? "font-inter";

  return (
    <>
      {/* ── Mobile top nav ──────────────────────────────────────────── */}
      <nav
        className={twMerge(
          "block lg:hidden w-full h-fit py-2.5 px-6 bg-primary dark:bg-primary/60 backdrop-blur-xl z-[60] text-foreground sticky top-0 transition-all duration-300",
          isBackgroundOnly ? "opacity-0 pointer-events-none" : ""
        )}
      >
        <div className="flex items-center justify-between w-full">
          <div
            className="flex items-center gap-4 cursor-pointer select-none"
            onClick={() => {
              router.push(PATH.HOME.path);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            {/* next/image requires known dimensions for imported SVGs */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ContactLogo}
              alt="Gene Paul Mar Javier — Logo"
              width={36}
              height={36}
            />
            {translate("navName")}
          </div>
          <SideBar />
        </div>
      </nav>

      {/* ── Main content area ───────────────────────────────────────── */}
      <main
        {...handlers}
        className={twMerge(
          "relative w-full h-full min-h-dvh px-6 py-12 mx-auto min-w-screen-xl lg:px-24 lg:py-0 select-none duration-300 transition-all",
          fontClass,
          isBackgroundOnly ? "opacity-0 pointer-events-none" : "",
          isDev ? "debug-screens" : "",
          pathname === PATH.ABOUT.path ? "overflow-x-hidden" : ""
        )}
      >
        {children}
      </main>
    </>
  );
};

export default SideBarLayout;
