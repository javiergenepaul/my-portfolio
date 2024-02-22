import { usePageTitleStore } from "@/stores";
import { useEffect } from "react";

export const Hero = () => {
  const { setTitle } = usePageTitleStore();

  useEffect(() => {
    console.log("trigger");
    setTitle("Home Page");
  }, []);

  return <div>Hero</div>;
};
