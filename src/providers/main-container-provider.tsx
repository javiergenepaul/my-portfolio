import React from "react";
import { ThemeProvider } from "./ThemeProvider";

interface MainContainerProviderInterface {
  children: React.ReactNode;
}

const MainContainerProvider = (props: MainContainerProviderInterface) => {
  const { children } = props;

  return (
    <ThemeProvider>
      {children}
      {/* <nav className="w-full h-fit py-2.5 px-6 bg-primary/60 backdrop-blur-xl z-[60] text-white sticky top-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
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
        className={`relative w-full h-full min-h-screen px-6 py-12 pt-4 md:pt-0 mx-auto font-sans min-w-screen-xl md:px-12 md:py-20 lg:px-24 lg:py-0 ${
          DEV_MODE && DEV_MODE === "development" ? "debug-screens" : ""
        }`}
      >
        <BackgroundAnimation />
        {children}
      </main> */}
    </ThemeProvider>
  );
};

export { MainContainerProvider };
export type { MainContainerProviderInterface };
