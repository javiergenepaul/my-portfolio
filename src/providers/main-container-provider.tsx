import { BackgroundAnimation } from "@/components";
import React from "react";
import { ThemeProvider } from "./ThemeProvider";
import { DEV_MODE } from "@/config";

interface MainContainerProviderInterface {
  children: React.ReactNode;
}

const MainContainerProvider = (props: MainContainerProviderInterface) => {
  const { children } = props;

  return (
    <ThemeProvider>
      <main
        className={`relative w-full h-full min-h-screen px-6 py-12 mx-auto font-sans min-w-screen-xl md:px-12 md:py-20 lg:px-24 lg:py-0 ${
          DEV_MODE && DEV_MODE === "development" ? "debug-screens" : ""
        }`}
      >
        <BackgroundAnimation />
        {children}
      </main>
    </ThemeProvider>
  );
};

export { MainContainerProvider };
export type { MainContainerProviderInterface };
