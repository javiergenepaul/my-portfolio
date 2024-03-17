import React from "react";
import ContactLogo from "../assets/contact-logo.svg";
import { translate } from "@/i18n";
import { SideBar } from "@/components";
import { DEV_MODE, PATH } from "@/config";
import { useLocation, useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import { useSiderStore, useSettingsStore } from "@/stores";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";

interface SideBarLayoutInterface {
  children: React.ReactNode;
}

const SideBarLayout = (props: SideBarLayoutInterface) => {
  const { children } = props;
  const navigate = useNavigate();
  const location = useLocation();

  const { setIsOpen } = useSiderStore();
  const {
    font,
    sidenavSwipeToggle,
    sidenavSwipeSensitivity,
    isBackgroundOnly,
  } = useSettingsStore();
  const {} = useTranslation();

  const handlers = useSwipeable({
    onSwipedLeft: (event) => {
      const swipeDistance = Math.abs(event.deltaX);
      if (sidenavSwipeToggle && swipeDistance >= sidenavSwipeSensitivity) {
        setIsOpen(true);
      }
    },
    onSwipedRight: (event) => {
      const swipeDistance = Math.abs(event.deltaX);
      if (swipeDistance >= sidenavSwipeSensitivity) {
        setIsOpen(false);
      }
    },
  });

  const fontSelected = (): string => {
    switch (font) {
      case "inter":
        return "font-inter";
      case "work-sans":
        return "font-work-sans";
      case "poppins":
        return "font-poppins";
      default:
        return "font-inter";
    }
  };

  const scrollTopTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Optional - adds smooth scrolling
    });
  };

  return (
    <>
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
              navigate(PATH.HOME.path);
              scrollTopTop();
            }}
          >
            <img
              src={ContactLogo}
              alt="Gene Paul Mar Javier - Logo"
              className="w-[36px] h-[36px]"
            />
            {translate("navName")}
          </div>
          <SideBar />
        </div>
      </nav>
      <main
        {...handlers}
        className={twMerge(
          "relative w-full h-full min-h-dvh px-6 py-12 mx-auto min-w-screen-xl lg:px-24 lg:py-0 select-none duration-300 transition-all",
          `${fontSelected()} ${
            isBackgroundOnly ? "opacity-0 pointer-events-none" : ""
          } ${DEV_MODE && DEV_MODE === "development" ? "debug-screens" : ""} ${
            location.pathname === PATH.ABOUT.path ? "overflow-x-hidden" : ""
          }`
        )}
      >
        {children}
      </main>
    </>
  );
};

export default SideBarLayout;
