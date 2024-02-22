import { BackgroundAnimation } from "@/components";
import { useThemeStore } from "@/stores";
import React from "react";

interface MainContainerProviderInterface {
  children: React.ReactNode;
}

const MainContainerProvider = (props: MainContainerProviderInterface) => {
  const { children } = props;
  const { darkMode } = useThemeStore();
  return (
    <div className={`${darkMode ? " dark" : ""}`}>
      <main className="mx-auto min-h-screen min-w-screen-xl h-full w-full px-6 py-12 font-sans md:px-12 md:py-20 lg:px-24 lg:py-0 relative">
        <BackgroundAnimation />
        {children}
      </main>
    </div>
  );
};

export { MainContainerProvider };
export type { MainContainerProviderInterface };
