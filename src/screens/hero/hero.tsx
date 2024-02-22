import { usePageTitleStore } from "@/stores";
import { useEffect } from "react";
import { HeaderSection } from "./components";

export const Hero = () => {
  const { setTitle } = usePageTitleStore();

  useEffect(() => {
    setTitle("Home Page");
  }, []);

  return (
    <div className="lg:flex lg:justify-between lg:gap-4">
      <header className="lg:sticky lg:top-0 lg:flex lg:min-h-screen lg:w-2/5 lg:flex-col lg:justify-between lg:py-24">
        <HeaderSection />
      </header>
      <main className="pt-24 lg:w-3/5 lg:py-24 lg:min-h-screen">main body</main>
    </div>
  );
};
