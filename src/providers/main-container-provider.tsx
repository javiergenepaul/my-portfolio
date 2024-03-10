import React from "react";
import { ThemeProvider } from "./ThemeProvider";

interface MainContainerProviderInterface {
  children: React.ReactNode;
}

const MainContainerProvider = (props: MainContainerProviderInterface) => {
  const { children } = props;

  return <ThemeProvider>{children}</ThemeProvider>;
};

export { MainContainerProvider };
export type { MainContainerProviderInterface };
