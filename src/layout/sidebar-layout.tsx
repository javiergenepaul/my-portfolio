import React from "react";
import ContactLogo from "../assets/contact-logo.svg";
import { translate } from "@/i18n";
import { BackgroundAnimation, SideBar } from "@/components";
import { DEV_MODE, PATH } from "@/config";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import { useSiderStore, useThemeStore } from "@/stores";

interface SideBarLayoutInterface {
  children: React.ReactNode;
}

const SideBarLayout = (props: SideBarLayoutInterface) => {
  const { children } = props;
  const navigate = useNavigate();
  const { setIsOpen } = useSiderStore();
  const { font } = useThemeStore();

  const handlers = useSwipeable({
    onSwipedLeft: (event) => {
      const swipeDistance = Math.abs(event.deltaX);
      if (swipeDistance >= 200) {
        setIsOpen(true);
      }
    },
    onSwipedRight: (event) => {
      const swipeDistance = Math.abs(event.deltaX);
      if (swipeDistance >= 200) {
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
      <nav className="block lg:hidden w-full h-fit py-2.5 px-6 bg-primary dark:bg-primary/60 backdrop-blur-xl z-[60] text-foreground sticky top-0">
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
              alt="jav-logo.svg"
              className="w-[36px] h-[36px]"
            />
            {translate("navName")}
          </div>
          <SideBar />
        </div>
      </nav>
      <main
        {...handlers}
        className={`${fontSelected()} relative w-full h-full min-h-screen px-6 py-12 mx-auto min-w-screen-xl lg:px-24 lg:py-0 select-none ${
          DEV_MODE && DEV_MODE === "development" ? "debug-screens" : ""
        }`}
      >
        <BackgroundAnimation />
        {children}
      </main>
    </>
  );
};

export default SideBarLayout;
